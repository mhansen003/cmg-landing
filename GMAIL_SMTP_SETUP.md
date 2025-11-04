# Gmail SMTP Setup Guide

## 🔐 Setting Up Gmail for CMG Tools Authentication

Follow these steps to configure Gmail to send authentication emails:

### Step 1: Enable 2-Step Verification (Required)

Gmail requires 2-Step Verification to generate App Passwords.

1. Go to https://myaccount.google.com/security
2. Sign in with your Gmail account
3. Find **"2-Step Verification"** and click on it
4. Click **"Get Started"** and follow the prompts
5. Choose your preferred method (phone, authenticator app, etc.)
6. Complete the setup process

### Step 2: Generate an App Password

**Important**: You CANNOT use your regular Gmail password for SMTP. You must create an App Password.

1. After enabling 2-Step Verification, go to https://myaccount.google.com/apppasswords
   - Or navigate: Google Account → Security → 2-Step Verification → App passwords
2. Click on **"Select app"** dropdown and choose **"Mail"**
3. Click on **"Select device"** dropdown and choose **"Other (Custom name)"**
4. Enter a name like "CMG Tools Hub"
5. Click **"Generate"**
6. **Copy the 16-character password** (no spaces, just letters)
7. Save it somewhere secure - you won't be able to see it again!

### Step 3: Add to Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com           # Your Gmail address
SMTP_PASS=abcdabcdabcdabcd                # The 16-char App Password (no spaces)

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your-random-secret-here

# Redis URL (for session storage)
REDIS_URL=redis://default:password@host:port
```

### Step 4: Generate JWT Secret

You need a random secret key for JWT tokens. Run this command:

**Windows PowerShell:**
```powershell
$bytes = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

**Or use Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Or use this website:**
https://generate-secret.vercel.app/32

### Step 5: Configure Redis

For local development, you can use:
- **Upstash** (free tier): https://upstash.com/
- **Redis Cloud** (free tier): https://redis.com/cloud/
- **Local Redis**: Install Redis locally

Get your Redis URL and add it to `.env.local`

### Step 6: Test Email Sending

Start your development server:
```bash
npm run dev
```

Visit http://localhost:3000/login and try logging in with a @cmgfi.com email!

---

## 📧 Which Gmail Account Should You Use?

### Option 1: Personal Gmail Account
**Pros:**
- Quick to set up
- Full control
- Works immediately
- No approvals needed

**Cons:**
- Emails come from personal account
- Not as professional
- Gmail sending limits apply (500/day)

**Recommended for:** Development and testing

### Option 2: Google Workspace (G Suite) Email
**Pros:**
- Professional sender address
- Branded emails
- Higher sending limits (2000/day)
- Official appearance

**Cons:**
- Requires organization G Suite account
- May need admin approval
- Organization security policies apply

**Recommended for:** Production deployment

---

## 🔍 Troubleshooting

### "Username and Password not accepted"
- ✅ Verify you're using an **App Password**, not your regular Gmail password
- ✅ Make sure 2-Step Verification is enabled
- ✅ Check that SMTP_USER matches the Gmail account that generated the app password
- ✅ App password should be 16 characters with no spaces

### "Connection timeout"
- ✅ Verify SMTP_HOST is `smtp.gmail.com`
- ✅ Verify SMTP_PORT is `587`
- ✅ Check if your firewall is blocking port 587
- ✅ Try port `465` with `secure: true` as an alternative

### "Invalid login: 534-5.7.9 Application-specific password required"
- ✅ This means you're using your regular password instead of an App Password
- ✅ Go back to Step 2 and generate a new App Password

### "Less secure app access"
- ✅ This setting is deprecated - use App Passwords instead
- ✅ Google no longer supports "less secure apps"
- ✅ 2-Step Verification + App Passwords is the only supported method

### Emails going to spam
- ✅ Add a proper "From" name in the email configuration
- ✅ Ask recipients to whitelist your sender address
- ✅ Consider warming up the account (start with few emails, gradually increase)
- ✅ For production, consider adding SPF/DKIM records (requires DNS access)

### Gmail Daily Sending Limits
- **Personal Gmail:** 500 emails per day
- **Google Workspace:** 2,000 emails per day
- If you exceed limits, wait 24 hours before sending again

---

## 🚀 Quick Start Checklist

- [ ] Enable 2-Step Verification on Gmail account
- [ ] Generate App Password
- [ ] Generate JWT Secret
- [ ] Set up Redis database
- [ ] Add all environment variables to `.env.local`
- [ ] Test email sending locally
- [ ] Add environment variables to Vercel (for production)

---

## 📝 Example `.env.local` File

```bash
# OpenAI API Key (for AI tools)
OPENAI_API_KEY=sk-proj-...

# Redis Database (session storage)
REDIS_URL=redis://default:abc123@redis-12345.upstash.io:6379

# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=markhansen@gmail.com
SMTP_PASS=abcdabcdabcdabcd

# JWT Secret (32+ characters recommended)
JWT_SECRET=a8f4k2j9d8s7a6h5g4f3d2s1a0z9x8c7v6b5n4m3
```

---

## 🔐 Security Best Practices

1. **Never commit `.env.local` to Git** (already in .gitignore)
2. **Use different App Passwords** for dev and production
3. **Rotate App Passwords** every 90 days
4. **Store production secrets** in Vercel dashboard only
5. **Monitor your Gmail account** for unusual activity
6. **Use a dedicated Gmail account** for production (not your personal email)
7. **Enable Gmail security alerts** to detect unauthorized access

---

## 🚀 Deploying to Vercel

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
4. Add all the variables from `.env.local`:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `JWT_SECRET`
   - `REDIS_URL`
   - `OPENAI_API_KEY` (if using AI features)
5. Redeploy your application

---

## 📧 Email Preview

When users log in, they'll receive an email like this:

**Subject:** Your CMG Tools Hub Access Code

**Body:**
```
🏠 CMG Tools Hub

Your Access Code
──────────────────
Hello! Someone requested access to the CMG Tools Hub using this email address.

┌──────────────────┐
│  VERIFICATION CODE │
│      123456       │
│  Valid for 5 min  │
└──────────────────┘

Enter this code on the login page to access your dashboard.

⚠️ Security Notice:
• This code expires in 5 minutes
• You have 5 attempts to enter it correctly
• If you didn't request this code, please ignore this email

Need help? Contact your IT administrator
```

---

## 🆘 Still Having Issues?

If you've followed all steps and still can't send emails:

1. **Check Gmail Account Activity**
   - Go to https://myaccount.google.com/notifications
   - Look for any security alerts or blocked sign-in attempts

2. **Verify Environment Variables**
   - Print them in your code (temporarily, for debugging)
   - Make sure there are no extra spaces or quotes

3. **Test with a Simple Script**
   ```javascript
   const nodemailer = require('nodemailer');

   const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 587,
     auth: {
       user: 'your-email@gmail.com',
       pass: 'your-app-password'
     }
   });

   transporter.verify((error, success) => {
     if (error) {
       console.log('Error:', error);
     } else {
       console.log('Server is ready to send emails');
     }
   });
   ```

4. **Check Server Logs**
   - Look for detailed error messages in console
   - Gmail will provide specific error codes

---

Need personalized help? Contact your development team!
