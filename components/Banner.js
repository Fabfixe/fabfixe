import React, { Component } from 'react'

const Banner = (props) => (
  <div className="banner">
    <div onClick={ props.handleBanner } className="banner-close">x</div>
    <div className="banner-content">
      {this.props.children}
    </div>
  </div>
)

export default Banner
