# yday Complete Setup Guide

This guide walks you through setting up:
1. Mailgun (for email webhooks - FREE)
2. DNS configuration (connecting yday.ai)
3. GitHub Pages deployment
4. Email ingestion webhook

---

## Part 1: Mailgun Setup (~10 minutes, FREE)

Mailgun gives you:
- Email receiving for `scan@yday.ai`
- Webhooks to trigger your backend
- Email forwarding to ProtonMail
- **Free tier: 100 emails/day (3,000/month)**

### Step 1: Sign up for Mailgun

1. Go to: https://www.mailgun.com/
2. Click "Sign Up" (use the free tier)
3. Create account with your email
4. Verify your email address

### Step 2: Add Your Domain

1. In Mailgun dashboard, go to: **Sending** → **Domains**
2. Click **Add New Domain**
3. Enter: `yday.ai`
4. Select: **US** (or EU if you prefer)
5. Click **Add Domain**

### Step 3: Verify Domain Ownership

Mailgun will show you DNS records to add. You'll need to add these in GoDaddy:

#### TXT Record (for verification)
| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | @ | (Mailgun provides this - starts with `v=spf1`) | 1 hour |

#### MX Records (for receiving emails)
| Type | Name | Priority | Value | TTL |
|------|------|----------|-------|-----|
| MX | @ | 10 | mxa.mailgun.org | 1 hour |
| MX | @ | 10 | mxb.mailgun.org | 1 hour |

#### TXT Record (for SPF)
| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | @ | (Mailgun provides SPF record) | 1 hour |

#### CNAME Record (for tracking - optional)
| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | email | mailgun.org | 1 hour |

**Note**: Mailgun will show you the exact values. Copy them from the Mailgun dashboard.

### Step 4: Wait for Verification

1. After adding DNS records, go back to Mailgun
2. Click **Verify DNS Settings**
3. Wait 5-60 minutes for DNS propagation
4. Once verified, you'll see green checkmarks

### Step 5: Set Up Inbound Route

1. In Mailgun dashboard, go to: **Receiving** → **Routes**
2. Click **Create Route**
3. Configure:
   - **Filter**: `match_recipient("scan@yday.ai")`
   - **Action 1**: **Forward** → Enter your ProtonMail email (e.g., `your-email@proton.me`)
   - **Action 2**: **Store** (optional - stores in Mailgun)
   - **Action 3**: **Notify** → Enter webhook URL: `https://yday-ios-backend-cee9m.ondigitalocean.app/api/scan/email-webhook`
4. Click **Create Route**

### Step 6: Get Your API Key

1. In Mailgun dashboard, go to: **Settings** → **API Keys**
2. Copy your **Private API Key** (starts with `key-...`)
3. Save this - you'll need it for sending replies

---

## Part 2: DNS for Website (GitHub Pages)

While in GoDaddy DNS, also add these records for the website:

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

**Important**: Don't remove the Mailgun MX records! You need both:
- MX records for email (Mailgun)
- A/CNAME records for website (GitHub Pages)

---

## Part 3: Deploy Website to GitHub Pages

### Step 1: Build and Deploy
ash
cd /Users/joshua/projects/yday_web_temp/web
npm install
npm run deployThis creates a `gh-pages` branch with the built site.

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

## Part 4: Add Webhook Endpoint to Backend

The webhook endpoint code goes in your Flask backend. See the code section below.

### Step 1: Add Environment Variable

In your DigitalOcean App Platform environment variables, add:
- `MAILGUN_API_KEY` = (your Mailgun private API key)
- `MAILGUN_DOMAIN` = `yday.ai`

### Step 2: Add the Webhook Code

Add the webhook endpoint to your backend (see code below).

### Step 3: Test the Webhook

1. Send a test email to `scan@yday.ai` with an image attachment
2. Check your backend logs to see if the webhook was received
3. Check your ProtonMail to see if the email was forwarded
4. You should receive a reply with the scan results

---

## Summary Checklist

- [ ] Sign up for Mailgun (free tier)
- [ ] Add domain `yday.ai` to Mailgun
- [ ] Add DNS records (TXT, MX) in GoDaddy
- [ ] Verify domain in Mailgun
- [ ] Create inbound route (forward to ProtonMail + webhook)
- [ ] Add A records for website
- [ ] Add CNAME record for www
- [ ] Deploy website: `npm run deploy`
- [ ] Configure GitHub Pages
- [ ] Add webhook endpoint to backend
- [ ] Add Mailgun API key to environment variables
- [ ] Test by emailing scan@yday.ai

---

## Estimated Costs

| Service | Cost |
|---------|------|
| Mailgun | **FREE** (100 emails/day) |
| GitHub Pages | Free |
| DigitalOcean (existing backend) | ~$5-12/month |
| GoDaddy domain | ~$12/year |
| ProtonMail Duo (you already have) | Already paying |
| **Total** | **~$5-12/month** (just your existing backend) |

---

## Need Help?

If you get stuck on any step, let me know and I can help troubleshoot!
