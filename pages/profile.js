import Head from 'next/head'
import React, { Component } from 'react'
import MyLayout from '../components/MyLayout'
import Nav from '../components/Nav'
import Heading from '../components/Heading'
import Profile from '../components/Profile'

export default () => (
  <React.Fragment>
    <MyLayout alignment="center">
      <Profile />
    </MyLayout>
  </React.Fragment>
)
