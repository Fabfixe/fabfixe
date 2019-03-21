import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }


  render() {

    return (
      <div>Profile</div>
    )
  }
}

Profile.propTypes = {

}

const mapStateToProps = state => ({
})

export default connect(mapStateToProps)(Profile)
