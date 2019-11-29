export function commaSplit(list: string): string[] {
  return list ? list.split(/, */) : []
}

export function getSettings_(settingName: string): string | number {
  return SpreadsheetApp.getActiveSpreadsheet()
  .getSheetByName('Settings')
  .getRange('A2:B10')
  .getValues()
  .filter(function(row) {
    return row && row[0] === settingName 
  })
  .map(function(row) {
    return row[1]
  })[0]
}

export function uniqueConcat_(a: any[], b: any[]): any[] {
  return a.concat(b.filter(c => a.indexOf(c) < 0))
}

export function logToSheet_(activeSpreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): void {
  var logSheet = activeSpreadsheet.getSheetByName('Logs')
  if(logSheet) {
    activeSpreadsheet.deleteSheet(logSheet)
  }
  
  logSheet = activeSpreadsheet.insertSheet('Logs', 100)
  
  logSheet.getRange("A1").setValue(Logger.getLog())
}