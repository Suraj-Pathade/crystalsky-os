# CrystalSky OS - Google Sheets & Google Calendar Integration Setup Guide

**Owner:** Suraj Pathade (Phone / WhatsApp: 9922639066)  
**System:** CrystalSky OS (Photography & Film Business Management System)

---

## Step 1: Open / Create Google Spreadsheet
1. Go to [Google Sheets](https://sheets.new) in your browser.
2. Create a new blank Google Spreadsheet named: `CrystalSky Photography OS Database`.

---

## Step 2: Paste Google Apps Script Code (`Code.gs`)
1. In your Google Spreadsheet menu, click **Extensions** > **Apps Script**.
2. Delete any default code in `Code.gs`.
3. Open [`google-apps-script/Code.gs`](file:///C:/Users/patha/.gemini/antigravity/scratch/crystalsky-os/google-apps-script/Code.gs) from this project repository and copy **all** code.
4. Paste the code into your Apps Script editor and click **Save** (💾 icon).

---

## Step 3: Deploy Apps Script as Web App
1. Click **Deploy** > **New Deployment** (top right corner).
2. Click the gear icon ⚙️ next to "Select type" and choose **Web App**.
3. Fill out the fields:
   - **Description**: `CrystalSky OS Production API v1.0`
   - **Execute as**: `Me (your Google email)`
   - **Who has access**: `Anyone` *(Crucial so your React application can communicate with Google Sheets)*
4. Click **Deploy**.
5. Grant necessary Google permissions when prompted.
6. **Copy the Web App URL** (e.g. `https://script.google.com/macros/s/AKfycbx.../exec`).

---

## Step 4: Connect Web App URL in CrystalSky OS
1. Open your **CrystalSky OS** web app.
2. Go to **Settings & Sync** (or launch **Setup Wizard**).
3. Paste your copied **Google Apps Script Web App URL** into the input field.
4. Click **Test Connection** — you will see a green `SUCCESS!` badge.
5. Click **Create 14 Sheet Tabs** — Apps Script will instantly build all 14 required tabs with dark gold headers:
   - `Settings`
   - `Clients`
   - `Events`
   - `EventFunctions`
   - `Payments`
   - `Expenses`
   - `Team`
   - `EventTeam`
   - `Tasks`
   - `Deliverables`
   - `Notifications`
   - `CalendarEvents`
   - `Reports`
   - `AuditLog`

---

## Step 5: Google Calendar Integration
1. When you create any shoot booking in CrystalSky OS, click **"Google Calendar Sync"** or **"Export .ICS"**.
2. It automatically populates the shoot title `📸 [Event Name] — CrystalSky`, venue location, map links, and payment status directly into your Google Calendar without creating duplicate entries.

---

## Step 6: WhatsApp Click-to-Chat Integration
1. Click **"Send WhatsApp Reminder"** or **"WhatsApp Receipt"** anywhere in the system.
2. CrystalSky OS automatically formats the phone number with India prefix `+91` and generates pre-filled professional messages.
3. Review or edit the message, click **Send**, and WhatsApp opens directly on your phone or PC!
