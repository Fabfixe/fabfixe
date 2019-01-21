import Head from 'next/head'
import MyLayout from '../components/MyLayout'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Heading from '../components/Heading'
import Form from '../components/Form'
import Footer from '../components/Footer'

export default () => (
  <React.Fragment>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <Nav />
    <MyLayout alignment="center">
    <Heading style={{ marginTop: '80px' }}>Create an Account</Heading>
    <Form />
    </MyLayout>
  </React.Fragment>
)
