import Head from 'next/head'
import React, { Component } from 'react'
import MyLayout from '../components/MyLayout'
import Nav from '../components/Nav'
import Heading from '../components/Heading'
import Profile from '../components/Profile'

class ProfileRouting extends Component {
  constructor(props) {
    super(props)
  }

  static async getInitialProps({ query }) {
    return { query }
  }

  render() {
    const { username } = this.props.query

    return (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <MyLayout alignment="center">
          <Profile { ...this.props.query }/>
        </MyLayout>
      </div>
    )
  }
}

export default ProfileRouting
