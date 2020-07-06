import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import loadable from '@loadable/component'
import Head from 'next/head'
import PropTypes from 'prop-types'
import MyLayout from '../../components/MyLayout'
import Hero from '../../components/Hero'
import { Dropdown, BusinessHours, BusinessHoursPanel } from '../../components/Dropdown'
import ConfirmModal from '../../components/ConfirmModal'
import Modal from '../../components/Modal'
import Footer from '../../components/Footer'
import Sessions from '../../components/Sessions'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import moment from 'moment'
import axios from 'axios'

const importedEvents = [
  {
    title: 'Session with Carron',
    start: Date.now() + (1*60*60*1000),
    end: Date.now()  + (2*60*60*1000),
    textColor: '#000',
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    url: '',
    extendedProps: {
      status: 'Pending'
    }
  },

  {
    title: 'Block',
    start: '2020-07-04T14:00:00Z',
    end: '2020-07-04T14:30:00Z',
    url: '',
    rendering: 'background',
    extendedProps: {
      status: 'Pending'
    }
  },
  {
    start: "2020-07-05T20:30:00Z",
    recurring: false,
    rendering: "background",
    end: "2020-07-05T19:30:00Z"
  }
]

const MyCalendar = (props) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const [ plugin, setPlugin ] = useState(null)
  const [ openStart, setOpenStart ] = useState('9:00 AM')
  const [ openEnd, setOpenEnd ] = useState('5:00 PM')
  const [ events, setEvents ] = useState([])
  const [ sessions, setSessions ] = useState([])
  const [ blocks, setBlocks ] = useState([])
  const [ showConfirm, setShowConfirm ] = useState(false)
  const [ deletionBlock, setDeletionBlock ] = useState(null)
  const [ showBlockModal, setShowBlockModal ] = useState(false)
  const [ showHoursModal, setShowHoursModal ] = useState(false)
  const [ currentDay, setCurrentDay ] = useState(null)
  const [ currentYear, setCurrentYear ] = useState(null)
  const [ startOptions, setStartOptions ] = useState(null)
  const [ endOptions, setEndOptions ] = useState(null)
  const calRef = useRef(null)
  const calContainer = useRef(null)
  const dropdownRef = useRef(null)
  const [ currentDate, setCurrentDate ] = useState(null)
  const tz = moment.tz.guess()

  const sessionToEvent = (session) => {
    return {
      title: `Session with ${session.pupil.username}`,
      start: session.date,
      end: moment(session.date).add(session.duration, 'minutes').format(),
      textColor: '#000',
      backgroundColor: '#FFF',
      borderColor: '#FFF',
      url: `/session/view/${session._id}`,
      extendedProps: {
        status: session.status
      }
    }
  }

  const FullCalendar = loadable(() => import('@fullcalendar/react'), { ssr: false })
  const dynamicallyImportPackage = async () => {
    const timeGridPlugin = await import('@fullcalendar/timegrid')
    setPlugin(timeGridPlugin.default)
  }
  useEffect(() => {
    dynamicallyImportPackage()
    if(!isAuthenticated) Router.push('/account/login')

    // Fetch them events
    const fetchSessions = async () => {
      const { _id } = user

      const { data } = await axios.post('/api/sessions/byId', { accountType: 'artist', _id })
      // order sessions in time order
      setSessions(data.map(sessionToEvent))
    }

    fetchSessions()
    fetchBlocks(user._id)
  }, [])

  useEffect(() => {
    console.log(calRef.current)
  }, [calRef])

  useEffect(() => {
    setEvents(sessions.concat(blocks))
  }, [blocks])

  useEffect(() => {
    if(sessions.length) {
      setEvents(blocks.concat(sessions))
    }
  }, [sessions])

  const fetchBlocks = async (_id) => {
    const { data } = await axios.get('/api/calendar', { params: { userId: _id }})

    if(data.hours) {
      if(data.hours.timezone !== tz) { // change this
        // Display hours in current timezone
        data.hours.open = moment(data.hours.open, 'h:mm A').tz(tz).format('h:mm A')
        data.hours.close = moment(data.hours.close, 'h:mm A').tz(tz).format('h:mm A')
      }

      setOpenStart(data.hours.open)
      setOpenEnd(data.hours.close)
    }

    if(data.blocks) {
      data.blocks.forEach((block) => {
        // Format depends on recurring or not
        block['start'] = block.startTime
        block['end'] = block.endTime

        if(block.recurring) {
          block.startTime = moment.tz(block.startTime, 'H:mm', `${block.timezone}`).tz(tz).format('H:mm')
          block.endTime = moment.tz(block.endTime, 'H:mm', `${block.timezone}`).tz(tz).format('H:mm')
        }
      })
    }

    setBlocks(data.blocks || [])
  }

  const onSubmit = (block) => {
    // Persist block time
    const duplicateBlock = blocks.find((b) => {
      return b.startTime === block.startTime && b.endTime === block.endTime && b.daysOfWeek === block.daysOfWeek
    })

    if(!duplicateBlock) {
        axios.post('/api/calendar', { block, _id: user._id })
      .then(({data}) => {
        // Format depends on recurring or not
        block['start'] = block.startTime
        block['end'] = block.endTime

        if(block.recurring) {
          block.startTime = moment.tz(block.startTime, 'HH:mm', `${block.timezone}`).tz(tz).format('HH:mm')
          block.endTime = moment.tz(block.endTime, 'HH:mm', `${block.timezone}`).tz(tz).format('HH:mm')
        }

        setBlocks(blocks.concat([block]))
        setEvents(events.concat([block]))
        setShowBlockModal(!showBlockModal)
      })
    }
  }

  const onSave = (hours) => {
    axios.post('/api/calendar/businessHours', { hours, userId: user._id })
    .then(({data: { hours: {open, close }}}) => {
      setOpenStart(open)
      setOpenEnd(close)
      setShowHoursModal(false)
    })
  }

  const deleteBlock = (event) => {
    setDeletionBlock(event)
    setShowConfirm(!showConfirm)
  }

  const onConfirm = () => {
    const { _id } = user
    const block = deletionBlock.extendedProps.recurring ?
      { daysOfWeek: deletionBlock._def.recurringDef.typeData.daysOfWeek,
        startTime: deletionBlock.extendedProps.start,
        endTime: deletionBlock.extendedProps.end,
        recurring: deletionBlock.extendedProps.recurring
      } : {
        startTime: deletionBlock.extendedProps.startTime,
        endTime: deletionBlock.extendedProps.endTime,
        recurring: deletionBlock.extendedProps.recurring
      }


    axios.post('/api/calendar/deleteBlock', { block, userId: _id  })
    .then(({data}) => {
      if(data > 0) {
        fetchBlocks(_id)
        setShowConfirm(!showConfirm)
      }
    })
  }

  const eventRender = ({ el, event }) => {
    if(event.rendering === 'background') {
      // Add a title element
      const span = document.createElement("span")
      const link = document.createElement("a")
      link.textContent = 'Delete'
      link.onclick = () => (deleteBlock(event))
      const start = moment(event.start).format("h:mm A")
      const end = moment(event.end).format("h:mm A")

      span.setAttribute('class', 'fc-bg-title')
      span.textContent = `BLOCK: ${start} - ${end}`
      el.append(span)
      el.append(link)
      return
    }

    const span = document.createElement("span")
    span.setAttribute('class', 'fc-status')
    span.innerHTML = event.extendedProps.status
    const title = el.getElementsByClassName('fc-title')[0]
    title.append(span)
  }

  const getMinTime = () => {
    const sortSessions = () => {
      // Order sessions from earliest to latest
      const sortedSessions = sessions.sort((a, b) => {
        return moment(a.start).isBefore(moment(b.start))
      })

      return sortedSessions
    }

    // is open time

  }

  const viewRender = ({ date, el, view }) => {
    // Filter sessions that match the current day
    try {

      calRef.current.calendar.props['minTime'] = openStart
    } catch(e) {

    }
    const sessionsInDate = sessions.filter((session) => {
      return moment(session.start).isSame(date, 'day')
    })

    const sortedSessions = sessionsInDate.sort((a, b) => {
      return moment(a.start).isBefore(moment(b.start))
    })

    // try {
    //   if(moment(sortedSessions[0].start).isBefore(openStart)) view.setTime(sortedSessions[0].start)
    //   view.setTime(openStart)
    // } catch(e) {
    //   view.setStart(openStart)
    // }
    // Sort those filtered sessions by time Order
    // compare open time to first index of filtered sessions
  }


  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css?family=Nunito:wght@400;900&display=swap" rel="stylesheet" />
      </Head>
      <MyLayout alignment="center calendar">
        <h1 alignment="center">My Calendar</h1>
        <div ref={calContainer} className="calendar-container">
        {plugin && <>
          <div className="fc-toolbar__extension">
            <BusinessHoursPanel
              localTimezone={tz}
              openTime={openStart}
              closingTime={openEnd}
              handleClick={() => setShowHoursModal(!showHoursModal)}
            />
          </div>
          <FullCalendar
          rerenderDelay={1000}
          ref={(el) => { calRef.current = el}}
          events={sessions.concat(blocks)}
          plugins={[plugin]}
          defaultView="timeGridDay"
          dayRender={(view) => viewRender(view)}
          // minTime={moment(openStart, 'h:mm A').subtract(1, 'hour').format('h:mm').toString()}
          // maxTime={moment(openEnd, 'h:mm').toString()} // this should be business hours or earliest event
          height="parent"
          nowIndicator={true}
          allDaySlot={false}
          eventRender={eventRender}
          titleFormat={{weekday: 'long', day: 'numeric', month: 'long'}}
          customButtons={{
            blockButton: {
              text: 'Block',
              click: function(e) {
                setCurrentDate(calRef.current.getApi().getDate())
                const getStarts = (openStart, openEnd) => {
                 const hourDiff = moment(openEnd, 'h:mm A').diff(moment(openStart, 'h:mm A'), 'hours')
                 const increments = hourDiff * 2

                 let times = []

                 for(let i = 0; i < increments; i++) {
                   const time = moment(openStart, 'hh:mm A').add(i * 30, 'minutes').format('h:mm A')
                   times.push(time)
                 }

                 return times
               }

                const allStartOptions = getStarts(openStart, openEnd)
                const allEndOptions = getStarts(openStart, moment(openEnd, 'h:mm A').add(1, 'hour'))
                allEndOptions.pop()
                allEndOptions.shift()

                setStartOptions(allStartOptions)
                setEndOptions(allEndOptions)
                setShowBlockModal(!showBlockModal)
              }
            }
          }}
          header={{ right: 'blockButton today prev,next' }}
         /></>}
        </div>
        {showConfirm && ReactDOM.createPortal(
          <ConfirmModal
            copy="Are you sure you want to delete this block?"
            onCancel={() => (setShowConfirm(!showConfirm))}
            onConfirm={onConfirm}/>, document.body
        )}
        {showBlockModal && <Modal
          closeModal={() => setShowBlockModal(!showBlockModal)}
          containerClassName='calendar'>
          <Dropdown
            currentDate={currentDate}
            currentYear={currentYear}
            startOptions={startOptions}
            endOptions={endOptions}
            tz={tz}
            onSubmit={onSubmit}/>
        </Modal>}
        {showHoursModal && <Modal
          closeModal={() => setShowHoursModal(!showHoursModal)}
          containerClassName='calendar'>
          <BusinessHours
            openTime={openStart}
            closingTime={openEnd}
            onSave={onSave}
            tz={tz} />
        </Modal>}
      </MyLayout>
    </React.Fragment>
  )
}

export default MyCalendar
