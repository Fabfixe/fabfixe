import Head from 'next/head'
import Link from 'next/link'
import MyLayout from '../../components/MyLayout'
import Nav from '../../components/Nav'
import Button from '../../components/Button'
import HowItWorks from '../../components/HowItWorks'
import Footer from '../../components/Footer'
const classnames = require('classnames')

export default () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <Nav />
    <MyLayout>
      <div style={{ height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center' }}
      className={classnames("join-container", "moss-background")}>
        <div className="options-container">
          <h2 style={{ marginBottom: "20px" }}>I'm joining as a:</h2>
          <div>
          <Link href="/accountType?pupil" as="/join/pupil">
            <p className="join-link">Pupil</p>
          </Link>
          <Link href="/accountType?artist" as="/join/artist">
            <p className="join-link">Artist</p>
          </Link>
          </div>
        </div>
      </div>
    </MyLayout>
  </div>
)
