import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import DatePicker from "react-datepicker"
import moment from 'moment-timezone'
import axios from 'axios'
import { currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../../../helpers'
require('dotenv').config()

const RequestModule = ({ navText, headline, step, children, forward, back }) => {

  return (
    <div className='request'>
      <div className='request-nav'>
        <div className='request-arrow back' onClick={back} />
        <p>{navText}</p>
        {step !== 'three' && <div className='request-arrow forward' onClick={forward}/>}
      </div>
      <div className='request-headline'>
        <p>{headline}</p>
      </div>
      {children}
    </div>
  )
}

const RequestSession = ({ calendar, profile }) => {
  console.log(profile)
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const router = useRouter()
  const id = router.query.id
  const [step, setStep] = useState(router.query.step)
  const [ timeInput, setTimeInput ] = useState(null)
  const timeRef = useRef()
  const onTimeChange = () => {
    setTimeInput(timeRef.current.value)
  }

  const proceed = (step) => {
    if(step === 'home') {
      router.push(`/${profile.username}`)
    }

    router.push(`/request/[id]/[step]`, `/request/${id}/${step}`, { shallow: true })
  }

  useEffect(() => {
    setStep(router.query.step)
  }, [router.query.step])

  if(!step || step === 'one') {
    return <RequestModule
      navText='Step 1: Schedule A Time'
      headline='Choose a time for your session'
      step={step}
      back={() => proceed('home')}
      forward={() => proceed('two')}>
      <div className='request-time'>
        <label>Date</label>
        <DatePicker
         placeholderText={moment(Date.now()).format('dddd, D MMMM')}
         openToDate={Date.now()}
        />
        <label>Duration</label>
      </div>
      </RequestModule>
  }

  if(step === 'two') {
    return <div>two</div>
  }

}

export const getServerSideProps = async ({ params: {id, step} }) => {
  const calRes = await axios.get('/api/calendar', {
    params: { userId: id },
    baseURL: process.env.API_URL
  })

  const profileRes = await axios.post('/api/profile', { _id: id }, { baseURL: process.env.API_URL })
  console.log('calRes', calRes)
  let initialProps = { props: { profile: profileRes.data, step }}

  if(calRes.data === '') {
    initialProps.props['calendar'] = null
  } else {
    initialProps.props['calendar'] = calRes.data
  }

  return initialProps
}

export default RequestSession
