import { Layout } from '@/components/custom/layout'

export default function Nap() {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <p>NAP</p>
      </Layout.Header>

      <Layout.Body>
        <div>hello world</div>
      </Layout.Body>
    </Layout>
  )
}
