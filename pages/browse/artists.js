import Head from 'next/head'
import MyLayout from '../../components/MyLayout'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import Heading from '../../components/Heading'
import ArtistList from '../../components/ArtistList'

export default () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <MyLayout>
      <Nav />
      <ArtistList/>
      <Footer />
    </MyLayout>
  </div>
)
