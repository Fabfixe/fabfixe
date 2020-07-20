import moment from 'moment'

export const currencyFormatted = (amount) => {
	let i = parseFloat(amount)
	if(isNaN(i)) i = 0.00

	let minus = ''
	if(i < 0) minus = '-'

	i = Math.abs(i)
	i = parseInt((i + .005) * 100)
	i = i / 100

	let s = new String(i)
	if(s.indexOf('.') < 0) s += '.00'
	if(s.indexOf('.') === (s.length - 2))  s += '0'
	s = minus + s
	return s
}

export const calcTotal = (duration, hourlyRate) => {
  return currencyFormatted((timeMap[duration] / 60) * hourlyRate)
}

export const digitCalcTotal = (duration, hourlyRate) => {
	return currencyFormatted((duration / 60) * hourlyRate)
}

export const timeMap = {
  '30 min': 30,
  '1 hour': 60,
  '1 hour 30 min': 90,
  '2 hours': 120
}

export const formatTime = (time, duration) => {
	const tz = moment.tz.guess()
  duration = timeMap[duration] || parseInt(duration)
  if(moment(time).isMoment) return `${time.format("MM/DD/YYYY h:mma")} - ${time.add(duration, 'm').format("MM/DD/YYYY h:mma")}`
  return `${moment(time).tz(tz).format("MM/DD/YYYY h:mma") + ' ' + moment.tz(tz).zoneAbbr()} - ${moment(time).add(duration, 'm').format("MM/DD/YYYY h:mma") + ' ' + moment.tz(tz).zoneAbbr()}`
}

export const validDateSelection = (current) => {
	return current.isSameOrAfter(moment(), 'day')
}

export const getAvailability = (calendar, duration, day) => {
		// Assuming calendar.hours
	const { hours, blocks } = calendar
	const d = moment(day).get('date')
	const m = moment(day).get('month')
	const y = moment(day).get('year')
	const fullOpen = moment(hours.open, 'h:mm A').tz(hours.timezone).set('date', d).set('month', m).set('year', y)
	const fullClose = moment(hours.close, 'h:mm A').tz(hours.timezone).set('date', d).set('month', m).set('year', y)

	// Normalize sessions
	calendar.sessions = calendar.sessions.map((session) => {
		// TODO: if the session is not cancelled or expired
		session['startTime'] = moment(session.date)
		session['endTime'] = moment(session.date).add(session.duration, 'minutes')

		return session
	})

	// Get array of hours from open to close
	let hourBlocks = []
	let hoursStart = hours.open
	let latestSession = fullClose.subtract(duration, 'minutes')

	while(fullOpen.isBefore(latestSession)) {
		hourBlocks.push(moment(fullOpen))
		fullOpen.add(duration, 'minutes')
	}


	// filter exclude dates
	const excludeTimes = hourBlocks.filter((hb) => {
		const matchingBlock = blocks.find((block) => {
			if(block.daysOfWeek == moment(day).get('day')) {
				const formattedStart = moment(block.startTime, 'HH:mm').tz(block.timezone).set('date', d).set('month', m).set('year', y)
				const formattedEnd = moment(block.endTime, 'HH:mm').tz(block.timezone).set('date', d).set('month', m).set('year', y)

				return hb.isBetween(formattedStart, formattedEnd, undefined, '[)')
			} else if(!block.recurring) {
				 return hb.isBetween(block.startTime, block.endTime, undefined, '[')
			}
		})

		return matchingBlock
	})

	// filter sessions
	excludeTimes.concat(hourBlocks.filter((hb) => {
		const matchingBlock = calendar.sessions.find((session) => {
			return hb.isBetween(session.startTime, session.endTime, undefined, '[')
		})
	}))

	let noAvailability = excludeTimes.length === hourBlocks.length
	let firstSlot = null
	let lastSlot = null

	const reversed = [...hourBlocks].reverse()

	if(!noAvailability) {
		 firstSlot = hourBlocks.find((slot) => {
			const formattedExcludeTimes = excludeTimes.map((t) => t.format())
			const slotIsAfterNow = slot.isSameOrAfter(moment().add(1, 'hour'))
			const slotIsExcludedTime = formattedExcludeTimes.includes(slot.format())
			return slotIsAfterNow && !slotIsExcludedTime
		})

		lastSlot = reversed.find((slot) => {
		 const formattedExcludeTimes = excludeTimes.map((t) => t.format())
		 const slotIsAfterNow = slot.isSameOrAfter(moment().add(1, 'hour'))
		 const slotIsExcludedTime = formattedExcludeTimes.includes(slot.format())
		 return slotIsAfterNow && !slotIsExcludedTime
	 })

	 	if(!firstSlot) noAvailability = true
	}


	return { excludeTimes, noAvailability, firstSlot, lastSlot }

	// go to the next day and start over
}
