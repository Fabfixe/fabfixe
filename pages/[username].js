import Head from 'next/head'
import React, { Component } from 'react'
import MyLayout from '../components/MyLayout'
import Nav from '../components/Nav'

import Profile from '../components/Profile'
import axios from 'axios'

function ProfileRouting({ profile, query }) {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MyLayout alignment="center">
        {profile.username ? <Profile { ...query } profile={profile} /> : <div>No profile</div> }
      </MyLayout>
    </div>
  )
}

ProfileRouting.getInitialProps = async (ctx) => {
  const { query } = ctx
  const config = ctx.req ? { baseURL: 'http://localhost:4000' } : {}
  return axios.post('/api/profile/username', { username: query.username }, config)
  .then((res) => {
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

export default ProfileRouting
