import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../components/Button'
import Router from 'next/router'
import { connect } from 'react-redux'
import { loginUser } from '../actions/authentication'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      errors: {}
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    if(this.props.auth.isAuthenticated) {
      Router.push('/')
    }
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault()

    const user = {
      email: this.state.email.toLowerCase(),
      password: this.state.password,
    }

    this.props.loginUser(user)
  }

  componentWillReceiveProps(nextProps) {

    if(nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      })
    }
  }

  render() {
    const {errors} = this.state

    return (
      <form id="login" onSubmit={ this.handleSubmit }>
        <input
          type='text'
          name='email'
          id='email'
          placeholder='EMAIL ADDRESS'
          onChange={ this.handleInputChange }
          value={ this.state.email }
        />
        {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
        <input type='password'
          name='password'
          placeholder='PASSWORD'
          onChange={ this.handleInputChange }
          value={ this.state.password }
        />
        {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
        <div className="button-container">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    )
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})

export default connect(mapStateToProps, { loginUser })(Login)
