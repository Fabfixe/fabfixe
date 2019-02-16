import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
const classnames = require('classnames')

const navStyle = {
  display: "flex",
  alignItems: "center",
  width: "100vw",
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
    store.dispatch({ type: 'FOO', payload: 'foo' }) // component will be able to read from store's state when rendered
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
          <NavLinks isLoggedIn={ false } />
        </div>
      </React.Fragment>
    )
  }
}

const NavLinks = (props) => (
  props.isLoggedIn ? (
    <React.Fragment>
      <Link href="">
        <a>My Account</a>
      </Link>
      <Link href="/how-it-works">
        <a>How It Works</a>
      </Link>
      <Link href="">
        <a>Browse Artists</a>
      </Link>
      { props.userType === "client" || <Link href="/artists">
        <a>For Artists</a>
      </Link> }
    </React.Fragment>
    ) : (
      <React.Fragment>
        <Link href="/joining-as">
          <a>Join</a>
        </Link>
        <Link href="/how-it-works">
          <a>How It Works</a>
        </Link>
        <Link href="">
          <a>Browse Artists</a>
        </Link>
        { props.userType === "client" || <Link href="/artists">
          <a>For Artists</a>
        </Link> }
      </React.Fragment>
    )
)

const mapStateToProps = (wtv) => (wtv)

const Nav = (props) => {

  return (
    <nav style={ navStyle }>
      <Link href="/">
        <a className="nav-logo">logo</a>
      </Link>
      <div className="nav-links" style={ navLinksStyle }>
        <div className="nav-links__inner">
          <NavLinks display={ props.display } isLoggedIn={ props.isLoggedIn } />
        </div>
        <Hamburger { ...props }/>
      </div>
    </nav>
  )
}

export default connect(mapStateToProps)(Nav)
