import React, { Component } from 'react'

const Banner = (props) => (
  <div style={props.style} className="banner">
    <div onClick={ props.handleBanner } className="banner-close">✕</div>
    <div className="banner-content">
      {props.children}
    </div>
  </div>
)

export default Banner
