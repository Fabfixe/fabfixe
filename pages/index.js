import Head from 'next/head'
import MyLayout from '../components/MyLayout'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

export default () => (
  <React.Fragment>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <MyLayout>
      <Hero headline="Placeholder Headline" subheadline="Placeholder Subheadline" />
      <HowItWorks actionLink="/account/joining-as" />
      <Footer />
    </MyLayout>
  </React.Fragment>
)
