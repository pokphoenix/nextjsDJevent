import Link from "next/link";
import Layout from '@/components/Layout'


export default function AboutPage() {
  return (
    <div>
          <Layout title='About DJ Events' >
            <h1>AboutPage</h1>
            <p>This is an app to find the lastest DJ and other musical events</p>
            <Link href='/'>Home</Link>
          </Layout>
      
    </div>
  )
}
