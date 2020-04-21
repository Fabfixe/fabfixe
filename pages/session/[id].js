import Head from 'next/head'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Nav from '../../components/Nav'

import VideoSession from '../../components/VideoSession'
import axios from 'axios'

class SessionRouting extends Component {

  static async getInitialProps (ctx) {
    const { query } = ctx
    const config = ctx.req ? { baseURL: 'http://localhost:4000' } : {}
    return axios.post('/api/sessions/bySessionId', { id: query.id }, config)
    .then((res) => {
      const session = res.data
      if(session) {
        return { session }
      } else {
        return { session: null }
      }
    })
    .catch((err) =>  {
      return null
    })
  }

  render() {
    return (
      <div>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Nav />
          {this.props.userId && <VideoSession { ...this.props } />}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  accountType: state.auth.user.accountType,
  errors: state.errors,
  userId: state.auth.user._id,
  username: state.profile.username,
  displayName: state.profile.displayName,
  profileImageUrl: state.profile.profileImageUrl,
  youtube: state.profile.youtube,
  instagram: state.profile.instagram,
  twitter: state.profile.twitter,
  facebook: state.profile.facebook,
  hourlyRate: state.profile.hourlyRate,
  expertise: state.profile.expertise,
  sessions: state.profile.sessions
})

export default connect(mapStateToProps)(SessionRouting)
