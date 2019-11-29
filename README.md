# sfspi-gsuite-apps
## The Final Destination of All Record Keeping: A Freaking Spreadsheet

If you're some sort of Github stalker you might have noticed the Rails App 
`sfspi-intranet` or the incomplete Firebase+Angular app, `sfspi-portal`.

Both of these were wonderful experiences in automating and attempting to
create a records management system for the South Florida Sisters of Perpetual
Indulgence.  At then end of the day, I still found that I kept reinventing
various wheels for maintaing our records.

When we migrated from Office365 I discovered the much easier and straightforward
scripting in Google Apps vs Office365.  While all this was possible in O365,
it was many more steps and most of all, writing your own add-in was much more
perilous than open tab, add menu to UI, and start coding.  By the time I got 
done fighthing a literal war with Excel's Add-In infrastructure, I might as
well just keep working on the Rails app.

I quickly migrated from the browser editor to a local TypeScript. The
Add On is still currently tied to the particular Google Spreadsheet that 
hosts our house records, but at least now people can do their own maintenance
on the data and access to the Sheet can be easily administrated through normal
drive controls.  This means if some day I leave the organization, someone else
can pick up without being lost in figuring out how to log into Airtable or
query a Postgres database or update a Ruby on Rails application.

Which at the end of the day, is what we all should be thinking when we pick a
technology stack in non-programmer organizations: Can someone come after me
and manage this?
