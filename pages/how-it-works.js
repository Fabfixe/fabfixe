import "../scss/reset.scss"
import Head from 'next/head'
import MyLayout from '../components/MyLayout'
import Nav from '../components/Nav'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

// Will include blocks for both pupil and artists

export default () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <MyLayout>
      <Nav />
      <HowItWorks actionLink="/create-account-pupil" />
      <HowItWorks actionLink="/create-account-artist" />
      <Footer />
    </MyLayout>
  </div>
)
