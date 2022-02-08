import Head from 'next/head'
import Image from 'next/image'
import Layout from '@/components/Layout'
import styles from '@/styles/Home.module.css'
import { API_URL } from '@/config/index'
import EventItem from '@/components/EventItem'
import Link from 'next/link'
export default function HomePage({ events }) {
  return (
    <div>
      <Layout >
        <h1>Upcoming Events</h1>
        {events.length === 0 && <h3>No events to show</h3>}

        {events.map((evt) => (
          <EventItem key={evt.id}  evt={evt.attributes} />
        ))}

        {events.length > 0 && (
          <Link href='/events'>
            <a className='btn-secondary'>
              View All Events
            </a>
          </Link>
        )}


        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </h1>

          <p className={styles.description}>
            Get started by editing{' '}
            <code className={styles.code}>pages/index.js</code>
          </p>

          <div className={styles.grid}>
            <a href="https://nextjs.org/docs" className={styles.card}>
              <h2>Documentation &rarr;</h2>
              <p>Find in-depth information about Next.js features and API.</p>
            </a>

            <a href="https://nextjs.org/learn" className={styles.card}>
              <h2>Learn &rarr;</h2>
              <p>Learn about Next.js in an interactive course with quizzes!</p>
            </a>

            <a
              href="https://github.com/vercel/next.js/tree/canary/examples"
              className={styles.card}
            >
              <h2>Examples &rarr;</h2>
              <p>Discover and deploy boilerplate example Next.js projects.</p>
            </a>

            <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              className={styles.card}
            >
              <h2>Deploy &rarr;</h2>
              <p>
                Instantly deploy your Next.js site to a public URL with Vercel.
              </p>
            </a>
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </Layout>



    </div>
  )
}


export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/events?populate=*`)
  const events = await res.json()
  return {
    props: { events:events.data.slice(0,2) },
    revalidate: 1,
  }
}