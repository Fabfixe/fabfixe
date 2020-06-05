import React, { Component } from 'react'
import Button from '../components/Button'
import Banner from '../components/Banner'
import Datetime from 'react-datetime'
import Router from 'next/router'
import { currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../helpers'
import moment from 'moment'
import axios from 'axios'

class MessagesModal extends Component {
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
    const recipient = isPupil ? this.props.artistId : this.props.pupilId
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
        {this.state.showSubmitError && <div>Something went wrong, try again later</div>}
        <h1>Session Messages</h1>
        <div className="messages-container">
          <p>{isPupil ? `Artist: ${artist}` : `Pupil: ${pupil}`}</p>
          <p id="time-display">Time: {formatTime(date, duration)}</p>
          {this.state.schedulerOpen && <div className="session-scheduler">
          <h2>CHOOSE TIME</h2>
            <Datetime
              isValidDate={validDateSelection}
              inputProps={{ placeholder: 'CLICK TO CHOOSE A DATE AND A START TIME' }}
              onChange={this.onChange}
            />
            <h2>SESSION DURATION</h2>
            <select
              onChange={this.onSelect}
              name="duration"
              value={this.state.duration}>
              <option value="30">{`30 min: $${calcTotal("30 min", hourlyRate)}`}</option>
              <option value="60">{`1 hour: $${calcTotal("1 hour", hourlyRate)}`}</option>
              <option value="90">{`1 hour 30 min: $${calcTotal("1 hour 30 min", hourlyRate)}`}</option>
              <option value="120">{`2 hours: $${calcTotal("2 hours", hourlyRate)}`}</option>
            </select>
            </div>}
            <p>Category: {category}</p>
            <p>Description: {description}</p>
            {attachment && <div style={{backgroundImage: `url(${attachment})`,
              width: '100px',
              height: '100px',
              backgroundSize: 'cover',
              marginBottom: '20px'
            }} />}
            <p style={{ textTransform: 'capitalize', display: 'inline-block' }}>Status: {status}</p>
            {messages && messages.length > 0 &&
              <div>
                <h2>Messages</h2>
                <div className="modal-messages">
                  {messages.map((message, id) => {
                    return (
                      <div style={{
                        borderTop: 'dashed black 1px',
                        paddingTop: '10px' }} key={id}>
                        <p>Sent: {moment(message.time).format("MM/DD/YYYY h:mma")}</p>
                        <p>From: {message.from === this.props.userId ? 'You' : isPupil ? artist : pupil }</p>
                        <p>{message.body}</p>
                      </div>
                    )})}
                </div>
              </div>}
              {(status === 'pending' || status === 'upcoming') &&
                <React.Fragment>
                  <h2>Add a Message</h2>
                  <textarea ref={this.textArea} onChange={this.onTextChange} style={{ marginBottom: '30px' }} maxLength="250"/>
                </React.Fragment>}
                <Button disabled={!this.state.submitReady} onClick={this.onSubmit}>Submit Message</Button>
                {(status === 'cancelled'|| status === 'expired') && <Button onClick={this.deleteSession}>Delete Session</Button>}
                </div>
              {this.state.displayBanner && <Banner handleBanner={this.handleBanner}>{this.state.bannerMessage}</Banner>}
      </React.Fragment>
    )
  }
}

export default MessagesModal
