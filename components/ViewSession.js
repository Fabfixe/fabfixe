import React, { Component } from 'react'
import Button from '../components/Button'
import Banner from '../components/Banner'
import Datetime from 'react-datetime'
import Router from 'next/router'
import { currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../helpers'
import { PayPalButton } from "react-paypal-button-v2"
import validateSessionSubmit from '../validation/sessionSubmit'
import { deleteSession } from '../actions/session'
import moment from 'moment'
import axios from 'axios'

class ViewSession extends Component {
  constructor(props) {
    super(props)
    this.textArea = React.createRef()
    this.confirmApproval = React.createRef()

    this.state = {
      date: this.props.date,
      duration: this.props.duration,
      message: '',
      showSubmitError: false,
      errors: {},
      submitReady: false,
      displayBanner: false,
      bannerMessage: 'Your update has been sent',
      showSummary: true,
    }

    this.handleScheduler = this.handleScheduler.bind(this)
    this.handleBanner = this.handleBanner.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onChange = this.onChange.bind(this)
    this.cancelSession = this.cancelSession.bind(this)
    this.deleteSession = this.deleteSession.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.onApprove = this.onApprove.bind(this)
  }

  handleScheduler() {
    this.setState({
      schedulerOpen: !this.state.schedulerOpen,
    })
  }

  onChange(date) {
    if(!moment(date).isSame(this.props.date)) {
      this.setState({ date, submitReady: true })
    } else {
      if(this.state.duration === this.props.duration && this.state.message === null) this.setState({ submitReady: false })
    }
  }

  onApprove() {
    const newSession = {
      _id: this.props._id,
      artistApproved: true
    }
    this.setState({ loading: true })

    if(this.confirmApproval.current.checked) {
      axios.post('/api/sessions/artistApprove/', newSession)
      .then((res) => {
        if(res.data.n === 1) {
          this.props.showSubmit(newSession)
          this.setState({ errors: {}})
          setTimeout(() =>  { this.setState({ loading: false, displayBanner: true })}, 2000)
          // send an email update axios.post('/api/emails/sessionUpdated')
        } else {
          setTimeout(() =>  { this.setState({ loading: false })}, 2000)
          this.setState({ showSubmitError: true })
        }})
    } else {
      this.setState({
        errors: { confirm: true }
      })
    }
  }

  handleBanner() {
    this.setState({ displayBanner: !this.state.displayBanner })
    Router.push('/account/my-sessions')
  }

  cancelSession() {
    if(window.confirm('Are you sure you want to cancel?')) {
      cancelSession(this.props._id)
      .then((res) => {
        if(res.status === 200) {
          Router.push('/account/my-sessions')
        }
      })
    }
  }

  deleteSession() {
    if(window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(this.props._id, this.props.isPupil)
      .then((res) => {
        if(res.status === 200) {
          Router.push('/account/my-sessions')
        }
      })
    }
  }

  onTextChange(e) {
    const newMessage = e.target.value

    this.setState({
      message: e.target.value
    })

    if(moment(this.state.date).isSame(this.props.date) && this.props.duration === this.state.duration)this.setState({ submitReady: false })
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
      _id,
      artistId,
      pupilId,
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
    const showPaymentButton = isPupil && artistApproved && status === 'pending'
    return (
      <React.Fragment>
        {this.state.showSubmitError && <div>Something went wrong, try again later</div>}
        <h1>View Session</h1>
        <p>{isPupil ? `Artist: ${artist}` : `Pupil: ${pupil}`}</p>
        <p id="time-display">Time: {formatTime(date, duration)}</p>
        <p>Category: {category}</p>
        <p>Description: {description}</p>
        {attachment && <div style={{backgroundImage: `url(${attachment})`,
          width: '100px',
          height: '100px',
          backgroundSize: 'cover',
          marginBottom: '20px'
        }} />}
        <p>Status: {status}</p>
        {showPaymentButton && <div className="paypal-container">
          <p>{`Total: $${digitCalcTotal(duration, hourlyRate)}`}</p>
          <PayPalButton
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                  currency_code: "USD",
                  value: digitCalcTotal(duration, hourlyRate)
                   }
                 }]
              })
            }}
            onApprove={(data, actions) => {
              // Capture the funds from the transaction
               actions.order.capture().then((details) => {
                // Show a success message to your buyer
                 axios.post('/api/emails/paymentComplete', {
                   artistId,
                   pupilId,
                   total: details.purchase_units[0].amount.value,
                   artistUsername: artist,
                   pupilUsername: pupil,
                   date: formatTime(date, duration),
                   momentDate: date,
                })
                axios.post('/api/sessions/paymentComplete', { orderID: details.id, sessionID: _id })
                .then((result) => {
                  if(result) console.log(result)
                  this.props.changeModal('congrats')
                })
                .catch((err) => {
                  console.log(err)
                  // Add an error message
                })
              })
            }}
            options={{ clientId: 'AVm5X6oZjRSvQwccLrBlE6hnioKJJc0DE93SoUIwU2UahsHgtpr9po5O0kDOw8RnXIYLJGuU2H3GHWWt' }}
            style={{size: 'responsive', layout: 'horizontal', color: 'black', tagline: false }}/>
        </div>}
        {status !== 'cancelled' && status !== 'expired' && !isPupil && !artistApproved && <div className="confirm-approval">
          <input ref={this.confirmApproval} id="confirmApproval" type="checkbox" /><label htmlFor="confirmApproval">By agreeing to this session, you have to do it</label>
        </div>}
        {this.state.errors.confirm && (<div className="invalid-feedback">You must confirm first</div>)}
        {status === 'pending' && !isPupil && !artistApproved && <Button onClick={this.onApprove} containerStyle={{ display: 'inline-block', marginRight: '10px', float: 'left'}}>Approve Session</Button>}
        {status === 'pending' && <Button  onClick= {() => { this.props.changeModal('edit')}} containerStyle={{ display: 'inline-block', marginRight: '10px', float: 'left'}}>Edit Session</Button>}
        {(status === 'pending' || status === 'upcoming') && <Button onClick={() => { this.props.changeModal('messages')}} containerStyle={{ display: 'inline-block', marginRight: '10px', float: 'left'}}>Messages</Button>}
        {(status === 'expired' || status === 'cancelled') && <Button onClick={this.deleteSession}>Delete Session</Button>}
        {this.state.displayBanner && <Banner handleBanner={this.handleBanner}>{this.state.bannerMessage}</Banner>}
      </React.Fragment>
    )
  }
}

export default ViewSession
