import React, { Component } from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Login from '../components/Login'
import MyLayout from '../components/MyLayout'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Heading from '../components/Heading'
import Footer from '../components/Footer'

export default () => (
  <React.Fragment>
    <MyLayout alignment="center">
    <Heading style={{ marginTop: '80px' }}>Login</Heading>
    <Login />
    </MyLayout>
  </React.Fragment>
)
