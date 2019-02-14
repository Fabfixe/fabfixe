import React, { Component } from 'react'
import Button from '../components/Button'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import PropTypes from 'prop-types'
import { registerUser } from '../actions/authentication'

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password_confirm: '',
      errors: {},
      isConfirmed: false
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirm: this.state.password_confirm
    }
    this.props.registerUser(user)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      })
    }
  }

  handleClick() {
    this.setState(state => ({
      isConfirmed: !state.isConfirmed
    }));
  }

  render() {
    const display = this.state.isConfirmed ? 'block' : 'none'
    const { errors } = this.state

    return (
      <form id="signup" onSubmit={ this.handleSubmit }>
        <input
        type='text'
        name='firstName'
        placeholder='FIRST NAME'
        onChange={ this.handleInputChange }
        value={ this.state.firstName }
        />
        <input
          type='text'
          name='lastName'
          placeholder='LAST NAME'
          onChange={ this.handleInputChange }
          value={ this.state.lastName }
        />
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
        <input type='password'
          name='password_confirm'
          placeholder='CONFIRM PASSWORD'
          onChange={ this.handleInputChange }
          value={ this.state.password }
          onChange={ this.handleInputChange }
          value={ this.state.password_confirm }
        />
        <div className='terms'>
          <div className='box' onClick={ this.handleClick }>
            <svg style={{ display }} id="icon-check" viewBox="0 0 24 24" width="100%" height="100%">
              <path d="M9 16.172L19.594 5.578 21 6.984l-12 12-5.578-5.578L4.828 12z"></path>
            </svg>
          </div>
          <span>By clicking "Create Account" you agree to FabFixe Privacy Policy and Terms of service</span>
        </div>
        <div className="button-container">
          <Button type="submit">Create Account</Button>
        </div>
      </form>
    )
  }
}

Form.propTypes = {
  registerUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  errors: state.errors
})

export default connect(mapStateToProps, { registerUser} )(Form)
