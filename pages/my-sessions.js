import React, { Component } from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Login from '../components/Login'
import MyLayout from '../components/MyLayout'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Heading from '../components/Heading'
import Sessions from '../components/Sessions'

const MySessions = (props) => (
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

export default MySessions
