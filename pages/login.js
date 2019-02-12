import React, { Component } from 'react'
import Head from 'next/head'
import Button from '../components/Button'
import MyLayout from '../components/MyLayout'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Heading from '../components/Heading'
import Footer from '../components/Footer'

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {}
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const user = {
      email: this.state.email,
      password: this.state.password,
    }

    console.log(user)
  }

  render() {
    const display = this.state.isConfirmed ? 'block' : 'none'

    return (
      <form id="login">
        <input
          type='text'
          name='email'
          id='email'
          placeholder='EMAIL ADDRESS'
          onChange={ this.handleInputChange }
          value={ this.state.email }
        />
        <input type='password'
          name='password'
          placeholder='PASSWORD'
          onChange={ this.handleInputChange }
          value={ this.state.password }
        />
        <div className="button-container">
          <Button type="submit" form="signup">Create Account</Button>
        </div>
      </form>
    )
  }
}

export default () => (
  <React.Fragment>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
    <Nav />
    <MyLayout alignment="center">
    <Heading style={{ marginTop: '80px' }}>Login</Heading>
    <Form />
    </MyLayout>
  </React.Fragment>
)
