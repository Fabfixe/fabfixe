import React, { Component, useState, useEffect } from 'react'
import Button from '../components/Button'
import { currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../helpers'
import moment from 'moment'
import axios from 'axios'
import Link from 'next/link'

 const ArtistList = () => {
   const [ pagination, setPagination ] = useState({ limit: 10, offset: 0 })
   const [ artists, amendArtists ] = useState([])
   const [ isLoading, setIsLoading ] = useState(true)

   useEffect(() => {
     window.addEventListener('scroll', handleScroll, false)

     axios.get('/api/profile/artists', { params: pagination })
     .then((res) => {
       amendArtists(artists.concat(res.data.docs))
       setPagination({ ...pagination, offset: pagination.offset + res.data.total })
       setIsLoading(false)
     })
   }, [])

   const handleScroll = () => {
     if(!isLoading && getScrollPercent() > 75 && artists.length === pagination.limit) {
       setIsLoading(true)

       axios.get('/api/profile/artists', { params: pagination })
       .then((res) => {
         amendArtists(artists.concat(res.data.docs))
         setPagination({ ...pagination, offset: pagination.offset + res.data.total })
         setIsLoading(false)
       })
     }
   }

   if(isLoading) {
     return (<div className="loading">Loading</div>)
   }

   if(!artists.length) {
     return (<div className="loading">No artists yet, come back soon!</div>)
   } else {


     return (
       <div className="artist-list">
        <h1>Browse Artists</h1>
        <ul>
          {artists.map((artist) => {
            const imageStyle = artist.profileImageUrl ?
             { backgroundImage: `url(${artist.profileImageUrl})`} : {
               backgroundSize: '60%', backgroundColor: '#F7E4BE', backgroundImage: 'url("/img/avatar.svg")' }

            return (
              <Link key={`key-${artist.username}`} href={`/${artist.username}`}>
                <li>
                  <div
                    className="artist-image"
                    style={imageStyle}
                  />
                  <div className="artist-metadata">
                    <h2 className="display-name">{artist.displayName}</h2>
                    <p className='hourly-rate'>{`$${artist.hourlyRate}/hr`}</p>
                    {Object.keys(artist.expertise).map((key) => {
                      if(artist.expertise[key].length) {
                        return <p className='artist-expertise' key={`key-${key}`}>{ `${artist.expertise[key].join(', ')}`}</p>
                      }
                    })}
                  </div>
                </li>
              </Link>
            )}
          )}
        </ul>
       </div>
     )
   }
}

function getScrollPercent() {
  const h = document.documentElement,
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight'
  return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100
}


export default ArtistList
