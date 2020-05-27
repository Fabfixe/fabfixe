import React, { Component } from 'react'
import Button from '../components/Button'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import PropTypes from 'prop-types'
import { registerUser } from '../actions/authentication'

class JoinForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password_confirm: '',
      errors: {},
      isConfirmed: false,
      submitted: false,
      accountType: this.props.accountType
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
    e.preventDefault()
    this.setState({ submitted: true })
    if(!this.state.isConfirmed) return

    const user = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
      password_confirm: this.state.password_confirm,
      accountType: this.state.accountType
    }

    this.props.registerUser(user)
  }

  // componentDidUpdate(prevProps) {
  //   if(Object.keys(this.props.errors)) {
  //     this.setState({
  //       errors: this.props.errors
  //     })
  //   }
  // }

  handleClick() {
    this.setState(state => ({
      isConfirmed: !state.isConfirmed
    }));
  }

  render() {
    const display = this.state.isConfirmed ? 'block' : 'none'
    const { errors } = this.props

    return (
      <form id="signup" onSubmit={ this.handleSubmit }>
        <input
        type='text'
        name='firstName'
        placeholder='FIRST NAME'
        onChange={ this.handleInputChange }
        value={ this.state.firstName }
        />
        {errors.firstName && (<div className="invalid-feedback">{errors.firstName}</div>)}
        <input
          type='text'
          name='lastName'
          placeholder='LAST NAME'
          onChange={ this.handleInputChange }
          value={ this.state.lastName }
        />
        {errors.lastName && (<div className="invalid-feedback">{errors.lastName}</div>)}
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
        <input type='password'
          name='password_confirm'
          placeholder='CONFIRM PASSWORD'
          value={ this.state.password }
          onChange={ this.handleInputChange }
          value={ this.state.password_confirm }
        />
        {errors.password_confirm && (<div className="invalid-feedback">{errors.password_confirm}</div>)}
        <div className='terms'>
          <div className='box' onClick={ this.handleClick }>
            <svg style={{ display }} id="icon-check" viewBox="0 0 24 24" width="100%" height="100%">
              <path d="M9 16.172L19.594 5.578 21 6.984l-12 12-5.578-5.578L4.828 12z"></path>
            </svg>
          </div>
          <span>By clicking "Create Account" you agree to our Privacy Policy and Terms of service</span>
        </div>
        {this.state.submitted && !this.state.isConfirmed && <div className="invalid-feedback">Required</div>}
        <div className="button-container">
          <Button type="submit">Create Account</Button>
        </div>
      </form>
    )
  }
}

JoinForm.propTypes = {
  registerUser: PropTypes.func.isRequired,
  accountType: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  errors: state.errors
})

export default connect(mapStateToProps, { registerUser })(JoinForm)
