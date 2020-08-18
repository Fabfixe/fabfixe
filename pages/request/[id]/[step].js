import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { FixedBottom } from 'react-fixed-bottom'
import DatePicker from "react-datepicker"
import Dropdown from 'react-dropdown'
import MyLayout from '../../../components/MyLayout'
import moment from 'moment-timezone'
import axios from 'axios'
import Button from '../../../components/Button'
import AttachmentImageUploader from '../../../components/AttachmentImageUploader'
import { getAvailability, currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../../../helpers'
import Link from 'next/link'
require('dotenv').config()
const cn = require('classnames')

const RequestModule = ({ navText, headline, subhead, step, children, forward, back, buttonText, submit, total }) => {
  return (
    <div className='request'>
      <div className="request-top">
        <div className='request-nav'>
          <div className='request-arrow back' onClick={back} />
          <p>{navText}</p>
          {step !== 'four' && <div className='request-arrow forward' onClick={forward}/>}
        </div>
        <div className='request-top__headers'>
          <p className='request-top__headline'>{headline}</p>
          <p className='request-top__subhead'>{subhead || 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.'}</p>
        </div>
      </div>
      <div className="request-main">
        <div className="request-main__wrapper">
          {children}
        </div>
      </div>
      <FixedBottom>
        <div className='request-bottom'>
          <div className='request-bottom__wrapper'>
            <div className='request-bottom__total'>
              <p>Total </p>
              <p>{`$${total}`}</p>
            </div>
            {!submit ? <Button onClick={forward}><span>{buttonText}</span><div/></Button> : <Button onClick={submit} class="submit">{buttonText}</Button>}
          </div>
        </div>
      </FixedBottom>
    </div>
  )
}

const RequestSession = ({ calendar, profile }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const userProfile = useSelector(state => state.profile)
  const router = useRouter()
  const id = router.query.id
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(router.query.step)
  const [startDate, setStartDate] = useState(null)
  const [monthSchedule, setMonthSchedule] = useState(null)
  const [firstAvailableDate, setFirstAvailableDate] = useState(null)
  const [duration, setDuration] = useState({value: 30, label: '30 min'})
  const [category, setCategory] = useState({ value: "Eyes", label: 'Eyes' })
  const [description, setDescription] = useState('')
  const [finalDate, setFinalDate] = useState(null)
  const [showBooked, setShowBooked] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const textRef = useRef()

  const proceed = (step) => {
    if(step === 'home') {
      router.push(`/${profile.username}`)
    }

    router.push(`/request/[id]/[step]`, `/request/${id}/${step}`, { shallow: true })
  }

  let monthIncrement = 0
  let fd = null

  const initSchedule = (date, keepStart = false) => {
    const endOfMonth = moment(date).endOf('month')

    const monthSchedule = []

    while(moment(date).isSameOrBefore(endOfMonth)) {
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

    fd = monthSchedule.find((d) => {
      return d.noAvailability === false
    })

// deal with keepStart
  // if keepStart and the current start has availability, dont change start date, include firstAvailable date in analysis
    if(fd) {
      setMonthSchedule(monthSchedule)
      setStartDate(fd)
      setFirstAvailableDate(fd)
      setFinalDate(Date.parse(fd.firstSlot.format()))
      setLoading(false)
      return
    } else {
      // Check the next twelve months
      while(monthIncrement <= 11 && !fd) {
        date = moment(date).add(monthIncrement, 'month').startOf('month')
        monthIncrement++
        initSchedule(date)
      }

      if(!fd) {
        setLoading(false)
        setShowBooked(true)
      }
    }
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

  const onSubmit = () => {
    if(!isAuthenticated) router.push('/account/login')
    if(!userProfile.username && isAuthenticated) proceed('complete-profile')

    const session = {
      date: finalDate,
      category: category.value,
      attachment: imageUrl.url,
      description,
      duration: duration.value,
      artist: profile._id,
      artistDisplayName: profile.displayName,
      artistUsername: profile.username,
      pupilUsername: userProfile.username,
      pupil: user._id,
      status: 'pending',
      artistApproved: false,
      messages: [],
    }

    axios.post('/api/sessions', session)
      .then((res) => {
        // Email both parties to notify session requested
        axios.post('/api/emails/sessionRequested', session)
        proceed('confirmation')
      })
      .catch((e) => {
        console.log('error with session submission:', e)
        proceed('request-error')
      })
  }

  const onMonthChange = (date) => {
    initSchedule(moment(date).startOf('month'))
  }

  useEffect(() => {
    if(!userProfile.username && isAuthenticated) proceed('complete-profile')
    initSchedule(moment())
  }, [])

  useEffect(() => {
    setStep(router.query.step)
  }, [router.query.step])

  useEffect(() => {
    if(startDate) {
      // setStartDate(null)
      initSchedule(moment(startDate.date).startOf('month'))
      // initSchedule(sd.date, true)
    }
  }, [duration])

  if(loading) {
    return <div className="loading">Loading</div>
  }

  if(showBooked) {
    return <div className="unavailable">This artist currently has no availability</div>
  }

  if(step === 'complete-profile') {
    return <MyLayout><div className="loading">
      <p>To request a session, you need to create a username first. Click <Link href="/account/edit-profile/pupil"><a>here</a></Link> to complete your profile</p>
    </div></MyLayout>
  }

  if(step === 'request-error') {
    return <MyLayout>
    <div className="loading">
      <p>Sorry, something went wrong. Please try again later.</p>
    </div></MyLayout>
  }

  if(!step || step === 'one') {
    const options = [
      { value: 30, label: '30 min' },
      { value: 60, label: '1 hour' },
      // { value: 120, label: '1 hour 30 min' }, // TODO: Add when react-datpicker bug is addressed
      { value: 120, label: '2 hours' }
    ]

    return <RequestModule
      navText='Step 1 of 4: Schedule A Time'
      headline='Choose a time for your session'
      subhead='At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.'
      step={step}
      buttonText="Add Details"
      total={digitCalcTotal(profile.hourlyRate, duration.value)}
      back={() => proceed('home')}
      forward={() => proceed('two')}>
      <>
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
      </>
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
    navText="Step 2 of 4: Session Details"
    headline="Tell us about your session"
    buttonText="Add Photo"
    back={() => proceed('one')}
    step={step}
    total={digitCalcTotal(profile.hourlyRate, duration.value)}
    forward={() => {
      if(description !== '') {
        proceed('three')
      } else {
        textRef.current.focus()
      }
    }}>
    <>
      <label>Category</label>
      <Dropdown
        value={category}
        options={options}
        onChange={(option) => setCategory(option)}
      />
      <label>Description*</label>
      <textarea
        ref={textRef}
        value={description}
        maxLength="250"
        onChange={(e) => setDescription(e.target.value)}
        name="description"
      ></textarea>
      <p>Limit 250 characters</p>
    </>
    </RequestModule>)
  }

  if(step === 'three') {
    return (<RequestModule
    navText="Step 3 of 4: Look Photo"
    headline="Show us a photo of your look"
    total={digitCalcTotal(profile.hourlyRate, duration.value)}
    back={() => proceed('two')}
    buttonText="Confirm Session"
    forward={() => proceed('four')}
    step={step}
    forward={() => proceed('four')}>
    <div className="request-main">
      <label>Upload Photo (Recommended)</label>
      <AttachmentImageUploader onUpload={(url) => setImageUrl(url)}/>
    </div>
    </RequestModule>)
  }

  if(step === 'four') {
    if(description === '') proceed('two')

    return (<RequestModule
      navText="Step 4 of 4: Confirm and Submit"
      headline="Confirmation"
      total={digitCalcTotal(profile.hourlyRate, duration.value)}
      submit={onSubmit}
      buttonText="Submit"
      back={() => proceed('three')}
      step={step}>
      <>
        <label>Time</label>
        <p>{formatTime(finalDate, duration.value)}</p>
        <label>Artist</label>
        <p>{profile.displayName}</p>
        <label>Description</label>
        <p>{description}</p>
      </>
      </RequestModule>)
    }

  if(step === 'confirmation') {
    if(description === '') proceed('two')
    return (<MyLayout><div className='request-confirmation'>
      <div>
        <h2>{`Congrats! You've just booked a session with ${profile.displayName}`}</h2>
        <p>{`You'll receive an email is ${profile.displayName} confirms your request`}</p>
      </div>
    </div></MyLayout>)
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

  if(!calRes.data) {
    initialProps.props['calendar'] = { sessions: sessionsRes.data }
  } else {
    initialProps.props['calendar'] = { sessions: sessionsRes.data, ...calRes.data }
  }

  return initialProps
}

export default RequestSession
