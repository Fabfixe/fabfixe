import React, { Component } from 'react'
import Button from '../components/Button'
import Banner from '../components/Banner'
import Datetime from 'react-datetime'
import Router from 'next/router'
import { currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../helpers'
import moment from 'moment'
import axios from 'axios'

const CongratsModal = ({ artist, date, duration, hourlyRate }) => (
  <div className="congrats-content">
    <p>Congrats! You have successfully scheduled a session with {artist.username}!</p>
    <p>Time: {formatTime(date, duration)}</p>
    <p>Total: ${digitCalcTotal(duration, hourlyRate)}</p>
  </div>
)

export default CongratsModal
