# yday Complete Setup Guide

This guide walks you through setting up:
1. **Dedicated Droplet for ProtonMail Bridge** (separate from backend - $4/month)
2. ProtonMail Bridge installation and configuration
3. DNS configuration (connecting yday.ai)
4. GitHub Pages deployment
5. Email ingestion with IMAP polling

---

## Part 1: Create Dedicated Droplet for ProtonMail Bridge

**Important**: ProtonMail Bridge runs on a separate Droplet, not on your backend server. This is because:
- Bridge needs full system access
- Your backend is on DigitalOcean App Platform (containerized)
- Bridge listens on localhost only, so we need a proxy

### Step 1: Create a New Droplet

1. Go to DigitalOcean → Create → Droplets
2. Choose:
   - **Basic plan**: $4/month (512MB RAM is enough)
   - **Region**: Same as your backend (for low latency)
   - **Image**: Ubuntu 22.04 (LTS)
   - **Authentication**: Add your SSH key
3. Create the Droplet
4. Note the **Private IP address** (you'll need this later)

### Step 2: SSH into the Droplet

```bash
# SSH into your Droplet (use the public IP)
ssh root@YOUR_DROPLET_IP

# Or if you have a custom key:
ssh -i ~/.ssh/your-key root@YOUR_DROPLET_IP
```

---

## Part 2: Install ProtonMail Bridge on Droplet

### Step 1: Install ProtonMail Bridge

**On your Droplet:**

```bash
# Add ProtonMail's repository
echo "deb [signed-by=/usr/share/keyrings/protonmail-bridge.gpg] https://repo.protonmail.ch/protonmail-bridge stable main" | sudo tee /etc/apt/sources.list.d/protonmail-bridge.list

# Add GPG key (use apt-key method - more reliable)
wget -qO - https://repo.protonmail.ch/protonmail-bridge.gpg | sudo apt-key add -

# Update and install
sudo apt update
sudo apt install protonmail-bridge -y
```

### Step 2: Set Up Password Manager (pass)

Bridge requires a password manager. We'll use `pass`:

```bash
# Install pass
sudo apt install pass -y

# Generate GPG key for pass
gpg --gen-key
# When prompted:
# - Real name: your-name
# - Email: scan@yday.ai (or your email)
# - Type: O (Okay)
# - Enter a passphrase (remember this)

# Get your GPG key ID
gpg --list-keys
# Copy the key ID (long string after "pub")

# Initialize pass with your key ID
pass init YOUR_KEY_ID
# Example: pass init 9F70CDEE355865642117C88B1B4DD636CBC980B0
```

### Step 3: Log into Bridge and Get Credentials

```bash
# Start Bridge CLI
protonmail-bridge --cli
```

At the `>>>` prompt:

```bash
# Log in to your ProtonMail account
login
# Enter: scan@yday.ai (or your ProtonMail email)
# Enter: Your ProtonMail password
# Enter: 2FA code if enabled

# Wait for sync to complete, then get credentials
info
```

**Save these credentials** - you'll need them:
- IMAP: `127.0.0.1:1143`
- SMTP: `127.0.0.1:1025`
- Username: `your-email@pm.me` (or your ProtonMail email)
- Password: `[long-generated-password]`

Exit Bridge CLI: `exit`

### Step 4: Configure Bridge as Systemd Service

```bash
# Create service file
sudo nano /etc/systemd/system/protonmail-bridge.service
```

Add:

```ini
[Unit]
Description=ProtonMail Bridge
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/protonmail-bridge --noninteractive
Restart=always
RestartSec=10
Environment="GPG_TTY=/dev/console"
Environment="PASSWORD_STORE_DIR=/root/.password-store"

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable protonmail-bridge
sudo systemctl start protonmail-bridge
sudo systemctl status protonmail-bridge  # Verify it's running
```

### Step 5: Set Up TCP Proxy (Make Bridge Accessible from Network)

Bridge only listens on `127.0.0.1` (localhost). We need a proxy to make it accessible from your backend.

**Install socat:**

```bash
sudo apt install socat -y
```

**Create proxy script:**

```bash
sudo nano /usr/local/bin/bridge-proxy.sh
```

Add:

```bash
#!/bin/bash
# Start socat proxies for ProtonMail Bridge

# Proxy IMAP (port 1143)
socat TCP-LISTEN:1143,bind=0.0.0.0,reuseaddr,fork TCP:127.0.0.1:1143 &

# Proxy SMTP (port 1025)
socat TCP-LISTEN:1025,bind=0.0.0.0,reuseaddr,fork TCP:127.0.0.1:1025 &

# Wait for both processes
wait
```

Make executable:

```bash
sudo chmod +x /usr/local/bin/bridge-proxy.sh
```

**Create proxy service:**

```bash
sudo nano /etc/systemd/system/bridge-proxy.service
```

Add:

```ini
[Unit]
Description=ProtonMail Bridge TCP Proxy
After=protonmail-bridge.service network.target
Requires=protonmail-bridge.service

[Service]
Type=simple
ExecStart=/usr/local/bin/bridge-proxy.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable bridge-proxy
sudo systemctl start bridge-proxy
sudo systemctl status bridge-proxy  # Verify it's running
```

**Verify ports are listening on all interfaces:**

```bash
ss -tlnp | grep -E '1143|1025'
```

You should see:
```
LISTEN ... 0.0.0.0:1143 ...
LISTEN ... 0.0.0.0:1025 ...
```

### Step 6: Get Your Droplet's Private IP

```bash
# Get private IP address
ip addr show | grep "inet " | grep -v 127.0.0.1
```

Look for `10.x.x.x` or `172.x.x.x` - **save this IP address**.

---

## Part 3: Add Environment Variables to DigitalOcean App Platform

**Important**: Use your **Droplet's private IP**, not `127.0.0.1`!

1. Go to: DigitalOcean → Apps → Your Backend App → Settings → App-Level Environment Variables
2. Add these variables:

- `PROTONMAIL_IMAP_HOST` = `YOUR_DROPLET_PRIVATE_IP` (e.g., `10.123.45.67`)
- `PROTONMAIL_IMAP_PORT` = `1143`
- `PROTONMAIL_IMAP_USER` = `your-email@pm.me` (from Bridge `info` command)
- `PROTONMAIL_IMAP_PASSWORD` = `[Bridge-generated-password]` (from Bridge `info` command)
- `PROTONMAIL_SMTP_HOST` = `YOUR_DROPLET_PRIVATE_IP` (same as IMAP host)
- `PROTONMAIL_SMTP_PORT` = `1025`
- `PROTONMAIL_SMTP_USER` = `your-email@pm.me` (same as IMAP user)
- `PROTONMAIL_SMTP_PASSWORD` = `[Bridge-generated-password]` (same as IMAP password)
- `PROTONMAIL_FROM_EMAIL` = `scan@yday.ai`
- `SCAN_EMAIL_ADDRESS` = `scan@yday.ai`
- `EMAIL_POLL_INTERVAL` = `120` (check every 2 minutes)

3. Click **Save** - DigitalOcean will auto-redeploy

---

## Part 4: Create scan@yday.ai Address in ProtonMail

1. Log into ProtonMail web interface
2. Go to: Settings → Addresses
3. Create new address: `scan@yday.ai`
4. This is where users will send record photos

---

## Part 5: Deploy Backend Code

The backend code includes the email service. Deploy it:

```bash
cd /Users/joshua/projects/yday_ios

# Check what's changed
git status

# Add all changes
git add .

# Commit
git commit -m "feat: Add email service, update logo, remove login spinners

- Add ProtonMail IMAP email service for scan@yday.ai
- Update login screen to use logo2.png
- Remove loading spinners from login buttons
- Add CHANGELOG.md for tracking updates"

# Push to main (auto-deploys on DigitalOcean)
git push origin main
```

**Verify deployment:**

1. Check DigitalOcean logs for: "✅ Email service started"
2. If you see that message, email polling is working!

---

## Part 6: DNS Configuration

### MX Records (for email delivery - ProtonMail)

In GoDaddy DNS, add ProtonMail MX records:

| Type | Name | Priority | Value | TTL |
|------|------|----------|-------|-----|
| MX | @ | 10 | mail.protonmail.ch | 1 hour |
| MX | @ | 20 | mailsec.protonmail.ch | 1 hour |

### TXT Records (for SPF - ProtonMail)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | @ | `v=spf1 include:_spf.protonmail.ch mx ~all` | 1 hour |

(ProtonMail will provide exact values in Settings → Domain)

### A Records (for website - GitHub Pages)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 1 hour |
| A | @ | 185.199.109.153 | 1 hour |
| A | @ | 185.199.110.153 | 1 hour |
| A | @ | 185.199.111.153 | 1 hour |

### CNAME Record (for www - GitHub Pages)

**Important**: If you already have a `www` CNAME, **update it** (don't create a new one):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | s1umpp.github.io | 1 hour |

**Note**: Changing DNS records does NOT affect domain ownership. You can always change them back.

---

## Part 7: Deploy Website to GitHub Pages

### Step 1: Build and Deploy

```bash
cd /Users/joshua/projects/yday_web_temp/web

# Install dependencies (if not already done)
npm install

# Deploy to GitHub Pages
npm run deploy
```

**Note**: The command is `npm run deploy` (not `deply` or `deploy`).

This creates a `gh-pages` branch with the built site.

### Step 2: Configure GitHub Pages

1. Go to: https://github.com/s1umpp/yday_web/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **(root)**
4. Click **Save**
5. Custom domain: Enter `www.yday.ai`
6. Check **Enforce HTTPS** (may take a few minutes to be available)

### Step 3: Wait for DNS Propagation

- DNS changes can take 5-60 minutes
- Check status at: https://dnschecker.org/#A/yday.ai
- Test website: Visit `www.yday.ai` (should show your site)

---

## Part 8: Test Email Scanning

1. Send an email to `scan@yday.ai` with a record photo attached
2. Wait 1-2 minutes (polling interval)
3. Check DigitalOcean backend logs for processing
4. You should receive a reply email with the scan results

---

## Summary Checklist

### Droplet Setup
- [ ] Create dedicated Droplet ($4/month)
- [ ] SSH into Droplet
- [ ] Install ProtonMail Bridge
- [ ] Set up `pass` password manager
- [ ] Generate GPG key for pass
- [ ] Log into Bridge and get credentials
- [ ] Configure Bridge as systemd service
- [ ] Install socat
- [ ] Set up bridge-proxy service
- [ ] Verify ports listening on 0.0.0.0
- [ ] Get Droplet's private IP address

### Backend Configuration
- [ ] Add environment variables to DigitalOcean App Platform
- [ ] Use Droplet's private IP (not 127.0.0.1)
- [ ] Deploy backend code with email service
- [ ] Verify "✅ Email service started" in logs

### DNS Configuration
- [ ] Add MX records for ProtonMail
- [ ] Add TXT records for SPF
- [ ] Add A records for website (GitHub Pages)
- [ ] Update CNAME record for www → s1umpp.github.io

### Website Deployment
- [ ] Run `npm install` in web directory
- [ ] Run `npm run deploy` (correct command!)
- [ ] Configure GitHub Pages
- [ ] Set custom domain: www.yday.ai
- [ ] Enable HTTPS

### ProtonMail Setup
- [ ] Create scan@yday.ai address in ProtonMail

### Testing
- [ ] Test email scanning: email scan@yday.ai
- [ ] Verify website loads at www.yday.ai
- [ ] Check backend logs for email processing

---

## Estimated Costs

| Service | Cost |
|---------|------|
| ProtonMail Duo | Already paying |
| DigitalOcean Backend (App Platform) | Already paying |
| **Dedicated Droplet for Bridge** | **$4/month** |
| GitHub Pages | Free |
| GoDaddy domain | Already paying |
| **Total Extra Cost** | **$4/month** |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│           DigitalOcean App Platform (Backend)                │
│           - Your Flask backend                               │
│           - Email service polls IMAP                         │
└───────────────────────┬─────────────────────────────────┘
                          │ Connects via private network
                          ▼
┌─────────────────────────────────────────────────────────────┐
│           Dedicated Droplet (Bridge Server)                 │
│           - ProtonMail Bridge (listens on 127.0.0.1)        │
│           - socat proxy (exposes on 0.0.0.0)                │
│           - Ports: 1143 (IMAP), 1025 (SMTP)                 │
└───────────────────────┬─────────────────────────────────┘
                          │ IMAP/SMTP
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    ProtonMail                                │
│           - Receives emails at scan@yday.ai                 │
│           - Bridge syncs emails                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Benefits

✅ No public webhook endpoints  
✅ Authenticated IMAP connection  
✅ You control polling frequency  
✅ ProtonMail spam filtering  
✅ Minimal attack surface  
✅ Emails stay in your ProtonMail account  
✅ Bridge only accessible from your backend (private network)  

---

## Troubleshooting

### Bridge won't start
- Check logs: `sudo journalctl -u protonmail-bridge -f`
- Verify Bridge is logged in: `sudo systemctl stop protonmail-bridge && protonmail-bridge --cli`
- Check pass is initialized: `pass ls`

### Bridge CLI says "no password manager"
- Make sure `pass` is initialized: `pass init YOUR_KEY_ID`
- Start GPG agent: `eval $(gpg-agent --daemon)`
- Set GPG_TTY: `export GPG_TTY=$(tty)`

### Ports not accessible from backend
- Verify proxy is running: `sudo systemctl status bridge-proxy`
- Check ports: `ss -tlnp | grep -E '1143|1025'` (should show `0.0.0.0`)
- Verify Droplet firewall allows connections from your backend

### Emails not being processed
- Check backend logs for "✅ Email service started"
- Verify environment variables use Droplet's **private IP** (not 127.0.0.1)
- Test IMAP connection from backend:
  ```python
  import imaplib
  mail = imaplib.IMAP4('YOUR_DROPLET_PRIVATE_IP', 1143)
  mail.login('your-email@pm.me', 'bridge-password')
  ```

### Website not loading
- Verify DNS propagation: https://dnschecker.org/#A/yday.ai
- Check GitHub Pages is deployed: https://github.com/s1umpp/yday_web/settings/pages
- Verify CNAME is set correctly: `www` → `s1umpp.github.io`

### npm run deploy fails
- Make sure you're in the `web` directory: `cd /Users/joshua/projects/yday_web_temp/web`
- Command is `npm run deploy` (not `deply` or `deploy`)
- Install dependencies first: `npm install`

---

## Need Help?

If you get stuck on any step, let me know and I can help troubleshoot!
