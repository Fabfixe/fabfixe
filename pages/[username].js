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

// ProfileRouting.getStaticProps = async (ctx) => {
//   const { query } = ctx
//   console.log('QYERT', query)
//   const config = ctx.req ? { baseURL: 'http://localhost:4000' } : {}
//   console.log('config', config)
//   return axios.post('/api/profile/username', { username: query.username })
//   .then((res) => {
//     const profile = res.data
//     if(profile) {
//       console.log('profile', profile)
//       console.log('query', query)
//       return { profile, query }
//     } else {
//       return { profile: null, query }
//     }
//   })
//   .catch((err) =>  {
//     return null
//   })
// }

export default ProfileRouting
