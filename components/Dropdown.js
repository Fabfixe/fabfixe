import moment from 'moment'
const cn = require('classnames')
import { useState, useRef, useEffect } from 'react'

const getHours = (openStart, openEnd, start) => {
 const increments = moment(openEnd, 'h:mm A').diff(moment(openStart, 'h:mm A'), 'hours')

 let times = []

 for(let i = 0; i < increments; i++) {
   const time = moment(openStart, 'hh:mm A').add(i * 1, 'hour').format('h:mm A')
   times.push(time)

   if(i === increments - 1) {
     times.push(moment(time, 'hh:mm A').add(1, 'hour').format('h:mm A'))
     if(!start) times.push(moment(time, 'hh:mm A').add(2, 'hour').format('h:mm A'))
   }
 }

 return times
}

const onStartSelectChange = (startRef, endRef, num, str) => {
  const startSelectValue = startRef.current.value
  const endSelectValue = endRef.current.value

  if(moment(startSelectValue, 'h:mm A').isSameOrAfter(moment(endSelectValue, 'h:mm A'))) {
    const newIndex = Array.from(endRef.current.options).findIndex(({value}) => {
      return value === moment(startSelectValue, 'h:mm A').add(num, str).format('h:mm A')
    })

    if(newIndex !== -1) endRef.current.selectedIndex = newIndex
    else endRef.current.selectedIndex += 2
  }
}

const onEndSelectChange = (startRef, endRef, num, str) => {
  const startSelectValue = startRef.current.value
  const endSelectValue = endRef.current.value

  if(moment(startSelectValue, 'h:mm A').isSameOrAfter(moment(endSelectValue, 'h:mm A'))) {
    const newIndex = Array.from(startRef.current.options).findIndex(({value}) => {
      return value === moment(endSelectValue, 'h:mm A').subtract(num, str).format('h:mm A')
    })

    if(newIndex !== -1) startRef.current.selectedIndex = newIndex
    else startRef.current.selectedIndex += 1
  }
}

export const Dropdown = ({ currentDate, openStart, openEnd, startOptions, endOptions, onSubmit, tz }) => {
  const startRef = useRef(null)
  const endRef = useRef(null)
  const recurringRef = useRef(null)
  const currentDay = moment(currentDate).format('dddd')
  const formattedDate = moment(currentDate).format('MMM D YYYY')
  const formatEvent = () => {
    let evt = {
      rendering: 'background',
      recurring: recurringRef.current.checked,
    }

    if(recurringRef.current.checked) {
      evt['daysOfWeek'] = moment(currentDay, 'dddd').format('e')
      evt['startTime'] = moment(startRef.current.value, 'h:mm A').format('HH:mm')
      evt['endTime'] = moment(endRef.current.value, 'h:mm A').format('HH:mm')
      evt['timezone'] = tz
    } else {
      const startTime = `${formattedDate} ${startRef.current.value}`
      const endTime = `${formattedDate} ${endRef.current.value}`
      const timeFormat = 'MMM D YYYY H:mm A'
      evt['startTime'] = moment(startTime, timeFormat).tz(tz).utc().format()
      evt['endTime'] = moment(endTime, timeFormat).tz(tz).utc().format()
    }

    return evt
  }

  return (
    <div className="dropdown">
      <div className="dropdown-select__container">
        <label>Weekday</label>
        <div>
          <span>{formattedDate}</span>
        </div>
      </div>
      <div className="dropdown-set">
        <div className="dropdown-select__container">
          <label>Start Time</label>
          <div className="select-container">
            <select ref={startRef} onChange={() => onStartSelectChange(startRef, endRef, 30, 'minutes')}>{startOptions.map((time) => <option value={time} name={time} key={`key-${time}`}>{time} ▾</option>)}</select>
          </div>
        </div>
        <div className="dropdown-select__container">
          <label>End Time</label>
          <div className="select-container">
            <select ref={endRef} onChange={() => onEndSelectChange(startRef, endRef, 30, 'minutes')}>{endOptions.map((time) => <option name={time} key={`key-${time}`}>{time}</option>)}</select>
            <p>▾</p>
          </div>
        </div>
      </div>
      <div className="dropdown-select__container">
        <input ref={recurringRef} style={{ marginBottom: 0, height: '22px'}} type="checkbox" value="Recurring" />
        <label>{`Recurring (${currentDay}s)`}</label>
      </div>
      <div className="dropdown-button__container">
        <button className="button" onClick={() => onSubmit(formatEvent())}>Save</button>
      </div>
    </div>
  )
}

export const BusinessHoursPanel = ({ openTime, closingTime, localTimezone, handleClick }) => {
  const [ showSave, setShowSave ] = useState(false)
  const openRef = useRef(null)
  const closeRef = useRef(null)

  return (
    <div className="extension-container" onClick={handleClick}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <label>Open</label>
        <div>
          <span>{openTime}</span>
          <span>▾</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <label>Close</label>
        <div>
          <span>{closingTime}</span>
          <span>▾</span>
        </div>
      </div>
      <span style={{ marginLeft: '10px' }}>{`(${moment.tz(localTimezone).format('z')})`}</span>
    </div>
  )
}

export const BusinessHours = ({ openTime, closingTime, onSave, tz }) => {

  const [ showSave, setShowSave ] = useState(false)
  const openRef = useRef(null)
  const closeRef = useRef(null)
  const openTimes = getHours('12:00 AM', '11:00 PM', true)
  const closingTimes = getHours('1:00 AM', '11:00 PM', false)

  const handleStartChange = () => {
    onStartSelectChange(openRef, closeRef, 1, 'hour')
  }

  const handleEndChange = (e) => {
    if(e.target.value === '12:00 AM') return
    onEndSelectChange(openRef, closeRef, 1, 'hour')
  }

  const formatHours = () => {
    const hours = {
      open: openRef.current.value,
      close: closeRef.current.value,
      timezone: tz
    }

    return hours
  }

  useEffect(() => {
    try {
      const selectedIndexOpen = Array.from(openRef.current).findIndex((option) => {
        return option.value === openTime
      })

      const selectedIndexClose = Array.from(closeRef.current).findIndex((option) => {
        return option.value === moment(closingTime, 'h:mm A').format('h:mm A')
      })

      openRef.current[selectedIndexOpen].selected = true
      closeRef.current[selectedIndexClose].selected = true
    } catch(e) {
    }
  }, [])


  return (
    <div className="dropdown">
      <div className="dropdown-set" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-evenly'}}>
        <div className="extension-dropdown">
          <label>Open</label>
          <div className="select-container">
            <select onChange={handleStartChange} ref={openRef}>
              {openTimes.map((time) => <option key={`time-${time}`}>{time}</option>)}
            </select>
            <p>▾</p>
          </div>
        </div>
        <div className="extension-dropdown">
          <label>Close</label>
          <div className="select-container">
            <select onChange={handleEndChange} ref={closeRef}>
              {closingTimes.map((time) => <option key={`time-${time}`}>{time}</option>)}
            </select>
            <p>▾</p>
          </div>
        </div>
        <button onClick={() => onSave(formatHours())} className="button">Save</button>
      </div>
    </div>
  )
}
