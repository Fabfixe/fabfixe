import React, { useState } from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Login from '../../components/Login'
import MyLayout from '../../components/MyLayout'
import Hero from '../../components/Hero'
import HowItWorks from '../../components/HowItWorks'
import Footer from '../../components/Footer'
import Button from '../../components/Button'
import axios from 'axios'

export default () => {
  const [ email, setEmail ] = useState('')
  const [ errors, setErrors ] = useState({})
  const [ success, setSuccess ] = useState('')

  const handleInputChange = (e) => {
    setEmail(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // check if email is in system
    axios.post('/api/users/email', { email: email.toLowerCase() })
    .then(({ data: { message } }) => {
      setSuccess(message)
    })
    .catch(({ response: {data} }) => {
      setErrors(data)
    })
  }

  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MyLayout alignment="center" width="column">
        <React.Fragment>
          <h1 alignment="center">Reset Password</h1>
            {success === '' && <form onSubmit={ handleSubmit }>
              <p className='form-detail'>Enter your email address and we’ll send you a link to reset it.</p>
              <div className="form-input">
                <input
                  type='text'
                  name='email'
                  id='email'
                  placeholder='EMAIL ADDRESS'
                  onChange={ handleInputChange }
                  value={ email }
                />
                {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
              </div>
              <div className="button-container">
                <Button type="submit">Submit</Button>
              </div>
            </form>}
            {success !== '' && <div className="confirmation-message">{success}</div>}
          </React.Fragment>
      </MyLayout>
    </React.Fragment>
  )
}
