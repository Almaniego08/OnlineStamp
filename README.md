# OnlineStamp

A browser tool for stamping PDFs. Open a PDF, add a **RECEIVED** or **RELEASED** stamp (with tracking number, date, time, approver initial and signature), text, a date, a time or an image, drag everything into place, then download the stamped PDF.

Everything happens on your device. The PDF is never uploaded.

## Features

- **Stamps:** RECEIVED and RELEASED stamps with tracking number, date, time, a fixed approver initial, and a selectable signature and name
- **Text, date, time and images:** with font size and color controls; images keep their proportions when resized
- **What you see is what you get:** the preview uses the PDF's own coordinates, so items land exactly where they appear
- **Move items your way:** drag on the page, nudge with the arrow keys (Shift for bigger steps), or align to the page edges and center
- **Multi-page PDFs:** each item stays on the page it was added to, and the download stamps every page
- **Zoom and pan:** zoom buttons, Fit width, Ctrl + scroll, and drag the page to pan when zoomed in
- **Light and dark mode**

## Using it

1. Click **Choose a PDF** or drop a PDF onto the page.
2. Go to the page you want to stamp and pick an item under **Add to page**.
3. Fill in its card on the left (tracking number, receiver, date, and so on).
4. Drag it into place on the PDF. Click an item to select it, then:
   - **Arrow keys** move it (hold **Shift** to move further)
   - **Delete** removes it
   - **Esc** clears the selection
5. Click **Download stamped PDF**. The file name defaults to `<your file>-stamped.pdf`.

## Run locally

Requires [Node.js](https://nodejs.org/) 18 or newer.

```bash
git clone https://github.com/Almaniego08/OnlineStamp.git
cd OnlineStamp
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Password

The deployed site is protected by a password. It is checked on Netlify's servers before any file is sent, so the app and the signature images can't be opened without it.

- **Set or change it:** in Netlify, go to **Site configuration → Environment variables**, add `APP_PASSWORD`, then redeploy. If it isn't set, the site stays locked.
- **Signing in:** the browser stays signed in for 7 days. The **Lock** button in the header signs out.
- **Changing the password** signs everyone out.

The check is in `netlify/edge-functions/password.ts`. It only runs on Netlify, so `npm run dev` doesn't ask for the password.

## Updating the stamps and signatures

The stamp, signature and initial images live in `src/pages/stamping/assets/images/` and are registered in `src/pages/stamping/data/images.tsx`. Use **transparent PNGs** so the images don't cover the document underneath.

Who can be picked as receiver or "released by", and who the approver is, are set at the top of:

- `src/pages/stamping/components/stamp-received-form.tsx`
- `src/pages/stamping/components/stamp-released-form.tsx`

The positions of the fields inside each stamp are set in `src/pages/stamping/components/received.tsx` and `released.tsx`.

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/), built with [Vite](https://vitejs.dev/)
- [pdf-lib](https://pdf-lib.js.org/) to write the stamped PDF, [react-pdf](https://github.com/wojtekmaj/react-pdf) to preview it
- [shadcn/ui](https://ui.shadcn.com/) (Tailwind CSS + Radix UI) and [Tabler Icons](https://tabler.io/icons)

## Authors

- **Alexander Luis Maniego** ([@Almaniego08](https://github.com/Almaniego08)) — owner
- **Adam C. Marcaida Jr.** ([@AdamJr-26](https://github.com/AdamJr-26))

## Credits and license

The UI started from [shadcn-admin](https://github.com/satnaing/shadcn-admin) by Sat Naing, used under the MIT License. See [LICENSE](LICENSE).
