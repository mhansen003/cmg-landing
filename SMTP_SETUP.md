# Outlook SMTP Setup Guide

## 🔐 Setting Up Outlook for CMG Tools Authentication

Follow these steps to configure Outlook to send authentication emails:

### Step 1: Enable 2FA on Your Microsoft Account (Required)

1. Go to https://account.microsoft.com/security
2. Sign in with your Outlook/Microsoft account
3. Click on **"Two-step verification"**
4. Turn it ON if not already enabled
5. Follow the prompts to set up 2FA (use phone or authenticator app)

### Step 2: Generate an App Password

**Important**: You CANNOT use your regular Outlook password for SMTP. You must create an App Password.

1. Go to https://account.microsoft.com/security
2. Scroll down to **"App passwords"** section
3. Click **"Create a new app password"**
4. Give it a name like "CMG Tools Hub"
5. **Copy the generated password** (usually 16 characters with spaces or dashes)
6. Save it somewhere secure - you won't be able to see it again!

### Step 3: Add to Environment Variables

Add these to your `.env.local` file:

```bash
# SMTP Configuration
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com      # Your Outlook email
SMTP_PASS=xxxx-xxxx-xxxx-xxxx         # The App Password you just generated
```

### Step 4: Generate JWT Secret

You need a random secret key for JWT tokens. Run this command:

**Windows PowerShell:**
```powershell
$bytes = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

**Or use this website:**
https://generate-secret.vercel.app/32

Add to `.env.local`:
```bash
JWT_SECRET=your-generated-secret-here
```

### Step 5: Test Email Sending

We'll test this together after you provide the credentials!

---

## 📧 Which Email Should You Use?

### Option 1: Personal Outlook Account
**Pros:**
- Quick to set up
- Full control
- Works immediately

**Cons:**
- Emails come from personal account
- Not as professional

**Recommended for:** Development and testing

### Option 2: CMG Organization Email
**Pros:**
- Professional sender address
- Branded emails
- Official appearance

**Cons:**
- May require IT approval
- Organization security policies apply
- Might need admin permissions

**Recommended for:** Production deployment

---

## 🔍 Troubleshooting

### "Username and Password not accepted"
- Make sure you're using an **App Password**, not your regular password
- Verify 2FA is enabled on your Microsoft account
- Check that SMTP_USER matches the email that generated the app password

### "Connection timeout"
- Verify SMTP_HOST is `smtp-mail.outlook.com`
- Verify SMTP_PORT is `587`
- Check if your firewall is blocking port 587

### "Less secure app access"
- This doesn't apply to Outlook - you need App Passwords instead
- Make sure 2FA is enabled

### Emails going to spam
- Add a proper "From" name in the email configuration
- Consider adding SPF/DKIM records (requires IT/DNS access)
- Ask recipients to whitelist your sender address

---

## 🚀 Next Steps

1. ✅ Enable 2FA on Microsoft account
2. ✅ Generate App Password
3. ✅ Generate JWT Secret
4. ✅ Add all variables to `.env.local`
5. ✅ Test email sending
6. ✅ Deploy to Vercel with environment variables

---

## 📝 Example `.env.local` File

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-proj-...

# Redis Database
REDIS_URL=redis://default:password@redis-host:port

# SMTP Configuration
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=mark.hansen@outlook.com
SMTP_PASS=abcd-efgh-ijkl-mnop

# JWT Secret (32+ characters recommended)
JWT_SECRET=a8f4k2j9d8s7a6h5g4f3d2s1a0z9x8c7v6b5n4m3
```

---

## 🔐 Security Best Practices

1. **Never commit `.env.local` to Git** (already in .gitignore)
2. **Use different passwords** for dev and production
3. **Rotate app passwords** every 90 days
4. **Store production secrets** in Vercel dashboard only
5. **Limit SMTP user permissions** to sending only

---

Need help? I'll guide you through each step!
