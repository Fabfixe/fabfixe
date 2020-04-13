import React, { Component, useState, useEffect } from 'react'
import Button from '../components/Button'
import { currencyFormatted, calcTotal, digitCalcTotal, timeMap, formatTime, validDateSelection } from '../helpers'
import moment from 'moment'
import axios from 'axios'
import Link from 'next/link'

 const ArtistList = () => {
   const [ pagination, setPagination ] = useState({ limit: 10, offset: 0 })
   const [ artists, amendArtists ] = useState([])

   useEffect(() => {
     axios.get('/api/profile/artists', { params: pagination })
     .then((res) => {
       amendArtists(artists.concat(res.data.docs))
       setPagination({ ...pagination, offset: pagination.offset + res.data.total })
     })
   }, [])

   return (
   <div className='artist-list'>
     <h1>Browse Artists</h1>
     <ul>
       {artists.map((artist) => {
         const imageStyle = artist.profileImageUrl ?
          { backgroundImage: `url(${artist.profileImageUrl})`} : { backgroundColor: 'pink' }

         return (
           <li key={`key-${artist.username}`}>
            <Link href={`/${artist.username}`}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <div
                  className="artist-image"
                  style={{...imageStyle,
                    borderRadius: '50%',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: '50%',
                    marginBottom: '10px'
                  }}
                />
                <p style={{ fontWeight: '900', fontSize: '18px' }}>{artist.username}</p>
                <p>{`$${artist.hourlyRate}/hr`}</p>
                {Object.keys(artist.expertise).map((key) => {
                  if(artist.expertise[key].length) {
                    return <p key={`key-${key}`}><span>{key}</span>{`: ${artist.expertise[key].toString()}`}</p>
                  }
                })}
              </div>
            </Link>
           </li>
         )
       })}
     </ul>
   </div>
  )
}


export default ArtistList
