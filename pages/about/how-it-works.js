import Head from 'next/head'
import MyLayout from '../../components/MyLayout'
import HowItWorks from '../../components/HowItWorks'
import Footer from '../../components/Footer'

// Will include blocks for both pupil and artists

export default () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <MyLayout background="moss-background">
      <HowItWorks heading="For Pupils" actionLink="/join/pupil" />
      <HowItWorks heading="For Artists" actionLink="/join/artist" />
      <Footer />
    </MyLayout>
  </div>
)
