# Community SMS Broadcast

This repo is an example application that you can use to broadcast SMS messages to people listed on a Google Spreadsheet, powered by [Twilio Functions](https://www.twilio.com/docs/runtime/functions) and [Twilio Programmable SMS](https://www.twilio.com/docs/sms).

The idea is that a community can put together a spreadsheet that includes names, numbers and other details (like house number) to differentiate themselves. Then community members can then send an SMS message to a Twilio number and have that message broadcast to the rest of the community.

Want to see how to build this application? Check out the blog post [build a community SMS group chat with Twilio Functions and Google Sheets](https://www.twilio.com/blog/community-sms-group-chat-twilio-functions-google-sheets).

* [What you need](#what-you-need)
* [Setting up the app](#setting-up-the-app)
  * [Spreadsheet setup](#spreadsheet-setup)
  * [Google credentials setup](#google-credentials-setup)
  * [Twilio Setup](#twilio-setup)
    * [Twilio Serverless Toolkit](#twilio-serverless-toolkit)
    * [Twilio Functions UI](#twilio-functions-ui)
  * [You're ready](#youre-ready)
* [LICENSE](#license)

## What you need

- [A Twilio Account](https://www.twilio.com/try-twilio)
- [A Google developer account](https://console.developers.google.com/)
- A Google spreadsheet with three columns, headed "Number", "Name", and "House" in that order (you can change this, but you will need to update the code)

## Setting up the app

We need to do a few things to use this app, including preparing credentials to make the spreadsheet accessible from the Twilio Function.

### Spreadsheet setup

- [Create a new Google Spreadsheet](http://sheets.google.com/)
- Give it the column headings "Number", "Name", and "House" in that order
- Enter your community member phone numbers, names and house numbers (or other identifying detail you want to include)

### Google credentials setup

- In the [Google developer console](https://console.developers.google.com/), create a new project.
- Click _Enable API_. Search for and enable the **Google Drive API**
- _Create Credentials_ for a _Web Server_ to access _Application Data_
- Name the service account and grant it a _Project Role_ of _Editor_
- Download the JSON file of credentials and open it up
- Find the "client_email" key in the JSON file and get the email address. Back in your spreadsheet click the _Share_ button and paste the client_email into the share field to give that email address access to the spreadsheet. We'll need these credentials again, so keep them safe

### Twilio Setup

- In your Twilio console [buy a new phone number with SMS capabilities](https://www.twilio.com/console/phone-numbers/search)

You can deploy the Twilio Function for this application two ways, using the [Twilio Serverless Toolkit](#twilio-serverless-toolkit) or the [Twilio Functions UI](#twilio-functions-ui).

#### Twilio Serverless Toolkit

You will need [Node.js installed](https://nodejs.org/en/download/) to perform this method.

- Clone this repo

      git clone https://github.com/philnash/community-sms-broadcast.git

- Change into the directory and install the dependencies

      cd community-sms-broadcast
      npm install

- Copy the `.env.example` file to `.env`

      cp .env.example .env

- Fill in the `.env` file with your Twilio Account Sid and Auth Token (available in your [Twilio Console](https://www.twilio.com/console/))
- Open your Google Spreadsheet and look at the URL bar, it should look like `https://docs.google.com/spreadsheets/d/{GOOGLE_SPREADSHEET_KEY}/edit#gid=0`. Take the string that represents your `GOOGLE_SPREADSHEET_KEY` and enter that into `.env`
- Take the Google credentials JSON file you downloaded earlier and move it into the assets directory. Call it `assets/credentials.private.json`.
- [optional] Open `functions/community-sms-broadcast.protected.js` and update the message assigned to `notOnTheListMessage` (this will be sent to anyone who sends a message to the number that is not on the spreadsheet)

Now you should be ready to deploy.

- Deploy the project to Twilio Functions

      npm run deploy

- This will give you a URL where your function is hosted
- Copy the URL and enter it as the Messaging webhook for the phone number you bought earlier and save the number

#### Twilio Functions UI

- Open the [Twilio Functions admin console](https://www.twilio.com/console/functions/manage)
- Create a new blank Function
- Name the Function "Community SMS Broadcast"
- Give the Function a path, like `/community-sms-broadcast`
- Check the _Access Control_ checkbox
- Replace the code with the contents of `functions/community-sms-broadcast.protected.js` from this repo
- [optional] In the code, update the message assigned to `notOnTheListMessage` (this will be sent to anyone who sends a message to the number that is not on the spreadsheet)
- Save the Function
- Open the [Twilio Functions Configuration console](https://www.twilio.com/console/functions/configure)
- Check the box that says _Enable ACCOUNT_SID and AUTH_TOKEN_
- From the Google credentials JSON file, find the client_email and private_key fields and add them as environment variables called `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY`
- Take the Google credentials JSON file you downloaded earlier and upload it as a private asset called `credentials.json`.
- Open your Google Spreadsheet and look at the URL bar, it should look like `https://docs.google.com/spreadsheets/d/{GOOGLE_SPREADSHEET_KEY}/edit#gid=0`. Take the string that represents your `GOOGLE_SPREADSHEET_KEY` and enter that as an environment variable called `GOOGLE_SPREADSHEET_KEY`
- In dependencies, enter `google-spreadsheet` with the version `3.0.10`
- Save the configuration
- Open your function again and find the full URL and path
- Copy the URL and enter it as the Messaging webhook for the phone number you bought earlier and save the number

### You're ready

Send a text message to the Twilio number. It will be broadcast out to the other numbers on your spreadsheet (you might want to test this with just a couple of numbers first).

## LICENSE

MIT © Phil Nash
