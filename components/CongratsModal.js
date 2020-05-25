import React, { Component } from 'react'
import Button from '../components/Button'
import Banner from '../components/Banner'
import Datetime from 'react-datetime'
import Router from 'next/router'
import { currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../helpers'
import moment from 'moment'
import axios from 'axios'

class CongratsModal extends Component {
  constructor(props) {
    super(props)
    this.textArea = React.createRef()

    this.state = {
      schedulerOpen: false,
      date: this.props.date,
      duration: this.props.duration,
      message: '',
      showSubmitError: false,
      errors: {},
      submitReady: false,
      displayBanner: false,
      bannerMessage: 'Your message has been sent',
      showSummary: true,
    }

    this.handleScheduler = this.handleScheduler.bind(this)
    this.handleBanner = this.handleBanner.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
  }

  handleScheduler() {
    this.setState({
      schedulerOpen: !this.state.schedulerOpen,
    })
  }

  onChange(date) {
    if(!date.isSame(this.props.date)) {
      this.setState({ date, submitReady: true })
    } else {
      if(this.state.duration === this.props.duration && this.state.message === null) this.setState({ submitReady: false })
    }
  }

  handleBanner() {
    this.setState({ displayBanner: !this.state.displayBanner })
  }

  onSubmit() {
    this.setState({ loading: true })
    const { isPupil } = this.props
    const recipient = isPupil ? this.props.pupilId : this.props.artistId
    const fromName = isPupil ? this.props.pupil : this.props.artist
    const toName = isPupil ? this.props.artist : this.props.pupil

    const newMessage = {
      from: this.props.userId,
      to: recipient,
      time: new Date(),
      body: this.state.message
    }

    let newSession = {
      _id: this.props._id,
      isPupil: this.props.isPupil,
      messages: this.props.messages.concat(newMessage)
    }

    // Dont send an empty message
    if(newMessage.body !== '') {
      axios.post('/api/sessions/newMessage', newSession)
      .then((res) => {
        // Add check for response code
        this.textArea.current.value = ''
        if(res.data.n === 1) {
          this.props.showSubmit(newSession)
          setTimeout(() =>  { this.setState({ loading: false, displayBanner: true })}, 2000)
          axios.post('/api/emails/newMessage', { fromId: this.props.userId, toId: recipient, fromName, toName })
        } else {
          setTimeout(() =>  { this.setState({ loading: false })}, 2000)
          this.setState({ showSubmitError: true })
        }
      })
      .catch((err) => {
        console.log('err from session update', err)
        setTimeout(() =>  { this.setState({ loading: false })}, 2000)
        this.setState({ showSubmitError: true })
      })
    }
  }

  onTextChange(e) {
    const newMessage = e.target.value

    this.setState({
      message: e.target.value
    })

    if(newMessage !== '') {
      this.setState({ submitReady: true })
    } else {
      if(moment(this.state.date).isSame(this.props.date) && this.props.duration === this.state.duration)this.setState({ submitReady: false })
    }
  }

  onSelect(e) {
    e.preventDefault()
    this.setState({ duration: e.target.value})

    if(e.target.value !== this.props.duration) {
      this.setState({ submitReady: true })
    } else {
      if(moment(this.state.date).isSame(this.props.date) && this.state.message === null) this.setState({ submitReady: false })
    }
  }

  render() {
    const {
      artist,
      pupil,
      isPupil,
      date,
      category,
      duration,
      description,
      messages,
      attachment,
      hourlyRate,
      schedulerOpen,
      onChange,
      status,
      artistApproved,
    } = this.props


    return (
      <React.Fragment>
        <p>Congrats! You have successfully scheduled a session with {artist}!</p>
        <p>Time: {formatTime(date, duration)}</p>
        <p>Total: ${digitCalcTotal(duration, hourlyRate)}</p>
      </React.Fragment>
    )
  }
}

export default CongratsModal
