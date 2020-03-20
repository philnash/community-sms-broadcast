const { GoogleSpreadsheet } = require("google-spreadsheet");

const notOnTheListMessage =
  "You're not currently on this community list. Please contact the community organiser to be added.";

exports.handler = async function(context, event, callback) {
  const doc = new GoogleSpreadsheet(context.GOOGLE_SPREADSHEET_KEY);
  await doc.useServiceAccountAuth({
    client_email: context.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: context.GOOGLE_PRIVATE_KEY
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const twiml = new Twilio.twiml.MessagingResponse();
  const from = rows.filter(row => row.Number === event.From)[0];
  if (from) {
    rows
      .filter(row => row.Number !== event.From)
      .forEach(row => {
        twiml.message(
          `From: ${row.Name} (${row.House}).\nBody: ${event.Body}`,
          {
            to: row.Number
          }
        );
      });
  } else {
    twiml.message(notOnTheListMessage);
  }
  callback(null, twiml);
};
