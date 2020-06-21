import moment from 'moment'
const cn = require('classnames')
import { useState, useRef, useEffect } from 'react'

export const Dropdown = ({ currentDay, openStart, openEnd, startOptions, endOptions, onSubmit }) => {
  const [showDropdown, setShowDropdown] = useState(true)
  const startRef = useRef(null)
  const endRef = useRef(null)
  const weekdayRef = useRef(null)
  const recurringRef = useRef(null)

  const onClose = () => {
    setShowDropdown(false)
  }

  const onStartSelectChange = () => {
    const startSelectValue = startRef.current.value
    const endSelectValue = endRef.current.value

    if(moment(startSelectValue, 'h:mm A').isSameOrAfter(moment(endSelectValue, 'h:mm A'))) {
      const newIndex = Array.from(endRef.current.options).findIndex(({value}) => {
        return value === moment(startSelectValue, 'h:mm A').add(30, 'minutes').format('h:mm A')
      })

      if(newIndex !== -1) endRef.current.selectedIndex = newIndex
      else endRef.current.selectedIndex += 2
    }
  }

  const onEndSelectChange = () => {
    const startSelectValue = startRef.current.value
    const endSelectValue = endRef.current.value

    if(moment(startSelectValue, 'h:mm A').isSameOrAfter(moment(endSelectValue, 'h:mm A'))) {
      const newIndex = Array.from(startRef.current.options).findIndex(({value}) => {
        return value === moment(endSelectValue, 'h:mm A').subtract(30, 'minutes').format('h:mm A')
      })

      if(newIndex !== -1) startRef.current.selectedIndex = newIndex
      else startRef.current.selectedIndex += 1
    }
  }

  useEffect(() => {
    try {
      const selectedIndex = Array.from(weekdayRef.current).findIndex((option) => {
        return option.value === moment(currentDay, 'e').format('dddd')
      })

      weekdayRef.current[selectedIndex].selected = true
    } catch(e) {

    }
  })

  return (
    <>
      {showDropdown && <div className="dropdown">
        <div onClick={onClose} className="close">✕</div>
        <div className="dropdown-select__container">
          <label>Weekday</label>
          <select ref={weekdayRef}>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
        </div>
        <div className="dropdown-select__container">
          <label>Start Time</label>
          <select ref={startRef} onChange={onStartSelectChange}>{startOptions.map((time) => <option name={time} key={`key-${time}`}>{time}</option>)}</select>
        </div>
        <div className="dropdown-select__container">
          <label>End Time</label>
          <select ref={endRef} onChange={onEndSelectChange}>{endOptions.map((time) => <option name={time} key={`key-${time}`}>{time}</option>)}</select>
        </div>
        <div className="dropdown-select__container">
          <label>Recurring</label>
          <input ref={recurringRef} style={{ marginBottom: 0, height: '22px'}} type="checkbox" value="Recurring" />
        </div>
        <div className="dropdown-button__container">
          <button onClick={() => (onSubmit({
            daysOfWeek: moment(weekdayRef.current.value, 'dddd').format('e'),
            startTime: moment(startRef.current.value, 'h:mm A').format('H:mm'),
            endTime: moment(endRef.current.value, 'h:mm A').format('H:mm'),
            rendering: 'background',
            recurring: recurringRef.current.checked
          }))}>Save</button>
        </div>
      </div>}
    </>
  )
}
