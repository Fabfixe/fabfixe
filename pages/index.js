import Head from 'next/head'
import MyLayout from '../components/MyLayout'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import JoinHome from '../components/JoinHome'
import Footer from '../components/Footer'

export default () => (
  <React.Fragment>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <MyLayout home='home'>
      <Hero headline={<p>Hi, meet <br/>Fabfixe</p>} subheadline="Bridging the gap between the tutorial and your slay" />
      <HowItWorks actionLink="/account/joining-as" />
      <JoinHome />
      <Footer />
    </MyLayout>
  </React.Fragment>
)
