import Head from 'next/head'
import React, { Component } from 'react'
import MyLayout from '../components/MyLayout'
import { useRouter } from 'next/router'

import Profile from '../components/Profile'
import axios from 'axios'

const ProfileRouting = () => {
  const router = useRouter()
  const { username } = router.query

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MyLayout alignment="center" justify="top">
        <Profile username={username} />
      </MyLayout>
    </div>
  )
}

export default ProfileRouting
