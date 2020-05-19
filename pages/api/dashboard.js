require('dotenv').config()
const express = require('express')
const moment = require('moment-timezone')
const router = express.Router()
const { GoogleSpreadsheet } = require('google-spreadsheet')
const fs = require('fs')
const User = require('../../models/User')
const CronJob = require('cron').CronJob
const Session = require('../../models/Sessions')

const sheetsIDMap = {
  dev: '10thQrsMuD3ggSDKUoNKMKkUvXsj2fQJ1sA76imY3bMA',
  staging: '1uHLv0PaVoH1HtHHbBSq5zQnSl1fjyjhXwVOWnnlV9xc',
  production: '1be6enBsJgPROP2H5fC2xZ47IjmYPP0-s7ePP0U-QM5E'
}

const sheetID = process.env.ENV ? sheetsIDMap[process.env.ENV] : sheetsIDMap.dev
const doc = new GoogleSpreadsheet(sheetID);

async function updateSheets() {
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.SHEETS_PRIVATE_KEY,
  })

  await doc.loadInfo()
  const firstSheet = doc.sheetsByIndex[0];
  const secondSheet = doc.sheetsByIndex[1];
  const thirdSheet = doc.sheetsByIndex[2];
  const fourthSheet = doc.sheetsByIndex[3];

  const rows = await firstSheet.getRows();

  let offsetDateISO

  try {
    const offsetDate = await rows[rows.length - 1].Date
    offsetDateISO = moment.tz(offsetDate).utc().toISOString()
  } catch {
    offsetDateISO = moment().toISOString()
  }

  const sessions = await Session.find({
    date: { $gte: offsetDateISO },
    artistApproved: true
  })

  await firstSheet.setHeaderRow(['ID', 'Date', 'Artist', 'Pupil', 'OrderID', 'Artist Email', 'Pupil Email' ])
  await secondSheet.setHeaderRow(['ID', 'Event Type', 'User Type', 'Date'])
  await thirdSheet.setHeaderRow(['ID', 'Date', 'From', 'To', 'Body' ])
  await fourthSheet.setHeaderRow(['ID', 'Date', 'From', 'To', 'Body' ])

  for (let i = 0; i < sessions.length; i++) {
    let session = sessions[i]
    let artist = await User.find({ _id: session.artist })
    let pupil = await User.find({ _id: session.pupil })

    firstSheet.addRow({
      ID: session._id,
      Date: moment(session.date).tz('America/New_York').format('MM/DD/YYYY h:mma z'),
      Artist: session.artist,
      Pupil: session.pupil,
      OrderID: session.orderID,
      'Artist Email': artist[0].email,
      'Pupil Email': pupil[0].email
    })
  }

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i]
    let { sessionEvents, messages, videoMessages } = sessions[i]._doc
    const visitedPreviewArtist = sessionEvents.artist.visitedPreview
    const visitedPreviewPupil = sessionEvents.pupil.visitedPreview
    const visitedSessionArtist = sessionEvents.artist.visitedSession
    const visitedSessionPupil = sessionEvents.pupil.visitedSession
    const mediaConnectionErrorArtist = sessionEvents.artist.mediaConnectionError
    const mediaConnectionErrorPupil = sessionEvents.pupil.mediaConnectionError
    const roomConnectFailedErrorArtist = sessionEvents.artist.roomConnectFailedError
    const roomConnectFailedErrorPupil = sessionEvents.pupil.roomConnectFailedError
    const cancelledSessionArtist = sessionEvents.artist.cancelledSession
    const cancelledSessionPupil = sessionEvents.pupil.cancelledSession

    try {
      for (let i = 0; i < visitedPreviewArtist.length; i++) {
        await secondSheet.addRow({
          ID: session._id,
          'Event Type': 'Visited Preview',
          'User Type': 'Artist',
          Date: moment(visitedPreviewArtist[i]).tz('America/New_York').format('MM/DD/YYYY h:mma z'),
        })
      }
    } catch {

    }

    try {
      for (let i = 0; i < visitedPreviewPupil.length; i++) {
        await secondSheet.addRow({
          ID: session._id,
          'Event Type': 'Visited Preview',
          'User Type': 'Pupil',
          Date: moment(visitedPreviewPupil[i]).tz('America/New_York').format('MM/DD/YYYY h:mma z'),
        })
      }
    } catch {

    }

    // Visited Session Page
    try {
      for (let i = 0; i < visitedSessionArtist.length; i++) {
        await secondSheet.addRow({
          ID: session._id,
          'Event Type': 'Visited Session',
          'User Type': 'Artist',
          Date: moment(visitedSessionArtist[i]).tz('America/New_York').format('MM/DD/YYYY h:mma z'),
        })
      }
    } catch {

    }

    try {
      for (let i = 0; i < visitedSessionPupil.length; i++) {
        await secondSheet.addRow({
          ID: session._id,
          'Event Type': 'Visited Session',
          'User Type': 'Pupil',
          Date: moment(visitedSessionPupil[i]).tz('America/New_York').format('MM/DD/YYYY h:mma z'),
        })
      }
    } catch {

    }

    // Twilio Errors
    try {
      for (let i = 0; i < roomConnectFailedErrorPupil.length; i++) {
        await secondSheet.addRow({
          ID: session._id,
          'Event Type': 'Room Connect Failed Error',
          'User Type': 'Pupil',
          Date: moment(roomConnectFailedErrorPupil[i]).tz('America/New_York').format('MM/DD/YYYY h:mma z'),
        })
      }
    } catch {

    }

    try {
      for (let i = 0; i < roomConnectFailedErrorArtist.length; i++) {
        await secondSheet.addRow({
          ID: session._id,
          'Event Type': 'Room Connect Failed Error',
          'User Type': 'Artist',
          Date: moment(roomConnectFailedErrorArtist[i]).tz('America/New_York').format('MM/DD/YYYY h:mma z'),
        })
      }
    } catch {

    }

    try {
      for (let i = 0; i < mediaConnectionErrorPupil.length; i++) {
        await secondSheet.addRow({
          ID: session._id,
          'Event Type': 'Room Connect Failed Error',
          'User Type': 'Pupil',
          Date: moment(mediaConnectionErrorPupil[i]).tz('America/New_York').format('MM/DD/YYYY h:mma z'),
        })
      }
    } catch {

    }

    try {
      for (let i = 0; i < mediaConnectionErrorArtist.length; i++) {
        await secondSheet.addRow({
          ID: session._id,
          'Event Type': 'Room Connect Failed Error',
          'User Type': 'Artist',
          Date: moment(mediaConnectionErrorArtist[i]).tz('America/New_York').format('MM/DD/YYYY h:mma z'),
        })
      }
    } catch {

    }


    // Cancellations

    if(cancelledSessionArtist !== '') {
      await secondSheet.addRow({
        ID: session._id,
        'Event Type': 'Cancelled Session',
        'User Type': 'Artist',
        Date: moment(cancelledSessionArtist).tz('America/New_York').format('MM/DD/YYYY h:mma z')
      })
    }

    if(cancelledSessionPupil !== '') {
      await secondSheet.addRow({
        ID: session._id,
        'Event Type': 'Cancelled Session',
        'User Type': 'Pupil',
        Date: moment(cancelledSessionPupil).tz('America/New_York').format('MM/DD/YYYY h:mma z')
      })
    }

    // Messages
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i]
      await thirdSheet.addRow({
        ID: session._id,
        Date: moment(message.time).tz('America/New_York').format('MM/DD/YYYY h:mma z'),
        From: message.from,
        To: message.to,
        Body: message.body,
      })
    }

    // Session Messages
    for (let i = 0; i < videoMessages.length; i++) {
      const videoMessage = videoMessages[i]
      await fourthSheet.addRow({
        ID: session._id,
        Date: moment(videoMessage.time).tz('America/New_York').format('MM/DD/YYYY h:mma z'),
        From: videoMessage.from,
        To: videoMessage.to,
        Body: videoMessage.body,
      })
    }
  }
}

const job = new CronJob('0 0 0 * * *', function() {
  updateSheets()
})

job.start()

module.exports = router
