# HEPATOXAI — Publishing Guide

This application is a **research prototype**. It must always be presented with the permanent disclaimer:
> "Research prototype. AI-generated outputs require appropriate qualified professional review and are not a standalone diagnosis."

Do not publish it as a diagnostic tool, a medical device, or a product with unverified accuracy claims.

---

## 1. What the sandbox preview links are

The preview URLs shown in the chat (e.g. `https://3000-*.e2b.app`) are **temporary sandbox links**:
- They work only while the sandbox preview environment is running.
- They are NOT a permanent public website — anyone with the URL can open them, but the environment can be recycled at any time.
- To publish, deploy the code to a real platform (steps below).

## 2. Prerequisites for publishing

| Requirement | Recommended free/cheap option |
| --- | --- |
| Hosted PostgreSQL | Neon, Supabase, Render, or Railway (free tier is enough) |
| App hosting | Vercel (best for Next.js), or AWS Amplify / Azure Static Web Apps + Functions |
| Domain (optional) | Any registrar; connect a custom domain like `hepatoxai.example` |

The app **self-initializes**: the first request to `/api/health` creates all tables and seeds the de-identified demo data. You do not need to run migrations manually.

## 3. Publish with Vercel (recommended)

1. **Create the hosted database** (example with Neon):
   - Sign in at `neon.tech` → create a free Postgres project → copy the connection string
     (looks like `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`).

2. **Push this project to GitHub** (Windows 11, from the project folder):
   ```bat
   git init
   git add .
   git commit -m "HepatoXAI research platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/hepatoxai.git
   git push -u origin main
   ```
   (Make sure `.env` is in `.gitignore` — it contains your local database password.)

3. **Deploy**:
   - Go to `vercel.com` → **Add New → Project** → import the `hepatoxai` repo.
   - Framework preset: **Next.js** (auto-detected).
   - Add environment variable:
     - Key: `DATABASE_URL`
     - Value: your Neon/Supabase connection string
   - Click **Deploy**. In ~1 minute you get a permanent URL like
     `https://hepatoxai-xxxx.vercel.app`.

4. **Verify**:
   - Open `https://<your-site>/api/health` → expect `{"ok":true,"service":"HEPATOXAI","database":"ready"}`.
   - Open the site → sign in with `doctor@hepatoxai.local` (any password) → seeded data appears.

5. **Custom domain (optional)**:
   - Vercel → Project → Settings → Domains → add `hepatoxai.com` (or similar) → follow the DNS instructions
     (A record or CNAME). HTTPS is automatic and free.

## 4. Alternative: AWS or Azure

- **AWS**: put the connection string in the env, run `npx vercel deploy --prod --env DATABASE_URL=...`, or
  host on S3 + CloudFront with Next.js output, or on Amplify (`amplify push`).
- **Azure**: `az staticwebapps up` (needs `@azure/static-web-apps-cli`) with the `DATABASE_URL` env set,
  or App Service with `npm run build && npm start` and the env variable configured.

## 5. Production checklist before you share the link

- [ ] `DATABASE_URL` points at the hosted Postgres (not the sandbox one).
- [ ] `.env` never committed to Git (contains passwords).
- [ ] HTTPS enabled (automatic on Vercel/Neon/Supabase/CloudFront).
- [ ] `/api/health` returns `{"ok":true}` in production.
- [ ] Disclaimer visible (it is permanent in the UI and cannot be removed).
- [ ] No accuracy numbers published anywhere — the ≥95–96% target is an experimental hypothesis,
      verified only after the trained models (Phases 4–6) are evaluated on the locked test set.
- [ ] Replace placeholder authentication (current: demo token) with real JWT + bcrypt before any real clinical use
      (planned backend hardening phase).
- [ ] Rate limiting and input/file-size limits on uploads before production imaging intake.

## 6. Rollback plan

- Vercel keeps every previous deployment: Dashboard → Deployments → click the previous deployment → **Promote to Production**.
- Database: take a Postgres snapshot (Neon/Supabase do this automatically) before large schema changes.
