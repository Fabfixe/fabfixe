import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { FixedBottom } from 'react-fixed-bottom'
import DatePicker from "react-datepicker"
import Dropdown from 'react-dropdown'
import moment from 'moment-timezone'
import axios from 'axios'
import Button from '../../../components/Button'
import AttachmentImageUploader from '../../../components/AttachmentImageUploader'

const cn = require('classnames')

import { getAvailability, currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../../../helpers'
require('dotenv').config()

const RequestModule = ({ navText, headline, step, children, forward, back }) => {

  return (
    <div className='request'>
      <div className='request-nav'>
        <div className='request-arrow back' onClick={back} />
        <p>{navText}</p>
        {step !== 'four' && <div className='request-arrow forward' onClick={forward}/>}
      </div>
      <div className='request-headline'>
        <p>{headline}</p>
      </div>
      {children}
    </div>
  )
}

const RequestSession = ({ calendar, profile }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const router = useRouter()
  const id = router.query.id
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(router.query.step)
  const [startDate, setStartDate] = useState(null)
  const [monthSchedule, setMonthSchedule] = useState(null)
  const [firstAvailableDate, setFirstAvailableDate] = useState(null)
  const [duration, setDuration] = useState({value: 30, label: '30 min'})
  const [category, setCategory] = useState({ value: "Eyes", label: 'Eyes' })
  const [description, setDescription] = useState(null)
  const [finalDate, setFinalDate] = useState(null)
  const [showBooked, setShowBooked] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const proceed = (step) => {
    if(step === 'home') {
      router.push(`/${profile.username}`)
    }

    router.push(`/request/[id]/[step]`, `/request/${id}/${step}`, { shallow: true })
  }

  let monthIncrement = 1

  const initSchedule = (date, keepStart = false) => {
    const endOfMonth = moment(date).endOf('month').subtract(1, 'day')
    const monthSchedule = []

    while(moment(date).isBefore(endOfMonth)) {
      const { excludeTimes, noAvailability, firstSlot, lastSlot } = getAvailability(calendar, duration.value, date)

      monthSchedule.push(
        {
          date: Date.parse(date),
          excludeTimes: excludeTimes.map(m => Date.parse(m)),
          noAvailability,
          firstSlot: firstSlot,
          lastSlot: lastSlot
        }
      )

      date = moment(date).add(1, 'day')
    }

    const firstAvailableDate = monthSchedule.find((d) => {
      return d.noAvailability === false
    })

// deal with keepStart
  // if keepStart and the current start has availability, dont change start date, include firstAvailable date in analysis
    if(firstAvailableDate) {
      setMonthSchedule(monthSchedule)
      setStartDate(firstAvailableDate)
      setFirstAvailableDate(firstAvailableDate)
      setFinalDate(Date.parse(firstAvailableDate.firstSlot.format()))
      setLoading(false)
      return
    } else {
      // Check the next twelve months

      while(monthIncrement <= 12) {
        date = moment(date).add(1, 'month').startOf('month')
        monthIncrement++
        initSchedule(date)
      }

      setLoading(false)
      setShowBooked(true)
    }


    // Get the object for every remaining day in month
    // if all days have no noAvailability, check for a whole year
    // if there still isn't availability, show a message
    // console.log(excludeTimes[0].format('h'))
    // console.log(noAvailability)
  }

  const filterDate = (date) => {
    const isWithinMonth = (date) => {
      return moment(startDate.date).month() === moment(date).month()
    }

    // Later you might want to change to isAfter
    const isAfterStart = (date) => {
      return moment(date).isSameOrAfter(moment(firstAvailableDate.date), 'day')
    }

    return isWithinMonth(date) && isAfterStart(date)
  }

  const formatMinTime = (time) => {
    if(!startDate) return

    // take the startdate and set it to open and close
    const { hours } = calendar
    const { timezone } = hours

    const h = moment(startDate.date).get('hours')
    const m = moment(startDate.date).get('minutes')
    const y = moment(startDate.date).get('years')

    const formattedOpen = moment(hours[time], 'h:mm A').tz(timezone).set('hour', h).set('minute', m).set('year', y).format()

    return Date.parse(formattedOpen)
  }

  const onMonthChange = (date) => {
    initSchedule(moment(date).startOf('month'))
  }

  useEffect(() => {
    initSchedule(moment())
  }, [])

  useEffect(() => {
    setStep(router.query.step)
  }, [router.query.step])

  useEffect(() => {
    if(startDate) {
      const sd = { ...startDate }
      // setStartDate(null)
      initSchedule(moment(sd.date).startOf('month'))
      // initSchedule(sd.date, true)
    }
  }, [duration])

  if(loading) {
    return <div className="loading">Loading</div>
  }

  if(showBooked) {
    return <div className="unavailable">This artist currently has no availability</div> // TODO: Add email me when available option
  }

  if(!step || step === 'one') {
    const options = [
      { value: 30, label: '30 min' },
      { value: 60, label: '1 hour' },
      { value: 90, label: '1 hour 30 min' },
      { value: 120, label: '2 hours' }
    ]

    return <RequestModule
      navText='Step 1: Schedule A Time'
      headline='Choose a time for your session'
      step={step}
      back={() => proceed('home')}
      forward={() => proceed('two')}>
      <div className={cn('request-time', 'request-main')}>
        <label>Duration</label>
        <Dropdown
          value={duration}
          options={options}
          onChange={(option) => setDuration(option)}
        />
        <label>Date</label>
        <DatePicker
          dateFormat="iiii, LLLL d"
          selected={startDate.date}
          onSelect={date => {
            const nextStartDate = monthSchedule.find(m => moment(m.date).isSame(moment(date)))
            setStartDate(nextStartDate)
            setFinalDate(Date.parse(nextStartDate.firstSlot))
          }}
          filterDate={(date) => filterDate(date)}
          disabledKeyboardNavigation={true}
          onMonthChange={(date) => {
            onMonthChange(date)}}
          withPortal
          formatWeekDay={day => day.substring(0, 3).toUpperCase()}
        />
        <label>Time</label>
        <DatePicker
         showTimeSelect
         excludeTimes={startDate.excludeTimes}
         selected={finalDate}
         minTime={Date.parse(startDate.firstSlot)}
         maxTime={Date.parse(startDate.lastSlot)}
         showTimeSelectOnly
         timeIntervals={duration.value}
         timeCaption="Time"
         dateFormat="h:mm aa"
         onChange={date => setFinalDate(date)}
         withPortal
       />
      </div>
      <FixedBottom>
        <div className='request-bottom'>
          <div className='request-bottom__total'>
          <p>Total</p>
          <p>{`$${digitCalcTotal(profile.hourlyRate, duration.value)}`}</p>
          </div>
          <Button onClick={() => proceed('two')} class="request">Session Details ></Button>
        </div>
      </FixedBottom>
      </RequestModule>
  }

  if(step === 'two') {
    const options = [
      { value: "Eyes", label: 'Eyes' },
      { value: "Lips", label: "Lips" },
      { value: "Foundation/Face", label: "Foundation/Face" },
      { value: "Nails", label: "Nails" },
      { value: "Styling", label: "Styling" },
      { value: "Braiding", label: "Braiding" },
      { value: "Natural Hair", label: "Natural Hair" },
      { value: "Wigs/Extensions", label: "Wigs/Extensions" }
    ]

    return (<RequestModule
    navText="Step 2: Session Details"
    headline="Tell us about your session"
    back={() => proceed('one')}
    step={step}
    forward={() => proceed('three')}>
    <div className="request-main">
      <label>Category</label>
      <Dropdown
        value={category}
        options={options}
        onChange={(option) => setCategory(option)}
      />
      <label>Description*</label>
      <textarea
        maxLength="250"
        onChange={(e) => setDescription(e.target.value)}
        name="description"
      ></textarea>
      <p>Limit 250 characters</p>
    </div>
    <FixedBottom>
      <div className='request-bottom'>
        <div className='request-bottom__total'>
        <p>Total</p>
        <p>{`$${digitCalcTotal(profile.hourlyRate, duration.value)}`}</p>
        </div>
        <Button onClick={() => proceed('three')} class="request">Add Photo ></Button>
      </div>
    </FixedBottom>
    </RequestModule>)
  }

  if(step === 'three') {
    return (<RequestModule
    navText="Step 3: Look Photo"
    headline="Show us a photo of your look"
    back={() => proceed('two')}
    forward={() => proceed('four')}
    step={step}
    forward={() => proceed('four')}>
    <div className="request-main">
      <label>Upload Photo (Recommended)</label>
      <AttachmentImageUploader onUpload={(url) => setImageUrl(url)}/>
    </div>
    <FixedBottom>
      <div className='request-bottom'>
        <div className='request-bottom__total'>
          <p>Total</p>
          <p>{`$${digitCalcTotal(profile.hourlyRate, duration.value)}`}</p>
        </div>
        <Button onClick={() => proceed('four')} class="request">Confirm Session ></Button>
      </div>
    </FixedBottom>
    </RequestModule>)
  }

  if(step === 'four') {
    return (<RequestModule
    navText="Step 4: Confirm and Submit"
    headline="Confirmation"
    back={() => proceed('three')}
    step={step}
    forward={() => proceed('four')}>
    <div className="request-main">
      <label>Upload Photo (Recommended)</label>
      <AttachmentImageUploader onUpload={(url) => setImageUrl(url)}/>
    </div>
    <FixedBottom>
      <div className='request-bottom'>
        <div className='request-bottom__total'>
          <p>Total</p>
          <p>{`$${digitCalcTotal(profile.hourlyRate, duration.value)}`}</p>
        </div>
        <Button onClick={() => proceed('four')} class="request">Submit</Button>
      </div>
    </FixedBottom>
    </RequestModule>)
  }
}

export const getServerSideProps = async ({ params: {id, step} }) => {
  const calRes = await axios.get('/api/calendar', {
    params: { userId: id },
    baseURL: process.env.API_URL
  })

  const sessionsRes = await axios.post('/api/sessions/byId', { accountType: 'artist', _id: id }, { baseURL: process.env.API_URL })

  const profileRes = await axios.post('/api/profile', { _id: id }, { baseURL: process.env.API_URL })

  let initialProps = { props: { profile: profileRes.data, step }}

  if(calRes.data === '') {
    initialProps.props['calendar'] = sessionsRes.data
  } else {
    initialProps.props['calendar'] = { sessions: sessionsRes.data, ...calRes.data }
  }

  return initialProps
}

export default RequestSession
