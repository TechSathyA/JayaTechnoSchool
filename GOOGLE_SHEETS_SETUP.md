# Google Sheets And Email Setup

This project is ready to send enquiry form submissions to **Google Sheets** and optionally notify your school by **email**.

## Step 1: Create a Google Sheet

Create a spreadsheet for admissions enquiries and keep it open.

## Step 2: Open Apps Script

From the Google Sheet:

1. Click `Extensions`
2. Click `Apps Script`

## Step 3: Paste the backend code

Replace the default script with the contents of:

- `google-apps-script/Code.gs`

Then update these values inside the script:

- `spreadsheetId`
- `sheetName`
- `notificationEmail`
- `schoolName`

## Step 4: Deploy the script

1. Click `Deploy`
2. Click `New deployment`
3. Choose `Web app`
4. Set `Execute as` to `Me`
5. Set `Who has access` to `Anyone`
6. Click `Deploy`

Copy the Web App URL after deployment.

## Step 5: Add the Web App URL to the website

Open:

- `jaya-techno-school-demo/js/site-config.js`

Update:

```js
googleAppsScriptUrl: 'PASTE_YOUR_WEB_APP_URL_HERE'
```

## Step 6: Update school details

In the same file, fill in your real values for:

- School name
- Branch/location
- Phone
- Email
- Address
- Office hours
- WhatsApp number
- Academic year

## What happens after setup

- Form submissions are stored in Google Sheets
- Email alerts are sent to the configured email address
- The website stops showing the demo-only form message and starts using the live endpoint
