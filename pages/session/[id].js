import Head from 'next/head'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import Nav from '../../components/Nav'

import VideoSession from '../../components/VideoSession'
import axios from 'axios'

const SessionRouting = (props) => {

  const router = useRouter()
  const { id } = router.query

  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Nav />
        {props.userId && <VideoSession id={id} {...props} />}
    </div>
  )
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
