import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import Button from '../../../components/Button'
import Banner from '../../../components/Banner'
import ConfirmModal from '../../../components/ConfirmModal'
import MyLayout from '../../../components/MyLayout'
import Datetime from 'react-datetime'
import Modal from '../../../components/Modal'
import Router, { useRouter } from 'next/router'
import { currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../../../helpers'
import { PayPalButton } from "react-paypal-button-v2"
import validateSessionSubmit from '../../../validation/sessionSubmit'
import { cancelSession, deleteSession } from '../../../actions/session'
import moment from 'moment-timezone'
import axios from 'axios'
require('dotenv').config()

const EditSession = ({ session }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const profile = useSelector(state => state.profile)
  const id = useRouter().query.id
  const [ isLoading, setLoading ] = useState(false)
  const [ showSubmitError, setShowSubmitError ] = useState(false)
  const [ schedulerOpen, setSchedulerOpen ] = useState(false)
  const [ sessionDate, setSessionDate ] = useState(session.date)
  const [ sessionDuration, setSessionDuration ] = useState(session.duration)
  const [ submitReady, setSubmitReady ] = useState(false)
  const [ errors, setErrors ] = useState({})
  const [ displayBanner, setDisplayBanner ] = useState(false)
  const [ bannerMessage, setBannerMessage] = useState('Your update has been sent')
  const [ approvalLoading, setApprovalLoading ] = useState(false)
  const [ showConfirm, setShowConfirm ] = useState(false)

  const isArtist = user.accountType === 'artist'
  const showPaymentButton = !isArtist && session.artistApproved && session.status === 'pending'
  const router = useRouter()
  const confirmApproval = useRef(null)
  const durationRef = useRef(null)

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

  const onSelect = () => {
    const duration = durationRef.current.value
    if(duration !== session.duration) {
      setSubmitReady(true)
      setSessionDuration(duration)
    } else if(moment(sessionDate).isSame(session.date)) {
      setSubmitReady(false)
    }
  }

  const onConfirm = () => {
    cancelSession({ _id: session._id})
    .then((res) => {
      if(res.status === 200) {
        Router.push('/account/my-sessions')
      }
    })
  }

  const onChange = (date) => {
    setSessionDate(date)

    if(!moment(date).isSame(session.date) || session.duration !== sessionDuration) {
      setSubmitReady(true)
    } else {
      setSubmitReady(false)
    }
  }

  const onSubmit = () => {
    if(!confirmApproval.current.checked) {
      setErrors({ confirm: true })
      return
    }

    setLoading(true)

    let newSession = {
      _id: session._id,
      isArtist,
      date: moment(sessionDate),
      duration: sessionDuration,
      description: session.description,
      contractChange: true
    }

    const validation = validateSessionSubmit(newSession)
      if(validation.isValid) {
        axios.post('/api/sessions/update', newSession)
        .then((res) => {
          // Add check for response code
          if(res.data.n === 1) {
            setErrors({ errors: {} })

            setTimeout(
              () => {
                setLoading(false)
                setDisplayBanner(true)
              }, 2000)

              const notify = isArtist ? session.artist._id : session.pupil._id
              const { _id } = session
              axios.post('/api/emails/sessionUpdated', { notify, _id })
          } else {
            setTimeout(() => { setLoading(false) }, 2000)
            setShowSubmitError(true)
          }
        })
        .catch((err) => {
          console.log('err from session update', err)
          setTimeout(() => { setLoading(false) }, 2000)
          setShowSubmitError(true)
        })
    } else {
      setErrors({ errors: { confirm: true }})
    }
  }

  useEffect(() => {
    // come back to this later
    // if(!auth.isAuthenticated) Router.push('/account/login')
  }, [isAuthenticated])

  return (
    <Modal layout="default" closeModal={() => Router.push('/account/my-sessions')}>
      <div className="edit-session-modal">
        {showSubmitError && <div>Something went wrong, try again later</div>}
        {showConfirm && ReactDOM.createPortal(<ConfirmModal
          copy={session.status === 'pending' ?
            "Are you sure you want to cancel this session?" :
            "Are you sure you want to cancel this session? You will lose coin if you cancel within eight hours of the session time"}
          onCancel={() => (setShowConfirm(false))}
          onConfirm={onConfirm}
          />, document.body)}
        {!showConfirm && !showSubmitError && <>
          <h1>Edit Session</h1>
          <p>{isArtist ? `Artist: ${session.artist.displayName}` : `Pupil: ${session.pupil.username}`}</p>
          <p id="time-display" style={{ marginRight: '10px' }}>Time: {formatTime(session.date, session.duration)}</p>
          {session.status === 'pending' &&
          <button
            className="small-button"
            onClick={() => (setSchedulerOpen(!schedulerOpen))}>{schedulerOpen ? 'Cancel' : 'Request a new time' }
          </button>}
          {schedulerOpen && <div className="session-scheduler">
          <h2>CHOOSE TIME</h2>
            <Datetime
              isValidDate={validDateSelection}
              inputProps={{ placeholder: 'CLICK TO CHOOSE A DATE AND A START TIME' }}
              onChange={onChange}
            />
            <h2>SESSION DURATION</h2>
            <select
              onChange={onSelect}
              name="duration"
              defaultValue={session.duration}
              ref={durationRef}>
              <option value="30">{`30 min: $${calcTotal("30 min", session.artist.hourlyRate)}`}</option>
              <option value="60">{`1 hour: $${calcTotal("1 hour", session.artist.hourlyRate)}`}</option>
              <option value="90">{`1 hour 30 min: $${calcTotal("1 hour 30 min", session.artist.hourlyRate)}`}</option>
              <option value="120">{`2 hours: $${calcTotal("2 hours", session.artist.hourlyRate)}`}</option>
            </select>
          </div>}
          <p style={{ marginTop: "10px" }}>Category: {session.category}</p>
          <p>Description: {session.description}</p>
          {session.attachment && <div style={{ backgroundImage: `url(${session.attachment})`,
            width: '100px',
            height: '100px',
            backgroundSize: 'cover',
            marginBottom: '20px'
          }} />}
          <p style={{ textTransform: 'capitalize', display: 'inline-block', marginRight: '10px'}}>Status: {session.status}</p>
          {(session.status === 'pending' || session.status === 'upcoming') && <button className="small-button"
            onClick={() => { setShowConfirm(true) }} style={{ marginBottom: '20px'}}>Cancel Session</button>}
          {session.status !== 'cancelled' && session.status !== 'expired' && isArtist && <div className="confirm-approval">
            <input ref={confirmApproval} id="confirmApproval" type="checkbox" /><label htmlFor="confirmApproval">If the pupil pays for this modified session you have to do it or else</label>
          </div>}
          {errors.confirm && (<div className="invalid-feedback">You must confirm first</div>)}
          <Button disabled={!submitReady} onClick={onSubmit}>{isLoading ? 'Submitting...' : 'Submit Change'}</Button>
          {(session.status === 'cancelled'|| session.status === 'expired') && <Button onClick={deleteSession}>Delete Session</Button>}
          {displayBanner && <Banner
            style={{ zIndex: 5, minHeight: '100px' }}
            handleBanner={() => Router.push('/account/my-sessions')}>
              {bannerMessage}
            </Banner>}
          </>}
      </div>
    </Modal>
  )
}

export const getServerSideProps = async ({ params: {id} }) => {
  const res = await axios.post('/api/sessions/bySessionId', { id }, { baseURL: process.env.API_URL })
  const session = res.data[0]
  return {props: { session }}
}

export default EditSession
