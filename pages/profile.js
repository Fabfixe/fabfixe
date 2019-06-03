import Head from 'next/head'
import React, { Component } from 'react'
import MyLayout from '../components/MyLayout'
import Nav from '../components/Nav'
import Heading from '../components/Heading'
import Profile from '../components/Profile'
import axios from 'axios'

class ProfileRouting extends Component {
  constructor(props) {
    super(props)
  }

  static async getInitialProps({ query }) {
    return axios.post('/api/profile/username', { username: query.username })
    .then((res) => {
      const profile = res.data
      if(profile) return { profile, query }
    })
    .catch((err) =>  { profile: null, query })
  }

  render() {
    const { username } = this.props.query

    return (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <MyLayout alignment="center">
          <Profile { ...this.props.query } profile={this.props.profile}/>
        </MyLayout>
      </div>
    )
  }
}

export default ProfileRouting
