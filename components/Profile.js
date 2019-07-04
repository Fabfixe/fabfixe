import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Heading from '../components/Heading'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Link from 'next/link'
import Datetime from 'react-datetime'
import AttachmentImageUploader from '../components/AttachmentImageUploader'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import moment from 'moment'
import validateSessionSubmit from '../validation/sessionSubmit'
import { currencyFormatted, calcTotal, timeMap, formatTime, validDateSelection } from '../helpers'
import { addSession } from '../actions/session'

const ModalContent = (props) => (
  <React.Fragment>
  {props.pupilUsername ? (
  <React.Fragment>
    <Heading>Request a Session</Heading>
    <form onSubmit={ props.handleSubmit }>
      <Datetime
        isValidDate={validDateSelection}
        inputProps={{ placeholder: 'CLICK TO CHOOSE A DATE AND A START TIME' }}
        onChange={ props.onChange }
      />
      {props.errors.date && (<div className="invalid-feedback">{props.errors.date}</div>)}
      <h2>SESSION DURATION*</h2>
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
      <h2>CATEGORY</h2>
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
      <label>📎 Add Attachment
        <AttachmentImageUploader onUpload={(url) => { props.getImageUrl(url) }}/>
      </label>
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
    {props.submitted && <div className="submitted">
      <p>Congrats! Your session request with <b>{props.username}</b> has been sent</p>
      <p>Time: {formatTime(props.date, props.duration)}</p>
      <p>Total: ${calcTotal(props.duration, props.hourlyRate)}</p>
    </div>}
  </React.Fragment>) : (
    <React.Fragment>
      {props.isAuthenticated ?
       (<Link href='/account/edit-profile/pupil'>Complete your profile to schedule a session</Link>) :
       (<Link href='/join/pupil'>Sign up to schedule a session</Link>)}
    </React.Fragment>
  )}
  </React.Fragment>
)

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profile: this.props.profile,
      showModal: false,
      duration: "30 min",
      attachment: '',
      date: null,
      category: "Eyes",
      description: '',
      errors: {},
      submitted: false
    }

    this.handleModal = this.handleModal.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getImageUrl = this.getImageUrl.bind(this)
  }

  handleModal() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  getImageUrl(url) {
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
      pupil: this.props.user.auth.user._id,
      status: 'pending',
      messages: []
    }

    const validation = validateSessionSubmit(session)
    if(validation.isValid) {
      axios.post('/api/sessions', session)
        .then((res) => {
          this.props.addSession(res.data)
          this.setState({ submitted: true })
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
          <Heading>{this.props.username}</Heading>
            <ul>
              {profileImageUrl && <li style={{ width: '40px',
                height: '40px',
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
                  <Button onClick={ this.handleModal }>Request a Session</Button>
                </div>}
              </li>
            </ul>
            {this.state.showModal &&
            <Modal handleModal={this.handleModal}>
                <ModalContent
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
                  getImageUrl={this.getImageUrl} />
              </Modal>
            }
        </div>
    )
  }
}

const mapStateToProps = (user) => ({ user })

export default connect(mapStateToProps, { addSession })(Profile)
