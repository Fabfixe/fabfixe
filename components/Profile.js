import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Heading from '../components/Heading'
import Button from '../components/Button'
import Link from 'next/link'
import AttachmentImageUploader from '../components/AttachmentImageUploader'
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import Datetime from 'react-datetime'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profile: {},
      showModal: false,
      duration: "30 min",
      attachment: '',
      date: null,
      category: "Eyes",
      description: '',
    }

    this.handleModal = this.handleModal.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    axios.post('/api/profile/username', { username: this.props.username })
    .then((res) => {
      const profile = res.data
      this.setState({ profile })
    })
    .catch((err) => console.log(err))
  }

  handleModal() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  getImageUrl(url) {
    console.log(url)
    this.setState({ attachment: url})
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

  handleSubmit() {
    console.log('handle submit')
  }

  render() {
    const { isAuthenticated } = this.props.user.auth
    const { accountType } = this.props.user.auth.user
    const pupilUsername = this.props.user.profile.username
    const { username, expertise, facebook, instagram, twitter, youtube, profileImageUrl, hourlyRate } = this.state.profile

    return (
      <React.Fragment>
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
            {accountType === 'artist' || <div className="button-container">
              <Button onClick={ this.handleModal }>Request a Session</Button>
            </div>}
          </li>
        </ul>
        {this.state.showModal && <div className='modal'>
          <div onClick={ this.handleModal } className="close">X</div>
          <div className="center">
            <div className="modal-content">
              {pupilUsername ? (
                <React.Fragment>
                  <Heading>Request a Session</Heading>
                  <form onSubmit={ this.handleSubmit }>
                  <Datetime
                    inputProps={{ placeholder: 'CLICK TO CHOOSE A DATE AND A START TIME' }}
                    onChange={ this.onChange }
                  />
                  <h2>SESSION DURATION*</h2>
                  <select
                    onChange={ this.onSelect }
                    name="duration"
                    value={this.state.duration}
                  >
                    <option value="30 min">30 min</option>
                    <option value="1 hour">1 hour</option>
                    <option value="1 hour 30 min">1 hour 30 min</option>
                    <option value="2 hours">2 hours</option>
                  </select>
                  <h2>CATEGORY</h2>
                  <select
                    onChange={ this.onSelect }
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
                    <AttachmentImageUploader onUpload={(url) => { this.getImageUrl(url) }}/>
                  </label>
                  <h2>LOOK DESCRIPTION*</h2>
                  <textarea
                    maxLength="250"
                    onChange={ this.onSelect }
                    name="description"
                  ></textarea>
                  <div className="button-container">
                    <Button type="submit">Send Request</Button>
                  </div>
                </form>
                </React.Fragment>) : (
                  <React.Fragment>
                    {isAuthenticated ? (<Link href='/edit-profile/pupil'>Complete your profile to schedule a session</Link>) :
                     (<Link href='/join/pupil'>Sign up to schedule a session</Link>)}
                  </React.Fragment>
                )}
            </div>
          </div>
        </div>}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (user) => ({
  user
})

export default connect(mapStateToProps)(Profile)
