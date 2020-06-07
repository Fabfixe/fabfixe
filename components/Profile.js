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

const ModalContent = (props) => (
    <React.Fragment>
    {props.pupilUsername ? (
    <React.Fragment>
      <h1 alignment="center">Request a Session</h1>
      <form onSubmit={ props.handleSubmit }>
        <Datetime
          isValidDate={validDateSelection}
          inputProps={{ placeholder: 'CLICK TO CHOOSE A DATE AND A START TIME' }}
          onChange={ props.onChange }
        />
        {props.errors.date && (<div className="invalid-feedback">{props.errors.date}</div>)}
        <h2>SESSION DURATION*</h2>
        <div className="select-container">
        <select
          onChange={ props.onSelect }
          name="duration"
          value={props.duration}
        >
          <option value="30 min">{`30 min: $${calcTotal("30 min", props.hourlyRate)}`}</option>
          <option value="1 hour">{`1 hour: $${calcTotal("1 hour", props.hourlyRate)}`}</option>
          <option value="1 hour 30 min">{`1 hour 30 min: $${calcTotal("1 hour 30 min", props.hourlyRate)}`}</option>
          <option value="2 hours">{`2 hours: $${calcTotal("2 hours", props.hourlyRate)}`}</option>
        </select>
        <p>▾</p>
        </div>
        <h2>CATEGORY</h2>
        <div className="select-container">
          <select
            onChange={ props.onSelect }
            name="expertise"
          >
            <option value="Eyes">Eyes</option>
            <option value="Lips">Lips</option>
            <option value="Foundation/Face">Foundation/Face</option>
            <option value="Nails">Nails</option>
            <option value="Styling">Styling</option>
            <option value="Braiding">Braiding</option>
            <option value="Natural Hair">Natural Hair</option>
            <option value="Wigs/Extensions">Wigs/Extensions</option>
          </select>
          <p>▾</p>
        </div>
        <div className="session-attachments">
          <label className="attachment">📎 Add Attachment</label>
          <AttachmentImageUploader onUpload={(url) => { props.getImageUrl(url) }}/>
        </div>
        <h2>LOOK DESCRIPTION*</h2>
        <textarea
          maxLength="250"
          onChange={props.onSelect}
          name="description"
        ></textarea>
        {props.errors.description && (<div className="invalid-feedback">{props.errors.description}</div>)}
        <div className="button-container">
          <Button type="submit">Send Request</Button>
        </div>
      </form>
      {props.submitted && <Banner
        style={{ height: '160px', zIndex:  1, padding: '30px' }}
        handleBanner={ () => ( window.location.reload() )}
        >
        <p>Congrats! Your session request with <b>{props.username}</b> has been sent</p>
        <p>{`Time: ${formatTime(props.date, props.duration)}`}</p>
        <p>{`Total: $${calcTotal(props.duration, props.hourlyRate)}`}</p>
      </Banner>}
    </React.Fragment>) : (
      <React.Fragment>
        {props.isAuthenticated ?
         (<Link href='/account/edit-profile/pupil'><a>Complete your profile to schedule a session</a></Link>) :
         (<Link href='/join/pupil'><a>Sign up to schedule a session</a></Link>)}
      </React.Fragment>
    )}
    </React.Fragment>
  )


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
                    <Button onClick={ this.handleModal }>REQUEST A SESSION</Button>
                  </div>}
                </li>
              </ul>
            </>}
            {this.state.showModal &&
            <Modal closeModal={this.handleModal}>
                <div className="center-modal">
                  <ModalContent
                    isAuthenticated={isAuthenticated}
                    username={username}
                    hourlyRate={hourlyRate}
                    date={this.state.date}
                    submitted={this.state.submitted}
                    errors={this.state.errors}
                    duration={this.state.duration}
                    pupilUsername={pupilUsername}
                    onSelect={this.onSelect}
                    onChange={this.onChange}
                    handleSubmit={this.handleSubmit}
                    getImageUrl={this.getImageUrl}
                  />
                </div>
              </Modal>}
        </div>
    )
  }
}

const mapStateToProps = (user) => ({ user })

export default connect(mapStateToProps)(Profile)
