import {
  NunEvent,
  Member,
  Meeting
} from './sheetModel'

export function getReportEvents_(activeSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): NunEvent[] {
  var sinceDate = reportingDate_()
  return getEvents_(activeSpreadsheet)
    .filter(event => event.date > sinceDate)
}

export function getReportMeetings_(activeSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Meeting[] {
  var sinceDate = reportingDate_()
  return getMeetings_(activeSpreadsheet)
    .filter(meeting => meeting.date > sinceDate)
}

export function getActiveMembers_(activeSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Member[] {
  var sinceDate = reportingDate_()
  return getMembers_(activeSpreadsheet).filter(function(member) {
    return member.status === 'Active'
  })
}

export function reportingDate_(): Date {
  //One year ago, beginning of month.
  var lastYear = new Date()
  lastYear.setFullYear(lastYear.getFullYear() - 1)
  lastYear.setDate(1)
  return lastYear
}

export function getMeetings_(activeSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Meeting[] {
  return activeSpreadsheet.getSheetByName('Meetings')
    .getRange('A2:G')
    .getValues()
    .filter((row: any[]) => row && row[0])
    .map((row: any[]) => new Meeting(row))
}

export function getEvents_(activeSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): NunEvent[] {
  return activeSpreadsheet.getSheetByName('Events')
    .getRange('A2:J')
    .getValues()
    .filter((row: any[]) => row && row[0])
    .map((row: any[]) => new NunEvent(row))
}

export function getMembers_(activeSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): Member[] {
  return activeSpreadsheet.getSheetByName('Members')
    .getRange('A2:D')
    .getValues()
    .filter((row: any[]) => row && row[0])
    .map((row: any[]) => new Member(row))
}