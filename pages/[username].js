import Head from 'next/head'
import React, { Component } from 'react'
import MyLayout from '../components/MyLayout'
import Nav from '../components/Nav'
import Heading from '../components/Heading'
import Profile from '../components/Profile'
import axios from 'axios'

function Whatever({name}) {
  console.log('props', name)
  return <div></div>
}

Whatever.getInitialProps = async ({ query }) => {
  console.log(query)
  return { name: 'carron' }
}

export default Whatever
