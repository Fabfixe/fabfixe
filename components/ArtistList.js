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

   return (
  <React.Fragment>
     <div className='artist-list'>
       <h1>Browse Artists</h1>
       {!isLoading ? <ul>
         {artists.length ? artists.map((artist) => {
           const imageStyle = artist.profileImageUrl ?
            { backgroundImage: `url(${artist.profileImageUrl})`} : { backgroundColor: 'pink' }

           return (
             <Link href={`/${artist.username}`}>
               <li key={`key-${artist.username}`}>
                  <div
                    className="artist-image"
                    style={{...imageStyle,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: '50%',
                    }}
                  />
                  <div className='artist-metadata'>
                    <h2 className='display-name'>{artist.displayName}</h2>
                    <p className='hourly-rate'>{`$${artist.hourlyRate}/hr`}</p>
                    {Object.keys(artist.expertise).map((key) => {
                      if(artist.expertise[key].length) {
                        return <p className='artist-expertise' key={`key-${key}`}>{ `${artist.expertise[key].join(', ')}`}</p>
                      }
                    })}
                  </div>
               </li>
             </Link>
           )
         }) : <li>No artists yet, come back soon</li>}
       </ul> : <p>Loading</p>}
     </div>
   </React.Fragment>
  )
}

function getScrollPercent() {
  const h = document.documentElement,
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight'
  return ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100
}


export default ArtistList
