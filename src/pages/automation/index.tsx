import { Layout } from '@/components/custom/layout'
import { TopNav } from '@/components/top-nav'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Automations() {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <TopNav links={topNav} />
      </Layout.Header>
      <Layout.Body>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='email'>Email</TabsTrigger>
              <TabsTrigger value='Other1'>Other 1</TabsTrigger>
              <TabsTrigger value='Other2'>Other 2</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='email' className='space-y-4'>
            <div>
              Email automation
            </div>
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}

const topNav = [
  {
    title: 'NAP',
    href: 'automation',
    isActive: true,
  },

  {
    title: 'Other 1',
    href: 'automation/Other1',
    isActive: false,
  },
  {
    title: 'Other 2',
    href: 'automation/Other2',
    isActive: false,
  },
]
