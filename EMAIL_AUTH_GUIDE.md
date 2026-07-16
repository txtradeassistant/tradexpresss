
# Email Authentication for tradexpress.co
Generated for TradExpress.co - hello@tradexpress.co -> hello@kailu.dev
Date: 2026-07-16

## Current Setup (ImprovMX)
You have:
MX @ mx1.improvmx.com (10)
MX @ mx2.improvmx.com (20)
TXT @ v=spf1 include:spf.improvmx.com ~all

This handles INBOUND forwarding only. For OUTBOUND (sending as hello@tradexpress.co), you need DKIM + DMARC.

## Full Recommended Records

### 1. SPF (You already added - KEEP IT, upgrade recommended)
Type: TXT
Host: @
Value: v=spf1 include:spf.improvmx.com include:_spf.google.com ~all
TTL: 4 Hours
Why: Allows ImprovMX + Gmail (kailu.dev) to send.

### 2. DKIM - For Gmail "Send As" hello@tradexpress.co
ImprovMX does NOT provide DKIM for outbound. You must generate DKIM in Google Workspace where hello@kailu.dev lives.

Steps:
A. Go to admin.google.com -> Apps -> Google Workspace -> Gmail -> Authenticate email (DKIM)
B. Select tradexpress.co as domain (add tradexpress.co as Alias Domain in Google Admin -> Domains -> Manage Domains -> Add Alias Domain if not there)
C. Click Generate new record, 2048-bit
D. Google gives you:
   Host: google._domainkey
   TXT Value: v=DKIM1; k=rsa; p=MIIBIjANBgkqh... (long key)
E. Add in GoDaddy DNS:
   Type: TXT
   Host: google._domainkey
   Value: [paste from Google]
   TTL: 4 Hours
F. Back in Google Admin, click Start Authentication

Wait 24h, then verify at: https://mxtoolbox.com/dkim.aspx

If you DON'T have Google Workspace for tradexpress.co, use this alternative:
- In Gmail (hello@kailu.dev) -> Settings -> Accounts and Import -> Send mail as -> Add hello@tradexpress.co -> Use Gmail SMTP to send. Then DKIM will be signed by Gmail's dkim via _spf.google.com + google._domainkey from your kailu.dev domain, which still passes if you use the upgraded SPF.

### 3. DMARC (Critical for not going to spam)
Type: TXT
Host: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:hello@kailu.dev; ruf=mailto:hello@kailu.dev; fo=1
TTL: 4 Hours

What this does:
- p=quarantine = if SPF/DKIM fails, put in spam not reject (safe start)
- rua = aggregate reports sent to hello@kailu.dev so you see who spoofs you
- After 2 weeks with no issues, upgrade to p=reject for max protection

### 4. Optional but Recommended - MX for Google if you also want to RECEIVE directly in Google (not just forward)
If you want hello@tradexpress.co inbox inside Google Workspace directly (instead of forwarding via ImprovMX), you would need to replace ImprovMX MX with Google MX. But for forwarding setup, KEEP ImprovMX MX.

Best hybrid: Keep ImprovMX MX for forwarding, and also add Google alias so you can SEND as hello@tradexpress.co.

## Final DNS Table for GoDaddy

| Type | Name | Value | TTL |
|------|------|-------|-----|
| MX | @ | mx1.improvmx.com | 4H | Priority 10 |
| MX | @ | mx2.improvmx.com | 4H | Priority 20 |
| TXT | @ | v=spf1 include:spf.improvmx.com include:_spf.google.com ~all | 4H |
| TXT | google._domainkey | v=DKIM1; k=rsa; p=YOUR_KEY_FROM_GOOGLE_ADMIN | 4H |
| TXT | _dmarc | v=DMARC1; p=quarantine; rua=mailto:hello@kailu.dev; ruf=mailto:hello@kailu.dev; fo=1 | 4H |

## How to Verify All Green

1. https://inspector.improvmx.com/ -> enter tradexpress.co -> should be green
2. https://mxtoolbox.com/SuperTool.aspx?action=mx%3Atradexpress.co -> check MX
3. https://mxtoolbox.com/spf.aspx?domain=tradexpress.co -> SPF valid
4. https://mxtoolbox.com/dkim.aspx?domain=tradexpress.co -> DKIM after you add google._domainkey
5. https://mxtoolbox.com/dmarc.aspx?domain=tradexpress.co -> DMARC valid
6. Send test email from hello@kailu.dev AS hello@tradexpress.co to https://www.mail-tester.com/ -> should score 9/10+

## Shareable for Other Users

> To avoid spam when forwarding hello@tradexpress.co -> hello@kailu.dev:
> Add TXT @ = v=spf1 include:spf.improvmx.com include:_spf.google.com ~all (4H)
> Add TXT _dmarc = v=DMARC1; p=quarantine; rua=mailto:hello@kailu.dev (4H)
> Add TXT google._domainkey = [from Google Admin DKIM] (4H)

