import React, { Component } from 'react'
import Link from 'next/link'
import { logoutUser } from '../actions/authentication'
import { connect } from 'react-redux'
const classnames = require('classnames')

const navStyle = {
  display: "flex",
  alignItems: "center",
  width: "100%",
}

const navLinksStyle = {
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
  paddingRight: "15px",
}

class Hamburger extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isActive: false
    }

    this.handleClick = this.handleClick.bind(this);
  }

  static getInitialProps({store, isServer, pathname, query}) {
    return { custom: 'custom' } // you can pass some custom props to component from here
  }

  handleClick() {
    this.setState(state => ({
      isActive: !state.isActive
    }));
  }

  render() {
    const navClasses = classnames("hamburger", "hamburger--slider", { "is-active": this.state.isActive })
    const menuClasses = classnames("menu", { "is-active": this.state.isActive })
    return (
      <React.Fragment>
          <button className={ navClasses } onClick={ this.handleClick } type="button">
            <span className="hamburger-box">
            <span className="hamburger-inner"></span>
            </span>
          </button>
        <div onClick={ this.handleClick } className={ menuClasses }>
          <NavLinks { ...this.props } />
        </div>
      </React.Fragment>
    )
  }
}

class NavLinks extends Component {
  constructor(props) {
    super(props)

    this.onLogout = this.onLogout.bind(this)
  }

  onLogout(e) {
    e.preventDefault()
    this.props.logoutUser()
  }

  render() {

    return (
      this.props.auth.isAuthenticated ? (
          <React.Fragment>
            <Link href={`/account/edit-profile/${this.props.auth.user.accountType}`}>
              <a>Edit Profile</a>
            </Link>
            <Link href="/account/my-sessions">
              <a>My Sessions</a>
            </Link>
            <Link href="/about/how-it-works">
              <a>How It Works</a>
            </Link>
            <Link href="">
              <a>Browse Artists</a>
            </Link>
            {this.props.auth.user.accountType === "pupil" || <Link href="/about/artists">
              <a>For Artists</a>
            </Link>}
            <Link href="">
              <a
              onClick={this.onLogout.bind(this)}
              >Log Out</a>
            </Link>
          </React.Fragment>
        ) : (
        <React.Fragment>
          <Link href="/account/joining-as">
            <a>Join</a>
          </Link>
          <Link href="/account/login">
            <a>Log In</a>
          </Link>
          <Link href="/about/how-it-works">
            <a>How It Works</a>
          </Link>
          <Link href="">
            <a>Browse Artists</a>
          </Link>
          { this.props.userType === "client" || <Link href="/about/artists">
            <a>For Artists</a>
          </Link> }
        </React.Fragment>
      )
    )
  }
}

const Nav = (props) => {

  return (
    <nav style={ navStyle }>
      <Link href="/">
        <a className="nav-logo">logo</a>
      </Link>
      <div className="nav-links" style={ navLinksStyle }>
        <div className="nav-links__inner">
          <NavLinks { ...props }  />
        </div>
        <Hamburger { ...props }/>
      </div>
    </nav>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logoutUser })(Nav)
