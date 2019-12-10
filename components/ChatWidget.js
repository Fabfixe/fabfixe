import React, { useState, useEffect, useRef } from 'react'
import Button from './Button'
import axios from 'axios'
import moment from 'moment-timezone'
const classNames = require('classnames')

export default props => {
  const textArea = useRef()
  const [message, updateMessage] = useState('')
  const [submitReady, setSubmitReady] = useState(false)
  const [messages, updateMessages] = useState(props.session[0].videoMessages || [])

  useEffect(() => {
    const latestRemoteMessage = props.remoteMessages[props.remoteMessages.length - 1]
    updateMessages(messages.concat([latestRemoteMessage]))
  }, [props.remoteMessages])

  const onTextChange = (e) => {
    const newMessage = e.target.value
    updateMessage(newMessage)
    if(newMessage !== '') setSubmitReady(true)
  }

  const onSubmit = () => {
    const { isPupil } = props
    const fromName = isPupil ? props.pupil : props.artist
    const toName = isPupil ? props.artist : props.pupil
    const newMessage = {
      from: props.userId,
      time: new Date(),
      body: message
    }

    let newSession = {
      _id: props.session[0]._id,
      isPupil: props.isPupil,
      videoMessages: messages.concat([newMessage])
    }

    if(newMessage.body !== '') {
      updateMessages(messages.concat([newMessage]))
      axios.post('/api/sessions/newVideoMessage', newSession)
        .then((res) => {
          // Add check for response code
          textArea.current.value = ''
          if(res.data.n === 1) {
            // If the message was actually sent
            props.onMessageCreation(newMessage)
            // updateDeliveredMessages(deliveredMessages.concat([newMessage]))
          } else {

          }
        })
    }
  }

  return (
    <div id='chat-drawer'>
      <div className='chat-exit'><p onClick={props.closeDrawer}>⟵</p></div>
      <div className='chat-messages'>
        <ul>
          {messages && messages.map((message, idx) => {
            if (!message )return
            const isPupil = props.accountType === 'pupil'
            const artistUsername = props.session[0].artist.username
            const pupilUsername = props.session[0].pupil.username
            const messageSender = message.from === props.userId ? 'You' : isPupil ? artistUsername : pupilUsername

            return (
              <li key={idx}>
                <p>{moment(message.time).format("h:mm a")}</p>
                <p>{messageSender}</p>
                <p>{message.body}</p>
              </li>
            )
          })}
        </ul>
      </div>
      <div className='chat-compose'>
        <textarea onChange={onTextChange} ref={textArea} placeholder='Write your message here' />
        <Button disabled={!submitReady} onClick={onSubmit}>Send</Button>


      </div>
    </div>
  )
}
