import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Head from 'next/head'
import PropTypes from 'prop-types'
import MyLayout from '../../components/MyLayout'
import Footer from '../../components/Footer'
import Button from '../../components/Button'
import validatePasswordReset from '../../validation/passwordReset'
import { useRouter } from 'next/router'
import axios from 'axios'

export default () => {
  const [ password, setPassword ] = useState('')
  const [ password_confirm, setPasswordConfirm ] = useState('')
  const [ errors, setErrors ] = useState({})
  const [ success, setSuccess ] = useState('')
  const { query: passwordResetToken } = useRouter()

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleConfirmChange = (e) => {
    setPasswordConfirm(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validation = validatePasswordReset(password, password_confirm)

    setErrors(validation.errors)
    if(validation.isValid) {
      // send the password as a plain text
      axios.post('/api/users/resetPassword', { passwordResetToken, password })
      .then(({ data: { message } }) => {
        setSuccess(message)
      })
      .catch(({ response: { data } }) => {
        setSuccess(data)
      })
    }
  }

  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MyLayout alignment="center" width="column">
        <React.Fragment>
          <h1 alignment="center">Reset Password</h1>
            {success === '' && <form onSubmit={handleSubmit}>
              <p className='form-detail'>Enter your new password here:</p>
              <div className="form-input">
                <input
                  type='text'
                  name='password'
                  id='password'
                  placeholder='PASSWORD'
                  onChange={ handlePasswordChange }
                  value={ password }
                />
                {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
              </div>
              <div className="form-input">
                <input
                  type='text'
                  name='password-confirm'
                  id='password-confirm'
                  placeholder='CONFIRM PASSWORD'
                  onChange={ handleConfirmChange }
                  value={ password_confirm }
                />
                {errors.password_confirm && (<div className="invalid-feedback">{errors.password_confirm}</div>)}
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
