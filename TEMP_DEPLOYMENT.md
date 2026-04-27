# Temporary Deployment Guide

This project is **not ready for serverless hosting** yet because:

- MySQL is currently local.
- Uploaded images are saved to `backend/uploads`.
- The backend serves those images directly from disk at `/uploads`.

Because of that, the safest temporary approach is:

## Option 1: Fastest temporary client demo

Run both apps on your current machine and expose them with tunnels.

You will run:

- frontend on `http://localhost:3000`
- backend on `http://localhost:5050`
- MySQL on your local machine as it already is

Then expose them publicly with either:

- Cloudflare Quick Tunnel
- ngrok

This is best for a short demo because no database migration is needed and uploaded images keep working from your existing `backend/uploads` folder.

## Recommended tunnel setup

### Frontend

Expose port `3000`

Cloudflare:

```bash
cloudflared tunnel --url http://localhost:3000
```

ngrok:

```bash
ngrok http 3000
```

### Backend

Expose port `5050`

Cloudflare:

```bash
cloudflared tunnel --url http://localhost:5050
```

ngrok:

```bash
ngrok http 5050
```

You will get two public HTTPS URLs, for example:

- frontend: `https://frontend-demo.example`
- backend: `https://backend-demo.example`

## Env values for temporary demo

Update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://backend-demo.example
```

Update `backend/.env`:

```env
PORT=5050
FRONTEND_URL=https://frontend-demo.example
GOOGLE_CALLBACK_URL=https://backend-demo.example/api/auth/google/callback
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
```

## Important checks before sharing with client

1. Restart both frontend and backend after changing env files.
2. Open the public frontend URL and test:
   - home page
   - product listing
   - product images
   - admin login
   - add to cart
   - checkout flow
3. If using Google login, add the new public callback URL in Google Cloud Console:
   - Authorized redirect URI:
     `https://backend-demo.example/api/auth/google/callback`
   - Authorized JavaScript origin:
     `https://frontend-demo.example`

## Important limitations of this temporary method

- Your laptop/PC must stay on.
- If the backend process stops, the site breaks.
- If the tunnel stops, the public URL stops working.
- Cloudflare Quick Tunnels are for testing, not production.
- Free tunnel URLs can change when restarted unless you use a reserved setup.

## Option 2: Cleaner temporary deployment

If you want a more stable demo for a few days, use a single VM instead of serverless:

- Hostinger VPS
- Contabo VPS
- DigitalOcean Droplet
- Hetzner Cloud

On that VM you can run:

- Next.js frontend
- Express backend
- MySQL
- local uploads on disk

This is much closer to your final VPS architecture and avoids rewriting image storage now.

## Not recommended right now

Do not deploy this current setup directly to Vercel-only or other serverless platforms unless you first move:

- MySQL to a managed remote database
- uploads to object storage such as S3, Cloudflare R2, or Vercel Blob

Otherwise:

- local file uploads will not be durable
- backend filesystem assumptions will break
- your current local MySQL setup will not be reachable safely

## Later VPS-ready improvements

When you move beyond the temporary demo, do these first:

1. Move uploads from `backend/uploads` to object storage.
2. Move MySQL from local machine to VPS MySQL or managed MySQL.
3. Put frontend and backend behind one domain:
   - `https://yourdomain.com`
   - `https://yourdomain.com/api`
4. Add PM2 or Docker for process management.
5. Add Nginx as reverse proxy.

## Team recommendation

For **today**, use **Option 1** if the goal is only to show the client.

For **this week**, skip temporary serverless deployment and move directly to a cheap VPS if the client needs a stable review link.
