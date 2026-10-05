/*
 * Password gate for the whole site (runs on Netlify's edge, before any file is served).
 *
 * The password is read from the APP_PASSWORD environment variable in Netlify:
 *   Site configuration -> Environment variables -> APP_PASSWORD
 * If it is not set, the site stays locked.
 *
 * After a correct password the browser gets an HttpOnly cookie for SESSION_DAYS.
 * Changing APP_PASSWORD logs everyone out.
 */

declare const Netlify: { env: { get(name: string): string | undefined } };

type Context = { next: () => Promise<Response> };

const COOKIE = 'onlinestamp_session';
const SESSION_DAYS = 7;
const LOGIN_PATH = '/__login';
const LOGOUT_PATH = '/__logout';

const encoder = new TextEncoder();

async function hmac(secret: string, message: string): Promise<string> {
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, '0')).join('');
}

// Constant-time comparison so the check does not leak how many characters matched
function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

function getCookie(request: Request, name: string): string | null {
    const header = request.headers.get('cookie') ?? '';
    for (const part of header.split(';')) {
        const [key, ...rest] = part.trim().split('=');
        if (key === name) return rest.join('=');
    }
    return null;
}

function page(body: string, status: number, headers: Record<string, string> = {}): Response {
    return new Response(body, {
        status,
        headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'no-store',
            'x-robots-tag': 'noindex',
            ...headers,
        },
    });
}

function loginPage(error = ''): string {
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>OnlineStamp – Sign in</title>
<style>
  :root { color-scheme: light dark; --bg: #f4f6f9; --card: #fff; --fg: #0f172a; --muted: #64748b; --border: #e2e8f0; --accent: #2563eb; --error: #dc2626; }
  @media (prefers-color-scheme: dark) { :root { --bg: #020817; --card: #0b1222; --fg: #f8fafc; --muted: #94a3b8; --border: #1e293b; --accent: #3b82f6; --error: #f87171; } }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 16px; background: var(--bg); color: var(--fg); font: 15px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  form { width: 100%; max-width: 360px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 28px; box-shadow: 0 8px 30px rgba(0,0,0,.06); }
  h1 { margin: 0 0 4px; font-size: 20px; }
  p { margin: 0 0 20px; color: var(--muted); font-size: 14px; }
  label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; }
  input { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; background: transparent; color: inherit; font: inherit; }
  input:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
  button { width: 100%; margin-top: 16px; padding: 10px; border: 0; border-radius: 8px; background: var(--accent); color: #fff; font: inherit; font-weight: 600; cursor: pointer; }
  .error { color: var(--error); font-size: 13px; margin: 8px 0 0; }
</style>
</head>
<body>
<form method="post" action="${LOGIN_PATH}">
  <h1>OnlineStamp</h1>
  <p>Enter the password to continue.</p>
  <label for="password">Password</label>
  <input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
  ${error ? `<p class="error" role="alert">${error}</p>` : ''}
  <button type="submit">Sign in</button>
</form>
</body>
</html>`;
}

export default async function passwordGate(request: Request, context: Context): Promise<Response> {
    const password = Netlify.env.get('APP_PASSWORD');
    if (!password) {
        return page('<h1>Locked</h1><p>APP_PASSWORD is not set in Netlify environment variables.</p>', 503);
    }

    const url = new URL(request.url);
    const token = await hmac(password, 'onlinestamp-session-v1');

    if (url.pathname === LOGOUT_PATH) {
        return new Response(null, {
            status: 303,
            headers: { location: '/', 'set-cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` },
        });
    }

    if (url.pathname === LOGIN_PATH && request.method === 'POST') {
        const form = await request.formData();
        const attempt = String(form.get('password') ?? '');
        // Compare HMACs so both sides are the same length and the comparison is constant-time
        if (safeEqual(await hmac(password, attempt), await hmac(password, password))) {
            return new Response(null, {
                status: 303,
                headers: {
                    location: '/',
                    'set-cookie': `${COOKIE}=${token}; Path=/; Max-Age=${SESSION_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`,
                },
            });
        }
        // Slow down guessing
        await new Promise((resolve) => setTimeout(resolve, 800));
        return page(loginPage('Wrong password. Try again.'), 401);
    }

    const session = getCookie(request, COOKIE);
    if (session && safeEqual(session, token)) {
        return context.next();
    }

    return page(loginPage(), 401);
}

export const config = { path: '/*' };
