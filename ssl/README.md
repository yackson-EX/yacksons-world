# SSL Certificate Placeholder

Place your SSL certificates here:

- `fullchain.pem` - Full SSL certificate chain
- `privkey.pem` - Private key

## For Development (Self-Signed Certificate)

Generate self-signed certificates for local development:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout privkey.pem \
  -out fullchain.pem \
  -subj "/CN=localhost"
```

## For Production (Let's Encrypt)

Use certbot to obtain free SSL certificates:

```bash
certbot certonly --webroot -w /var/www/certbot -d yourdomain.com
```

Then copy the certificates to this directory:
```bash
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/
```

**Important:** Keep these files secure and never commit them to version control!
