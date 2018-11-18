import "../scss/reset.scss"
import Head from 'next/head'
import MyLayout from '../components/MyLayout'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

export default () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <Nav />
    <MyLayout>
      <Hero headline="Placeholder Headline" subheadline="Placeholder Subheadline" />
      <HowItWorks actionLink="/joining-as" />
      <Footer />
    </MyLayout>
  </div>
)
