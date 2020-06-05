import React, { Component, useEffect, useState } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import { logoutUser } from '../actions/authentication'
import { connect } from 'react-redux'
const classnames = require('classnames')

let navStyle = {
  display: "flex",
  alignItems: "center",
  width: '100vw'
}

const navLinksStyle = {
  display: "flex",
  justifyContent: "flex-end",
  width: "100%",
 }

class Hamburger extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isActive: false
    }

    this.handleClick = this.handleClick.bind(this);
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
    Router.push('/')
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
            <Link href="/account/my-calendar">
              <a>My Calendar</a>
            </Link>
            <Link href="/browse/artists">
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
          <Link href="/browse/artists">
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
  const [navClass, setNavClass] = useState('')

  useEffect(() => {
    if(window.location.pathname === '/') {
      window.onscroll = () => {
        if(window.scrollY < 65)  setNavClass('')
        if(window.scrollY > 65)  setNavClass('dark')
      }
    } else {
      setNavClass('dark')
    }
  }, [])

  return (
    <nav className={navClass} style={ navStyle }>
      <Link href="/">
        <a className="nav-logo"></a>
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
