import React, { Component } from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Login from '../../components/Login'
import MyLayout from '../../components/MyLayout'
import Hero from '../../components/Hero'
import HowItWorks from '../../components/HowItWorks'

import Footer from '../../components/Footer'

export default () => (
  <React.Fragment>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <MyLayout alignment="center">
      <h1 alignment="center" style={{ marginTop: '80px' }}>Login</h1>
      <Login />
    </MyLayout>
  </React.Fragment>
)
