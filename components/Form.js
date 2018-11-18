import '../scss/form.scss'
import React, { Component } from 'react'
import Button from '../components/Button'

const Field = () => (
    <input></input>
)


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirmed: false
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isConfirmed: !state.isConfirmed
    }));
  }

  render() {
    const display = this.state.isConfirmed ? 'block' : 'none'

    return (
      <form id="signup">
        <input type='text' name='firstName' placeholder='FIRST NAME'></input>
        <input type='text' name='lastName' placeholder='LAST NAME'></input>
        <input type='text' name='email' id='email' placeholder='EMAIL ADDRESS'></input>
        <input type='password' name='password' placeholder='PASSWORD'></input>
        <div className='terms'>
          <div className='box' onClick={ this.handleClick }>
            <svg style={{ display }} id="icon-check" viewBox="0 0 24 24" width="100%" height="100%">
              <path d="M9 16.172L19.594 5.578 21 6.984l-12 12-5.578-5.578L4.828 12z"></path>
            </svg>
          </div>
          <span>By clicking "Create Account" you agree to FabFixe Privacy Policy and Terms of service</span>
        </div>
        <div className="button-container">
          <Button type="submit" form="signup">Create Account</Button>
        </div>
      </form>
    )
  }
}

export default Form
