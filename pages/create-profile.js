import Head from 'next/head'
import React, { Component } from 'react'
import MyLayout from '../components/MyLayout'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Heading from '../components/Heading'
import ImageUploader from '../components/ImageUploader'
import Footer from '../components/Footer'
import validateUsernameInput from '../validation/username'
import { connect } from 'react-redux'
const classnames = require('classnames')

class CreateProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      accountType: this.props.query.accountType,
      errors: {},
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
  }

  static async getInitialProps({ query }) {
    return { query }
  }

  handleUsernameBlur(e) {
    //instead, i need to make the post to '/username' here
    // so import axios
    // handle the database query in the route
    this.setState({
      errors: validateUsernameInput(e.target.value).errors
    })

    // validate it
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
         prevState.selectedExpertise[category].splice(idx)
         return prevState
      } else {
         prevState.selectedExpertise[category].push(skill)
         return prevState
      }
    })
  }

  handleSubmit(e) {
    // e.preventDefault()
    // this.setState({ submitted: true })
    // if(!this.state.isConfirmed) return
    //
    // const user = {
    //   firstName: this.state.firstName,
    //   lastName: this.state.lastName,
    //   email: this.state.email,
    //   password: this.state.password,
    //   password_confirm: this.state.password_confirm,
    //   accountType: this.state.accountType
    // }
    //
    // this.props.registerUser(user)
  }

  render() {
    const { errors, accountType, expertise } = this.state

    return (
      <MyLayout alignment='center'>
        <Heading style={{ marginTop: '80px' }}>Create Profile</Heading>
        <ImageUploader />
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
            defaultValue={ `@${this.state.YouTubeHandle}` }
          />
          <label>Instagram</label>
          <input
            type='text'
            name='InstagramHandle'
            id='youtube-handle'
            placeholder='ENTER HANDLE'
            onBlur={ this.handleInputBlur }
            defaultValue={ `@${this.state.InstagramHandle}` }
          />
          <label>Twitter</label>
          <input
            type='text'
            name='TwitterHandle'
            id='twitter-handle'
            placeholder='ENTER HANDLE'
            onBlur={ this.handleInputBlur }
            defaultValue={ `@${this.state.TwitterHandle}` }
          />
          <label>Twitter</label>
          <input
            type='text'
            name='FacebookHandle'
            id='facebook-handle'
            placeholder='ENTER HANDLE'
            onBlur={ this.handleInputBlur }
            defaultValue={ `@${this.state.FacebookHandle}` }
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
        </form>
      </MyLayout>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  expertises: state.expertises
})

export default connect(mapStateToProps)(CreateProfile)
// export default CreateProfile
