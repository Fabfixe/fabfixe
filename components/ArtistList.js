import React, { Component, useState, useEffect } from 'react'
import Button from '../components/Button'
import Banner from '../components/Banner'
import Datetime from 'react-datetime'
import Router from 'next/router'
import { currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../helpers'
import validateSessionSubmit from '../validation/sessionSubmit'
import { deleteSession } from '../actions/session'
import moment from 'moment'
import axios from 'axios'


 const ArtistList = () => {
   const [ pagination, setPagination ] = useState({ limit: 1, offset: 0 })
   const [ artists, amendArtists ] = useState([])

   return (
   <div className='artist-list'>
     <h1>Browse Artists</h1>
     <ul>
       {artists.map(() => {
         <li>artist.username</li>
       })}
     </ul>
   </div>
  )
}


export default ArtistList
