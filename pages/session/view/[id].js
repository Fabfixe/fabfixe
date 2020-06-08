import React, { useEffect, useState, useRef, Component } from 'react'
import { useSelector } from 'react-redux'
import Button from '../../../components/Button'
import Banner from '../../../components/Banner'
import CongratsModal from '../../../components/CongratsModal'
import MyLayout from '../../../components/MyLayout'
import Datetime from 'react-datetime'
import Modal from '../../../components/Modal'
import Router, { useRouter } from 'next/router'
import { currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../../../helpers'
import { PayPalButton } from "react-paypal-button-v2"
import validateSessionSubmit from '../../../validation/sessionSubmit'
import { deleteSession } from '../../../actions/session'
import moment from 'moment-timezone'
import axios from 'axios'
require('dotenv').config()

const ViewSession = ({ session }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const profile = useSelector(state => state.profile)
  const id = useRouter().query.id
  const [ isLoading, setLoading ] = useState(true)
  const [ showSubmitError, setShowSubmitError ] = useState(false)
  const [ errors, setErrors ] = useState({})
  const [ displayBanner, setDisplayBanner ] = useState(false)
  const [ bannerMessage, setBannerMessage] = useState("")
  const [ showCongrats, setShowCongrats ] = useState(false)
  const [ approvalLoading, setApprovalLoading ] = useState(false)
  const isArtist = user.accountType === 'artist'
  const showPaymentButton = !isArtist && session.artistApproved && session.status === 'pending'
  const router = useRouter()
  const confirmApproval = useRef(null)

  const deleteWithConfirm = () => {
    if(window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(session._id, isArtist)
      .then((res) => {
        if(res.status === 200) {
          Router.push('/account/my-sessions')
        }
      })
    }
  }

  const onApprove = () => {
    const newSession = {
      _id: session._id,
      artistApproved: true
    }


    if(confirmApproval.current.checked) {
      setApprovalLoading(true)
      axios.post('/api/sessions/artistApprove', newSession)
      .then((res) => {
        if(res.data.n === 1) {
          setErrors({})
          setTimeout(() =>  {
            setApprovalLoading(false)
            setDisplayBanner(true)
           }, 2000)

           const notify = session.pupil._id
           axios.post('/api/emails/sessionUpdated', { notify })
        } else {
          setTimeout(() =>  {
            setApprovalLoading(false)
            this.setState({ loading: false })
          }, 2000)
          setShowSubmitError(true)
        }})
    } else {
      setErrors({ confirm: true })
    }
  }

  useEffect(() => {
    if(session.status !== 'pending') setLoading(false)

    const timer = setTimeout(() => {
        setLoading(false)
      }, 4500)
      return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // come back to this later
    // if(!auth.isAuthenticated) Router.push('/account/login')
  }, [isAuthenticated])

  return (
    <Modal layout="default" closeModal={() => Router.push('/account/my-sessions')}>
      {isLoading && <div className="loading">Loading</div>}
      {!isLoading && !showCongrats && <>
        <h1>View Session</h1>
        <div className="view-session">
          <h4>{!isArtist ? 'Artist' : 'Pupil'}</h4>
          <p>{ !isArtist ? session.artist.displayName : session.pupil.username }</p>
          <h4>Time</h4>
          <p id="time-display">{formatTime(session.date, session.duration)}</p>
          <h4>Description</h4>
          <p>{session.description}</p>
          {session.attachment && <div style={{
            backgroundImage: `url(${session.attachment})`,
            width: '100px',
            height: '100px',
            backgroundSize: 'cover',
            marginBottom: '20px'
          }} />}
          <h4>Status</h4>
          <p style={{ textTransform: 'capitalize' }}>{session.status}</p>
          {showPaymentButton && <div className="paypal-container">
            <p style={{ marginBottom: '0' }}>{`Total: $${digitCalcTotal(session.duration, session.artist.hourlyRate)}`}</p>
            <PayPalButton
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      currency_code: "USD",
                      value: digitCalcTotal(session.duration, session.artist.hourlyRate)
                     }
                   }]
                })
              }}
              onApprove={(data, actions) => {
                // Capture the funds from the transaction
                 actions.order.capture().then((details) => {
                  // Show a success message to your buyer
                   axios.post('/api/emails/paymentComplete', {
                     artistId: session.artist._id,
                     pupilId: session.pupil._id,
                     total: details.purchase_units[0].amount.value,
                     artistUsername: session.artist.username,
                     pupilUsername: session.pupil.username,
                     date: formatTime(session.date, session.duration),
                     momentDate: session.date,
                  })
                  axios.post('/api/sessions/paymentComplete', { orderID: details.id, sessionID: session._id })
                  .then((result) => {
                    if(result) setShowCongrats(true)
                  })
                  .catch((err) => {
                    console.log(err)
                    // Add an error message
                  })
                })
              }}
              options={{ clientId: 'AVm5X6oZjRSvQwccLrBlE6hnioKJJc0DE93SoUIwU2UahsHgtpr9po5O0kDOw8RnXIYLJGuU2H3GHWWt' }}
              style={{size: 'responsive', layout: 'horizontal', color: 'black', tagline: false }}
            />
      </div>}
      {session.status !== 'cancelled' && session.status !== 'expired' && isArtist && !session.artistApproved && <div className="confirm-approval">
        <input ref={confirmApproval} id="confirmApproval" type="checkbox" /><label htmlFor="confirmApproval">By agreeing to this session, you have to do it</label>
      </div>}
      {errors.confirm && (<div className="invalid-feedback">You must confirm first</div>)}
      <div className="button-row">
        {session.status === 'pending' && isArtist && !session.artistApproved && <Button
          disabled={approvalLoading}
          class="small-button"
          onClick={onApprove}>{
          approvalLoading ? 'Sending...' : 'Approve Session'}</Button>}
        {(session.status === 'pending' || session.status === 'upcoming') && <Button class="small-button">Edit Session</Button>}
        {(session.status === 'pending' || session.status === 'upcoming') && <Button class="small-button">View Messages</Button>}
        {(session.status === 'expired' || session.status === 'cancelled') && <Button onClick={deleteWithConfirm} class="small-button">Delete Session</Button>}
      </div>
    </div>
    {displayBanner && <Banner
      style={{ zIndex: 5, minHeight: '100px' }}
      handleBanner={() => (Router.push('/account/my-sessions'))}>Your update has been sent</Banner>}
      </>}
      {showCongrats && <CongratsModal {...session} />}
      {showSubmitError && <p>Something went wrong, please try again later</p>}
    </Modal>
  )
}

export const getServerSideProps = async ({ params: {id} }) => {
  const res = await axios.post('/api/sessions/bySessionId', { id }, { baseURL: process.env.API_URL })
  const session = res.data[0]
  return {props: { session }}
}

export default ViewSession
