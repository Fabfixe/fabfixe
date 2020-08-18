import Head from 'next/head'
import React, { Component } from 'react'
import MyLayout from '../../components/MyLayout'
import Nav from '../../components/Nav'
import Hero from '../../components/Hero'
import HowItWorks from '../../components/HowItWorks'

import JoinForm from '../../components/Join'
import Footer from '../../components/Footer'
import { registerUser } from '../../actions/authentication'
import Link from 'next/link'

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
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <MyLayout alignment='center'>
          <h1 alignment='center' style={{ width: '100%' }}>Create an Account</h1>
          <p className="join-note">Already have an account? Login <Link href="/account/login"><a>here</a></Link></p>
          <JoinForm accountType={ this.state.accountType } />
        </MyLayout>
      </div>
    )
  }
}

export default JoinRouting
