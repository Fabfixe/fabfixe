import Head from 'next/head'
import React, { Component } from 'react'
import MyLayout from '../../components/MyLayout'
import Nav from '../../components/Nav'
import Hero from '../../components/Hero'
import HowItWorks from '../../components/HowItWorks'
import Heading from '../../components/Heading'
import JoinForm from '../../components/Join'
import Footer from '../../components/Footer'
import { registerUser } from '../../actions/authentication'

class JoinRouting extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accountType: this.props.query.accountType
    }
  }

  static async getInitialProps({ query }) {
    return { query }
  }

  render() {
    return (
      <div className="moss-background">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <MyLayout alignment='center'>
          <Heading alignment='center' style={{ marginTop: '80px', width: '100%' }}>Create an Account</Heading>
          <JoinForm accountType={ this.state.accountType } />
        </MyLayout>
      </div>
    )
  }
}

export default JoinRouting
