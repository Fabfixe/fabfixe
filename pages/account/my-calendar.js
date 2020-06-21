import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import loadable from '@loadable/component'

import Head from 'next/head'
import PropTypes from 'prop-types'
import Login from '../../components/Login'
import MyLayout from '../../components/MyLayout'
import Hero from '../../components/Hero'
import { Dropdown } from '../../components/Dropdown'
import Footer from '../../components/Footer'
import Sessions from '../../components/Sessions'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import moment from 'moment'

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
    start: Date.now() - (1*60*60*1000),
    end: Date.now()  + (1*60*60*1000),
    url: '',
    rendering: 'background',
    extendedProps: {
      status: 'Pending'
    }
  }
]

const MyCalendar = (props) => {
  const [ plugin, setPlugin ] = useState(null)
  const [ openStart, setOpenStart ] = useState('09:00 AM')
  const [ openEnd, setOpenEnd ] = useState('6:00 PM')
  const [ events, setEvents ] = useState(importedEvents)
  const tz = moment.tz.guess()
  const calRef = React.createRef()
  const dropdownRef = useRef()

  const FullCalendar = loadable(() => import('@fullcalendar/react'), { ssr: false })


  useEffect(() => {
    // if(!props.auth.isAuthenticated) Router.push('/account/login')
    dynamicallyImportPackage()
  })

  const dynamicallyImportPackage = async () => {
    const timeGridPlugin = await import('@fullcalendar/timegrid')
    setPlugin(timeGridPlugin.default)
  }

  const openBlockDropdown = (_this) => {
    _this.append(<Dropdown />)
  }

  const onSubmit = (blockTime) => {
    console.log(blockTime)
    setEvents(events.concat([blockTime]))
  }

  const eventRender = ({ el, event }) => {
    if(event.rendering === 'background') {
      // Add a title element
      const span = document.createElement("span")
      const link = document.createElement("a")
      link.textContent = 'Remove'
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


  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MyLayout alignment="center calendar">
        <h1 alignment="center">My Calendar</h1>
        <div className="calendar-container">
        {plugin && <FullCalendar
          ref={calRef}
          events={events}
          plugins={[plugin]}
          defaultView="timeGridDay"
          // minTime={moment(openStart, 'h:mm A').subtract(1, 'hour').format('h:mm').toString()}
          // maxTime={moment(openEnd, 'h:mm').toString()} // this should be business hours or earliest event
          height="parent"
          nowIndicator={true}
          allDaySlot={false}
          columnHeaderFormat={{ weekday: 'long' }}
          eventRender={eventRender}
          customButtons={{
            blockButton: {
              text: 'Block',
              click: function(e) {
                // if(document.querySelector('.dropdown-container')) return

                const currentDay = calRef.current.getApi().getDate().getDay()
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

                const startOptions = getStarts(openStart, openEnd)
                const endOptions = getStarts(openStart, moment(openEnd, 'h:mm A').add(1, 'hour'))
                endOptions.pop()
                endOptions.shift()

                const toolbar = document.querySelector('.fc-toolbar')
                const node = document.createElement('div')
                node.setAttribute('class', 'dropdown-container')
                toolbar.append(node)

                ReactDOM.render(<Dropdown
                  currentDay={currentDay}
                  startOptions={startOptions}
                  endOptions={endOptions}
                  onSubmit={onSubmit}/>, node)
              }
            }
          }}
          header={{ right: 'blockButton today prev,next' }}
         />}
        </div>
      </MyLayout>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(MyCalendar)
