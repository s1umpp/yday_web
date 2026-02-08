# yday Complete Setup Guide

This guide walks you through setting up:
1. Google Workspace (for email)
2. DNS configuration (connecting yday.ai)
3. GitHub Pages deployment
4. Email ingestion with Apps Script

---

## Part 1: Google Workspace Setup (~10 minutes, $6/month)

Google Workspace gives you:
- Custom email (scan@yday.ai, hello@yday.ai)
- Google Apps Script for email automation
- Professional email delivery

### Step 1: Sign up for Google Workspace

1. Go to: https://workspace.google.com/
2. Click "Get Started"
3. Choose the **Business Starter** plan ($6/user/month)
4. Enter your business info:
   - Business name: `yday`
   - Number of employees: `Just you`
5. When asked for domain: **"I have a domain I can use"**
6. Enter: `yday.ai`

### Step 2: Verify Domain Ownership

Google will ask you to verify you own yday.ai. Choose **"Add a TXT record"**:

1. Log into GoDaddy: https://dcc.godaddy.com/
2. Go to: My Products → Domains → yday.ai → DNS
3. Add a TXT record:
   - **Type**: TXT
   - **Name**: @ (or leave blank)
   - **Value**: (Google will give you a long string starting with `google-site-verification=...`)
   - **TTL**: 1 hour
4. Click Save
5. Back in Google Workspace, click "Verify"
   - Note: DNS can take 5-60 minutes to propagate

### Step 3: Set Up MX Records (for email)

After verification, Google will show you MX records to add. In GoDaddy DNS:

| Type | Name | Priority | Value |
|------|------|----------|-------|
| MX | @ | 1 | ASPMX.L.GOOGLE.COM |
| MX | @ | 5 | ALT1.ASPMX.L.GOOGLE.COM |
| MX | @ | 5 | ALT2.ASPMX.L.GOOGLE.COM |
| MX | @ | 10 | ALT3.ASPMX.L.GOOGLE.COM |
| MX | @ | 10 | ALT4.ASPMX.L.GOOGLE.COM |

### Step 4: Create Your Admin Account

1. Create your first user (this will be admin):
   - Suggested: `joshua@yday.ai` or `hello@yday.ai`
2. This account can create aliases and other accounts

### Step 5: Create Email Aliases

In Google Admin Console (admin.google.com):

1. Go to: Directory → Users → Your user
2. Click "User information"
3. Under "Alternate emails", add:
   - `scan@yday.ai` (for record scanning)
   - `hello@yday.ai` (for general contact)

---

## Part 2: DNS for Website (GitHub Pages)

While in GoDaddy DNS, add these records for the website:

### A Records (for apex domain yday.ai)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 1 hour |
| A | @ | 185.199.109.153 | 1 hour |
| A | @ | 185.199.110.153 | 1 hour |
| A | @ | 185.199.111.153 | 1 hour |

### CNAME Record (for www.yday.ai)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | s1umpp.github.io | 1 hour |

---

## Part 3: Deploy Website to GitHub Pages

### Step 1: Build and Deploy

```bash
cd /Users/joshua/projects/yday_web_temp/web
npm install
npm run deploy
```

This creates a `gh-pages` branch with the built site.

### Step 2: Configure GitHub Pages

1. Go to: https://github.com/s1umpp/yday_web/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **(root)**
4. Click Save
5. Custom domain: Enter `www.yday.ai`
6. Check **Enforce HTTPS** (may take a few minutes to be available)

### Step 3: Wait for DNS Propagation

- DNS changes can take 5-60 minutes
- Check status at: https://dnschecker.org/#A/yday.ai

---

## Part 4: Email Ingestion (Google Apps Script)

Once Google Workspace is set up and you can receive email at scan@yday.ai:

### Step 1: Create the Apps Script

1. Go to: https://script.google.com/
2. Sign in with your yday.ai Google account
3. Click "New project"
4. Name it: "yday Email Scanner"

### Step 2: Add the Script

Replace the code with:

