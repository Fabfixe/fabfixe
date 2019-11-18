import React, { Component, useEffect } from 'react'
import { connect } from 'react-redux'
import Head from 'next/head'
import PropTypes from 'prop-types'
import Login from '../../components/Login'
import MyLayout from '../../components/MyLayout'
import Hero from '../../components/Hero'
import HowItWorks from '../../components/HowItWorks'
import Heading from '../../components/Heading'
import Sessions from '../../components/Sessions'
import Router from 'next/router'

const MySessions = (props) => {
  useEffect(() => {
    console.log(props.auth)
    if(!props.auth.isAuthenticated) Router.push('/account/login')
  }, [])

  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MyLayout alignment="center">
        <Heading style={{ marginTop: '80px' }}>My Sessions</Heading>
        <Sessions />
      </MyLayout>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(MySessions)
