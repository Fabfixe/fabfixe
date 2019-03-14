import Head from 'next/head'
import React, { Component } from 'react'
import MyLayout from '../components/MyLayout'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Button from '../components/Button'
import HowItWorks from '../components/HowItWorks'
import Heading from '../components/Heading'
import ImageUploader from '../components/ImageUploader'
import Footer from '../components/Footer'
import validateUsernameInput from '../validation/username'
import validateProfileSubmit from '../validation/profileSubmit'
import axios from 'axios'

import { connect } from 'react-redux'
import { updateProfile } from '../actions/updateProfile'
const classnames = require('classnames')

class CreateProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accountType: this.props.query.accountType,
      flagErrors: false,
      errors: {},
      username: this.props.username,
      profileImageUrl: '',
      YouTubeHandle: '',
      InstagramHandle: '',
      TwitterHandle: '',
      FacebookHandle: '',
      hourlyRate: '',
      expertise: {
        hair: [ 'Styling', 'Braiding', 'Natural Hair', 'Wigs/Extensions' ],
        makeup: [ 'Eyes', 'Lips', 'Foundation/Face', 'Nails' ]
      },
      selectedExpertise: {
        makeup: [],
        hair: []
      }
    }

    this.handleUsernameBlur = this.handleUsernameBlur.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateSkill = this.updateSkill.bind(this)
    this.getImageUrl = this.getImageUrl.bind(this)
  }

  static async getInitialProps({ query }) {
    return { query }
  }

  handleUsernameBlur(e) {
    e.persist()

    this.setState((prevState) => {
      const errors = validateUsernameInput(e.target.value).errors

      if(errors.username) {
        return {
          errors
        }
      } else {
        return {
          flagErrors: false,
          errors: {},
          username: e.target.value
        }
      }
    })

    axios.post('/api/usernames', { username: e.target.value })
    .catch((err) => {
      let errors = {}
      errors.username = 'Username already taken'
      this.setState({ errors })
    })
  }

  getImageUrl(url) {
    this.setState({ profileImageUrl: url})
  }

  handleInputBlur(e) {
    this.setState({
      [e.target.name]: `${e.target.value}`
    })
  }

  updateSkill(e, category) {
    e.persist()

    this.setState((prevState) => {

      let skill = e.target.id
      let idx = prevState.selectedExpertise[category].indexOf(skill)

      if(idx != -1) {
         prevState.selectedExpertise[category].splice(idx, 1)
         return prevState
      } else {
         prevState.selectedExpertise[category].push(skill)

         return prevState
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const accountType = this.state.accountType
    const profile = {
      artist: {
        id: this.props.id,
        username: this.state.username,
        profileImageUrl: this.state.profileImageUrl,
        youtube: this.state.YouTubeHandle,
        instagram: this.state.InstagramHandle,
        twitter: this.state.TwitterHandle,
        facebook: this.state.FacebookHandle,
        hourlyRate: this.state.hourlyRate,
        expertise: this.state.selectedExpertise
      },

      pupil: {
        id: this.props.id,
        username: this.state.username,
        profileImageUrl: this.state.profileImageUrl,
        youtube: this.state.YouTubeHandle,
        instagram: this.state.InstagramHandle,
        twitter: this.state.TwitterHandle,
        facebook: this.state.FacebookHandle,
      }
    }

    const validation = validateProfileSubmit(profile[accountType])

    if(this.state.errors.username) {
      this.setState({
        flagErrors: true
      })
    } else if(!validation.isValid) {
      this.setState({
        errors: validation.errors,
        flagErrors: true
      })
    } else {
      updateProfile(accountType, profile[accountType])
    }
  }

  render() {
    const { errors, accountType, expertise } = this.state

    return (
      <MyLayout alignment='center'>
        <Heading style={{ marginTop: '80px' }}>Create Profile</Heading>
        <ImageUploader onUpload={(url) => { this.getImageUrl(url) }} />
        <form onSubmit={ this.handleSubmit }>
          <input
            type='text'
            name='username'
            id='username'
            placeholder='CHOOSE A USERNAME'
            onBlur={ this.handleUsernameBlur }
          />
          {errors.username && (<div className="invalid-feedback">{errors.username}</div>)}
          <h2>Connect Social Media</h2>
          <label>YouTube</label>
          <input
            type='text'
            name='YouTubeHandle'
            id='youtube-handle'
            placeholder='ENTER HANDLE'
            onBlur={ this.handleInputBlur }
            defaultValue={ this.state.YouTubeHandle }
          />
          <label>Instagram</label>
          <input
            type='text'
            name='InstagramHandle'
            id='youtube-handle'
            placeholder='ENTER HANDLE'
            onBlur={ this.handleInputBlur }
            defaultValue={ this.state.InstagramHandle }
          />
          <label>Twitter</label>
          <input
            type='text'
            name='TwitterHandle'
            id='twitter-handle'
            placeholder='ENTER HANDLE'
            onBlur={ this.handleInputBlur }
            defaultValue={ this.state.TwitterHandle }
          />
          <label>Facebook</label>
          <input
            type='text'
            name='FacebookHandle'
            id='facebook-handle'
            placeholder='ENTER HANDLE'
            onBlur={ this.handleInputBlur }
            defaultValue={ this.state.FacebookHandle }
          />
          {accountType === 'artist' && (
            <React.Fragment>
            <h2>Set Hourly Rate</h2>
            <p className='dollar-prefix'>$</p>
            <input
              type='number'
              name='hourlyRate'
              className='digit'
              onChange={ this.handleInputBlur }
            />
            <p className='dollar-prefix'>/hr</p>
            <h2>Add Expertise</h2>
            <p>Add tags to show the things you slay at. Clients will be able to search based on these things</p>
            <h3>Makeup</h3>
            <ul className="expertise-tags">
              {expertise.makeup.map((exp) => {
                let selected = this.state.selectedExpertise.makeup.includes(exp)

                return <li id={exp} onClick={ (e) => { this.updateSkill(e, 'makeup')} } key={exp} className={classnames({ selected })}>{exp}</li>
              })}
            </ul>
            <h3>Hair</h3>
            <ul className="expertise-tags">
              {expertise.hair.map((exp) => {
                let selected = this.state.selectedExpertise.hair.includes(exp)

                return <li category="hair" id={exp} onClick={ (e) => { this.updateSkill(e, 'hair')} } key={exp} className={classnames({ selected })}>{exp}</li>
              })}
            </ul>
            </React.Fragment>
          )}
          <div className="button-container">
            {this.state.flagErrors && (<div className="invalid-feedback">See errors above</div>)}
            <Button type="submit">Save Profile</Button>
          </div>
        </form>
      </MyLayout>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  id: state.auth.user.id,
  username: state.username
})

export default connect(mapStateToProps)(CreateProfile)
// export default CreateProfile