```javascript
// yday Email Scanner - Google Apps Script
// Watches scan@yday.ai for incoming record photos

const BACKEND_URL = 'https://yday-ios-backend-cee9m.ondigitalocean.app';
const LABEL_PROCESSED = 'Processed';
const LABEL_ERROR = 'Error';

function processNewEmails() {
  // Get unread emails in inbox
  const threads = GmailApp.search('is:unread has:attachment');
  
  threads.forEach(thread => {
    const messages = thread.getMessages();
    
    messages.forEach(message => {
      if (message.isUnread()) {
        try {
          processMessage(message);
          message.markRead();
          thread.addLabel(getOrCreateLabel(LABEL_PROCESSED));
        } catch (error) {
          console.error('Error processing message:', error);
          thread.addLabel(getOrCreateLabel(LABEL_ERROR));
        }
      }
    });
  });
}

function processMessage(message) {
  const senderEmail = message.getFrom();
  const attachments = message.getAttachments();
  
  // Find image attachments
  const imageAttachments = attachments.filter(att => 
    att.getContentType().startsWith('image/')
  );
  
  if (imageAttachments.length === 0) {
    // No images, send helpful reply
    sendReply(message, null, 'NO_IMAGE');
    return;
  }
  
  // Process first image
  const image = imageAttachments[0];
  const imageBlob = image.copyBlob();
  const base64Image = Utilities.base64Encode(imageBlob.getBytes());
  
  // Call yday backend
  const result = callYdayBackend(senderEmail, base64Image, image.getContentType());
  
  // Send reply with result
  sendReply(message, result, result ? 'SUCCESS' : 'NOT_FOUND');
}

function callYdayBackend(email, base64Image, contentType) {
  try {
    const response = UrlFetchApp.fetch(`${BACKEND_URL}/api/scan/email`, {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify({
        email: email,
        image: base64Image,
        content_type: contentType
      }),
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      return JSON.parse(response.getContentText());
    }
    return null;
  } catch (error) {
    console.error('Backend call failed:', error);
    return null;
  }
}

function sendReply(originalMessage, result, status) {
  let subject = 'Re: ' + originalMessage.getSubject();
  let body = '';
  
  switch (status) {
    case 'SUCCESS':
      const album = result.matches?.[0] || result;
      body = `Hey there! 🎵

We found your record:

📀 ${album.title || 'Unknown Title'}
🎤 ${album.artist || 'Unknown Artist'}
📅 ${album.year || 'Unknown Year'}
${album.label ? '🏷️ ' + album.label : ''}

Want to add this to your collection? Download the yday app:
📱 https://testflight.apple.com/join/YOUR_TESTFLIGHT_ID

Happy collecting!
- yday`;
      break;
      
    case 'NOT_FOUND':
      body = `Hey there! 🎵

We couldn't identify that record from the photo. This can happen if:
- The image is blurry or too dark
- It's a very rare pressing
- The photo doesn't show enough of the cover

Try sending another photo with better lighting, or showing more of the album artwork.

Want to try our full scanner? Download the yday app:
📱 https://testflight.apple.com/join/YOUR_TESTFLIGHT_ID

Happy collecting!
- yday`;
      break;
      
    case 'NO_IMAGE':
      body = `Hey there! 🎵

We didn't see an image attachment in your email. 

To scan a record, just attach a photo of the album cover, spine, or label and we'll identify it for you!

Happy collecting!
- yday`;
      break;
  }
  
  originalMessage.reply(body);
}

function getOrCreateLabel(name) {
  let label = GmailApp.getUserLabelByName(name);
  if (!label) {
    label = GmailApp.createLabel(name);
  }
  return label;
}

// Set up a trigger to run every minute
function createTrigger() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create new trigger - runs every minute
  ScriptApp.newTrigger('processNewEmails')
    .timeBased()
    .everyMinutes(1)
    .create();
    
  console.log('Trigger created! The script will check for new emails every minute.');
}
```

### Step 3: Set Up the Trigger

1. In the script editor, run `createTrigger()` function
2. Authorize the script when prompted (allow Gmail access)

### Step 4: Add Backend Endpoint

You'll need to add a `/api/scan/email` endpoint to your backend. I'll create this next.

---

## Summary Checklist

- [ ] Sign up for Google Workspace ($6/month)
- [ ] Verify domain ownership (TXT record)
- [ ] Add MX records for email
- [ ] Add A records for website
- [ ] Add CNAME record for www
- [ ] Deploy website: `npm run deploy`
- [ ] Configure GitHub Pages
- [ ] Create Apps Script for email
- [ ] Add backend endpoint for email scanning

---

## Estimated Costs

| Service | Cost |
|---------|------|
| Google Workspace | $6/month |
| GitHub Pages | Free |
| DigitalOcean (existing backend) | ~$5-12/month |
| GoDaddy domain | ~$12/year |
| **Total** | ~$12-19/month |

---

## Need Help?

If you get stuck on any step, let me know and I can help troubleshoot!

