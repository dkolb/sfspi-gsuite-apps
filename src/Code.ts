import {
  getActiveMembers_, 
  getEvents_,
  getMeetings_,
  getMembers_,
  getReportEvents_,
  getReportMeetings_
} from './sheetQueries'

import {
  getSettings_,
  uniqueConcat_
} from './utilities'

const VERSION = '0.0.2'

function onOpen(e) {
  var spreadsheet = SpreadsheetApp.getUi()
    .createMenu('SFSPI Functions')
    .addItem('Update Forms with Active Members', 'updateFormsWithActiveMembers')
    .addItem('Generate Attendance Report', 'generateAttendanceReport')
    .addItem('Create Detailed Attendance Report', 'generateDetailedAttendanceReport')
    .addToUi()
}

function updateFormsWithActiveMembers(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var pseudonyms = getActiveMembers_(ss).map(m => m.pseudonym)
  
  var eventForm = FormApp.openByUrl(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Events').getFormUrl())
  eventForm.getItemById(getSettings_('EVENT_FORM_ATTENDEES_ITEM_ID') as number)
  .asCheckboxItem()
  .setChoiceValues(pseudonyms)
  
  eventForm.getItemById(getSettings_('EVENT_FORM_POINTNUN_ITEM_ID') as number)
  .asCheckboxItem()
  .setChoiceValues(pseudonyms)
  
  var attendeeForm = FormApp.openByUrl(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Meetings').getFormUrl())
  
  attendeeForm.getItemById(getSettings_('MEETING_FORM_ATTENDEES_ITEM_ID') as number)
  .asCheckboxItem()
  .setChoiceValues(pseudonyms)
}

function generateAttendanceReport(e) {  
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  
  // Delete sheet if exists and start fresh.
  var reportSheet = ss.getSheetByName('Attendance Report')
  if(reportSheet != null) {
    ss.deleteSheet(reportSheet)
  }
  reportSheet = ss.insertSheet('Attendance Report', getSettings_('ATTENDANCE_REPORT_INDEX') as number)
  
  // Grab full events list.
  var events = getReportEvents_(ss)
  var meetings = getReportMeetings_(ss)
  var activeMembers = getActiveMembers_(ss)
  
  // Prime our summary report.
  var report = {};
  var checkReportFor = (key: string) => {
    if(!report[key]) {
      report[key] = {
        events: 0,
        meetings: 0
      }
    }
  }

  //Populate report with relevant events.
  events.forEach(event => {
    uniqueConcat_(event.pointMembers, event.attendees)
      .forEach(pseudonym => {
        checkReportFor(pseudonym)
       report[pseudonym].events++
      })
  })
  
  //Populate report with relevant meetings.
  meetings.forEach(meeting => {
    meeting.attendees.forEach(attendee => {
      checkReportFor(attendee)
      report[attendee].meetings++
    })
  })
  
  //Populate any active members that are missing.
  activeMembers.forEach(member => checkReportFor(member.pseudonym))
  
  var cellValues = [["Active Member", "Events Attended", "Meetings Attended"]];
  
  for (var key in report) {
    cellValues.push([key, report[key]['events'], report[key]['meetings']])
  }
  
  var columns = cellValues[0].length
  var rows = cellValues.length
    
  var reportRange = reportSheet.getRange(1,1, rows, columns)
  reportRange.setValues(cellValues)
  
  //Format the Report
  reportSheet.autoResizeColumns(1, columns)
  reportSheet.getRange(1, 1, 1, columns)
  .setBorder(true, false, true, false, false, false, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)
  .setFontWeight("bold")
  
  //Set up filter/sorting
  reportRange.createFilter().sort(1, true)
}

function generateDetailedAttendanceReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var ui = SpreadsheetApp.getUi();
  var document = DocumentApp.create('Full Membership Attendance Report')
  var body = document.getBody()
  
  var members = getActiveMembers_(ss)
  var meetings = getReportMeetings_(ss)
  var events = getReportEvents_(ss).sort((a, b) =>  b.date.getTime() - a.date.getTime())
  
  body.appendParagraph('Attendance Report').setHeading(DocumentApp.ParagraphHeading.HEADING1)

  //Generate title page table.
  var headerStyle = {}
  headerStyle[DocumentApp.Attribute.BOLD] = true

  var table = body.appendTable()

  var tr = table.appendTableRow()

  var td = tr.appendTableCell()
  td.setText('Generated:')
  td.setAttributes(headerStyle)

  td = tr.appendTableCell()
  td.setText(new Date().toLocaleString())

  tr = table.appendTableRow()

  td = tr.appendTableCell()
  td.setText('Script Version:')
  td.setAttributes(headerStyle)

  td = tr.appendTableCell()
  td.setText(VERSION)

  //Start rummaging per person.
  members.forEach(member => {
    body.appendPageBreak()

    body.appendParagraph(`${member.pseudonym} Attendance Report`)
      .setHeading(DocumentApp.ParagraphHeading.HEADING1)

    body.appendParagraph('Events Attendance')
      .setHeading(DocumentApp.ParagraphHeading.HEADING2)

    table = body.appendTable()
    tr = table.appendTableRow()
    
    tr.appendTableCell('Date').setAttributes(headerStyle)
    tr.appendTableCell('Event').setAttributes(headerStyle)
    tr.appendTableCell('Venue').setAttributes(headerStyle)

    events.filter(event => {
      return event.attendees.indexOf(member.pseudonym) >= 0 ||
        event.pointMembers.indexOf(member.pseudonym) >= 0
    }).forEach(event => {
      tr = table.appendTableRow()

      tr.appendTableCell(event.date.toDateString())
      tr.appendTableCell(event.eventName)
      tr.appendTableCell(event.venue)
    })

    body.appendParagraph('Meeting Attendance')
      .setHeading(DocumentApp.ParagraphHeading.HEADING2)

    table = body.appendTable()

    tr = table.appendTableRow()
    tr.appendTableCell('Date').setAttributes(headerStyle)
    tr.appendTableCell('Meeting Type').setAttributes(headerStyle)

    meetings
      .filter(meeting => meeting.attendees.indexOf(member.pseudonym) >= 0)
      .forEach(meeting => {
        tr = table.appendTableRow()
        tr.appendTableCell(meeting.date.toDateString())
        tr.appendTableCell(meeting.meetingType)
      })
  })
  
  //Setup the modal.
  var modalContent = HtmlService.createTemplateFromFile('report-ready-modal')
  modalContent.docUrl = document.getUrl()
  modalContent.docName = document.getName()

  //Close the document.
  document.saveAndClose()

  //Show the modal.
  ui.showModalDialog(modalContent.evaluate(), 'Document Ready')
}