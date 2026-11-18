/*
 December demo round: Cal.com webhook -> Bookings tab of this sheet.
 Deployed as a web app (Execute as: Me, Who has access: Anyone).
 In Cal.com, each demo event (free-body-demo, free-body-demo-es) has a webhook
 to the web app URL for Booking created, rescheduled and cancelled.
 Only the calendar columns (A to K) are written here. The team columns are never touched.
*/
var EVENTS = ["free-body-demo", "free-body-demo-es"];
var TZ = "America/New_York";
var SOURCE = "Sarah's Ads";
var C = { id: 1, start: 2, status: 3, bookedAt: 11, total: 22 };

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    return out_(handle_(body));
  } catch (err) {
    log_(["error", "", "", "", "", String(err)]);
    return out_("error");
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return out_("ok");
}

function handle_(body) {
  var trig = String(body.triggerEvent || "");
  var p = body.payload || {};
  if (trig === "PING") { log_([trig, "", "", "", "", "ping ok"]); return "pong"; }
  var slug = String(p.type || p.eventTypeSlug || "");
  if (EVENTS.indexOf(slug) < 0) { log_([trig, p.uid || "", slug, "", "", "skipped, other event"]); return "skipped"; }

  var sh = SpreadsheetApp.getActive().getSheetByName("Bookings");
  var att = (p.attendees && p.attendees[0]) || {};
  var name = att.name || val_(p.responses, "name") || "";
  var email = att.email || val_(p.responses, "email") || "";
  var phone = fmtPhone_(findPhone_(p, att));
  var lang = /-es$/.test(slug) ? "ES" : "EN";
  var start = new Date(p.startTime);
  var okStart = !isNaN(start.getTime());
  var day = okStart ? Utilities.formatDate(start, TZ, "EEE M/d") : "";
  var time = okStart ? Utilities.formatDate(start, TZ, "h:mm a") : "";
  var uid = String(p.uid || "");
  var oldUid = String(p.rescheduleUid || p.fromReschedule || p.rescheduledFromUid || p.originalRescheduledBooking && p.originalRescheduledBooking.uid || "");

  var row = findRow_(sh, uid) || (oldUid ? findRow_(sh, oldUid) : 0);
  var result;

  if (trig === "BOOKING_CANCELLED" || trig === "BOOKING_REJECTED") {
    if (!row) row = findByEmail_(sh, email, day);
    if (row) { sh.getRange(row, C.status).setValue("Cancelled"); result = "cancelled row " + row; }
    else result = "cancel, no row found";
  } else if (trig === "BOOKING_CREATED" || trig === "BOOKING_RESCHEDULED" || trig === "BOOKING_REQUESTED") {
    if (!row && trig === "BOOKING_RESCHEDULED") row = findByEmail_(sh, email, "");
    var status = trig === "BOOKING_RESCHEDULED" ? "Rescheduled" : "Booked";
    var vals = [uid, okStart ? start : "", status, day, time, name, phone, email, lang, SOURCE, Utilities.formatDate(new Date(), TZ, "M/d h:mm a")];
    if (row) {
      var kept = sh.getRange(row, C.bookedAt).getValue();
      if (kept) vals[10] = kept;
      sh.getRange(row, 1, 1, 11).setValues([vals]);
      result = (status === "Rescheduled" ? "moved" : "updated") + " row " + row;
    } else {
      sh.appendRow(vals);
      row = sh.getLastRow();
      sh.getRange(row, C.total).setFormula('=IF(AND(INDEX(T:T,ROW())="",INDEX(U:U,ROW())=""),"",N(INDEX(T:T,ROW()))+N(INDEX(U:U,ROW())))');
      result = "added row " + row;
    }
    sortRows_(sh);
  } else {
    result = "ignored";
  }
  log_([trig, uid, slug, name, okStart ? day + " " + time : "", result]);
  return result;
}

function val_(responses, key) {
  if (!responses || !responses[key]) return "";
  var v = responses[key];
  return typeof v === "object" ? (v.value || "") : String(v);
}

function findPhone_(p, att) {
  if (att.phoneNumber) return att.phoneNumber;
  var r = p.responses || {};
  var keys = ["attendeePhoneNumber", "phone", "Phone", "phoneNumber"];
  for (var i = 0; i < keys.length; i++) { var v = val_(r, keys[i]); if (v) return v; }
  for (var k in r) {
    var x = val_(r, k);
    if (typeof x === "string" && /^\+?[\d\s().-]{10,}$/.test(x)) return x;
  }
  return p.smsReminderNumber || "";
}

function fmtPhone_(s) {
  var d = String(s || "").replace(/\D/g, "");
  if (d.length === 11 && d.charAt(0) === "1") d = d.slice(1);
  if (d.length === 10) return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
  return String(s || "");
}

function findRow_(sh, uid) {
  if (!uid || sh.getLastRow() < 2) return 0;
  var hit = sh.getRange(2, C.id, sh.getLastRow() - 1, 1).createTextFinder(uid).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

function findByEmail_(sh, email, day) {
  if (!email || sh.getLastRow() < 2) return 0;
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, 8).getValues();
  for (var i = v.length - 1; i >= 0; i--) {
    if (String(v[i][7]).toLowerCase() === email.toLowerCase() && v[i][2] !== "Cancelled" && (!day || v[i][3] === day)) return i + 2;
  }
  return 0;
}

function sortRows_(sh) {
  var n = sh.getLastRow() - 1;
  if (n > 1) sh.getRange(2, 1, n, sh.getLastColumn()).sort({ column: C.start, ascending: true });
}

function log_(cells) {
  var lg = SpreadsheetApp.getActive().getSheetByName("Log");
  if (lg) lg.appendRow([Utilities.formatDate(new Date(), TZ, "M/d h:mm:ss a")].concat(cells));
}

function out_(msg) {
  return ContentService.createTextOutput(String(msg)).setMimeType(ContentService.MimeType.TEXT);
}

/* Run this once from the editor to check the script without Cal.com: it adds a TEST row, moves it, cancels it, then deletes it. */
function selfTest() {
  var t = "test-" + new Date().getTime();
  var base = { type: "free-body-demo", uid: t, startTime: "2026-12-10T15:00:00.000Z", attendees: [{ name: "TEST Person", email: "test@example.com" }], responses: { attendeePhoneNumber: { value: "+13055550100" } } };
  Logger.log(handle_({ triggerEvent: "BOOKING_CREATED", payload: base }));
  var moved = JSON.parse(JSON.stringify(base)); moved.uid = t + "b"; moved.rescheduleUid = t; moved.startTime = "2026-12-11T16:30:00.000Z";
  Logger.log(handle_({ triggerEvent: "BOOKING_RESCHEDULED", payload: moved }));
  Logger.log(handle_({ triggerEvent: "BOOKING_CANCELLED", payload: moved }));
  var sh = SpreadsheetApp.getActive().getSheetByName("Bookings");
  var r = findRow_(sh, t + "b");
  if (r) sh.deleteRow(r);
  Logger.log("test row removed: " + (r ? "yes" : "no row"));
}
