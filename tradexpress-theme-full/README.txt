TradExpress.co Bundle
Contact: hello@tradexpress.co / hello@kailu.dev

Contents:
- index.html : Main site with Dynamic Theory + Articles Framework + Aim & Ask
- insight.html : Insight Analytics Dashboard
- tradexpress-embed.html : Vacant iframe (Articles + Theory tabs)
- tradexpress.js : Article framework (6KB)
- tradexpress-dynamic-theory.js : Dynamic Theory Engine
- tradexpress-dynamic-theory.html : Theory-only page
- articles.json : Sample 7 articles (edit to add 100+)
- tradexpress-docs.html : Docs + live demo
- EMAIL_AUTH_GUIDE.md : SPF/DKIM/DMARC guide
- godaddy_dns_zone.txt : DNS zone import

Deploy:
1. Upload all to tradexpress.co root
2. DNS: TXT @ v=spf1 include:spf.improvmx.com include:_spf.google.com ~all TTL 4H
3. Add DKIM google._domainkey + DMARC _dmarc
4. Iframe: <iframe src="tradexpress-embed.html?src=articles.json" style="width:100%;height:800px;border:0">
