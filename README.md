# wordle-sms
Use Wordle from your text messages without internet access, either from a smartphone or dumbphone!

## Setup
1. You will need a [Twilio](https://www.twilio.com/en-us) account (the free trial works)
2. Make a .env file with your `ACCOUNT_SID` and `AUTH_TOKEN`
3. `npm run deploy`
4. On your Twilio console, make sure you have [an active phone number](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)
5. Configure this phone number to call the `wordle-sms/wordle` function when a message comes in
6. (Optional) If using the trial version, don't forget to add your phone number to the list of whitelisted numbers
