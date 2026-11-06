/**
 * DEVLYON public reviews backend.
 * Create a Google Sheet, open Extensions > Apps Script, paste this file,
 * then deploy as a Web app (Execute as: Me; access: Anyone).
 * The first run creates the Reviews sheet and its headings.
 * To remove a review, delete its row from the Reviews sheet.
 */
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Reviews');
  if (!sheet) sheet = ss.insertSheet('Reviews');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Rating', 'Review']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function output_(data, callback) {
  var json = JSON.stringify(data);
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = getSheet_();
  var rows = sheet.getLastRow() > 1
    ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues()
    : [];
  var reviews = rows.filter(function(row) {
    return row[1] && row[2] && row[3];
  }).map(function(row) {
    return {
      date: Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), 'MMM d, yyyy'),
      name: String(row[1]),
      rating: Number(row[2]),
      review: String(row[3])
    };
  });
  return output_({ reviews: reviews, count: reviews.length }, e && e.parameter && e.parameter.callback);
}

function doPost(e) {
  var p = (e && e.parameter) || {};
  var name = String(p.name || '').trim().replace(/[<>]/g, '');
  var review = String(p.review || '').trim().replace(/[<>]/g, '');
  var rating = Number(p.rating);
  if (p.website) return HtmlService.createHtmlOutput('Submission received.');
  if (!name || name.length > 60 || !review || review.length > 800 || rating < 1 || rating > 5 || Math.floor(rating) !== rating) {
    return HtmlService.createHtmlOutput('Please check your review details and try again.');
  }
  var sheet = getSheet_();
  sheet.appendRow([new Date(), name, rating, review]);
  return HtmlService.createHtmlOutput('<!doctype html><html><body><p>Review submitted.</p></body></html>');
}
