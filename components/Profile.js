require('dotenv').config()
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Banner from '../components/Banner'
import Link from 'next/link'
import Datetime from 'react-datetime'
import AttachmentImageUploader from '../components/AttachmentImageUploader'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import moment from 'moment-timezone'
import validateSessionSubmit from '../validation/sessionSubmit'
import { currencyFormatted, calcTotal, timeMap, formatTime, validDateSelection } from '../helpers'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      profile: {},
      showModal: false,
      duration: "30 min",
      attachment: '',
      date: null,
      category: "Eyes",
      description: '',
      errors: {},
      submitted: false,
    }

    this.handleModal = this.handleModal.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getImageUrl = this.getImageUrl.bind(this)
  }

  componentDidMount() {
    axios.post('/api/profile/username', { username: this.props.username })
      .then((res) => {
        const profile = res.data
        if(profile) {
          this.setState({ loading: false, profile })
        } else {
          this.setState({ loading: false })
        }
      })
  }

  handleModal() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  getImageUrl({url}) {
    this.setState({ attachment: url })
  }

  onChange(date) {
    this.setState({ date })
  }

  onSelect(e) {
    e.preventDefault()
    let newState = {}
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }

  handleSubmit(e) {
    e.preventDefault()

    const { date, category, attachment, duration, description } = this.state
    const session = {
      date,
      category,
      attachment,
      description,
      duration: timeMap[duration],
      artist: this.state.profile._id,
      artistDisplayName: this.state.profile.displayName,
      artistUsername: this.props.username,
      pupilUsername: this.props.user.profile.username,
      pupil: this.props.user.auth.user._id,
      status: 'pending',
      artistApproved: false,
      messages: [],
    }

    const validation = validateSessionSubmit(session)
    if(validation.isValid) {
      axios.post('/api/sessions', session)
        .then((res) => {
          // Email both parties to notify session requested
          axios.post('/api/emails/sessionRequested', session)
          this.setState({ submitted: true })
        })
        .catch((e) => {
          console.log('error with session submission:', e)
        })
    } else {
      this.setState({
        errors: validation.errors,
      })
    }
  }

  render() {
    const { isAuthenticated } = this.props.user.auth
    const pupilUsername = this.props.user.profile.username
    const { username, isArtist, expertise, facebook, instagram, twitter, youtube, profileImageUrl, hourlyRate } = this.state.profile

    return (
      <div className="profile">
      {this.state.loading && <p>Loading</p>}
      {!this.state.loading && !this.state.profile.username && <p>No profile found</p>}
        {!this.state.loading && this.state.profile.username &&
          <>
            <h1>{this.props.username}</h1>
            <ul>
              {profileImageUrl && <li className="artist-image" style={{
                borderRadius: '50%',
                backgroundImage: `url(${profileImageUrl})`,
                backgroundSize: 'cover' }} />}
              {youtube && <li>{`YouTube: @${youtube}`}</li>}
              {instagram && <li>{`Instagram: @${instagram}`}</li>}
              {twitter && <li>{`Twitter: @${twitter}`}</li>}
              {facebook && <li>{`Facebook: @${facebook}`}</li>}
              {hourlyRate && <li>{`Hourly Rate: $${hourlyRate}`}</li>}
              {expertise && expertise.hair.length > 0 && <li>{`Hair Skills: ${expertise.hair.join(', ')}`}</li>}
              {expertise && expertise.makeup.length > 0 && <li>{`Makeup Skills: ${expertise.makeup.join(', ')}`}</li>}
                <li style={{ marginTop: '30px'}}>
                  {isArtist && <div className="button-container">
                    {this.props.user.auth.user.accountType === 'pupil'? <Link href="/request/[id]/[step]" as={`/request/${this.state.profile._id}/one`}>
                      <Button>REQUEST A SESSION</Button>
                    </Link> : <Link href="/account/joining-as">
                      <Button>REGISTER TO REQUEST</Button>
                    </Link>}
                  </div>}
                </li>
              </ul>
            </>}
        </div>
    )
  }
}

const mapStateToProps = (user) => ({ user })

export default connect(mapStateToProps)(Profile)
