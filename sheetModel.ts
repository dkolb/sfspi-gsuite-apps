import {commaSplit} from './utilities'

export class NunEvent {
  timestamp: string
  date: Date
  email: string
  eventName: string
  venue: string
  purpose: string
  sucesses: string
  challenges: string
  pointMembers: string[]
  attendees: string[]

  constructor(row: any[]) {
    this.timestamp = row[0]
    this.date = row[1]
    this.email = row[2]
    this.eventName = row[3]
    this.venue = row[4]
    this.purpose = row[5]
    this.sucesses = row[6]
    this.challenges = row[7]
    this.pointMembers = commaSplit(row[8])
    this.attendees = commaSplit(row[9])
  }
}

export class Member {
  pseudonym: string
  legalName: string
  level: string
  status: string
  mobileNumber: string
  email: string
  streetAddress: string
  city: string
  state: string
  zip: string
  birthday: string

  constructor(row) {
    this.pseudonym = row[0]
    this.legalName = row[1]
    this.level = row[2]
    this.status = row[3]
    this.mobileNumber = row[4]
    this.email = row[5]
    this.streetAddress = row[6]
    this.city = row[7]
    this.state = row[8]
    this.zip = row[9]
    this.birthday = row[10]
  }
}

export class Meeting {
  timestamp: string
  attendees: string[]
  meetingType: string
  date: Date
  inactiveAttendees: string[]
  guests: string[]
  linkToMinutes: string

  constructor(row: any[]) {
    this.timestamp= row[0],
    this.attendees = commaSplit(row[1])
    this.meetingType = row[2],
    this.date = row[3],
    this.inactiveAttendees = commaSplit(row[4])
    this.guests = commaSplit(row[5])
    this.linkToMinutes = row[6]
  }
}