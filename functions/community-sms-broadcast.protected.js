const { GoogleSpreadsheet } = require("google-spreadsheet");
const fs = require("fs");
const credentials = JSON.parse(
  fs.readFileSync(Runtime.getAssets()["/credentials.json"].path, "utf8")
);

const notOnTheListMessage =
  "You're not currently on this community list. Please contact the community organiser to be added.";

exports.handler = async function (context, event, callback) {
  const twiml = new Twilio.twiml.MessagingResponse();
  const doc = new GoogleSpreadsheet(context.GOOGLE_SPREADSHEET_KEY);
  await doc.useServiceAccountAuth(credentials);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const from = rows.find((row) => row.Number === event.From);
  if (from) {
    rows
      .filter((row) => row.Number !== event.From)
      .forEach((row) => {
        twiml.message(
          `From: ${from.Name} (${from.House}).\nBody: ${event.Body}`,
          {
            to: row.Number,
          }
        );
      });
  } else {
    twiml.message(notOnTheListMessage);
  }
  callback(null, twiml);
};
