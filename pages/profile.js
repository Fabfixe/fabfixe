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
    // return axios.post('/profile/username', { username: query.username })
    // .catch((err) => console.log(err))
    return axios.post('http://localhost:3000/api/profile/username', { username: query.username })
    .then((res) => {
      console.log('RES', res)
      const profile = res.data
      if(profile) {
        return { profile, query }
      } else {
        return { profile: null, query }
      }
    })
    .catch((err) =>  {
      return null
    })
  }

  render() {
    const { username } = this.props.query
    console.log(this.props.profile)
    return (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <MyLayout alignment="center">
          {this.props.profile.username ? <Profile { ...this.props.query } profile={this.props.profile} /> : <div>No profile</div> }
        </MyLayout>
      </div>
    )
  }
}

export default ProfileRouting
