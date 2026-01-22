# VURMZ Backend Setup Instructions

## What Was Fixed

1. **Auth System** - Unified to single Edge-compatible auth
   - Magic links now work correctly
   - Admin panel uses custom session hook instead of NextAuth

2. **Square Webhook** - New endpoint at `/api/webhooks/square`
   - Receives payment notifications
   - Creates orders automatically when paid
   - Generates and emails receipts
   - Notifies admin

3. **Database Schema** - Migration file created at `migrations/001-add-missing-columns.sql`

---

## STEP 1: Run Database Migration

You need to run the migration against your D1 database. Use Wrangler:

```bash
cd "/Users/zacharydemillo/Desktop/WEBSITE PROJECT"
npx wrangler d1 execute vurmz-db --file=migrations/001-add-missing-columns.sql
```

If your D1 database has a different name, replace `vurmz-db` with the correct name.

---

## STEP 2: Set Up Square Webhook

1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Select your application
3. Go to **Webhooks** in the left sidebar
4. Click **Add Webhook**
5. Set the following:
   - **Webhook URL**: `https://vurmz.com/api/webhooks/square`
   - **Events to subscribe to**:
     - `payment.completed`
     - `payment.updated`
6. Click **Save**
7. Copy the **Signature Key** and add it to your environment:
   ```
   SQUARE_WEBHOOK_SIGNATURE_KEY=your_signature_key_here
   ```

---

## STEP 3: Add Environment Variables

Add these to your Cloudflare Workers environment (or wrangler.toml):

```
SQUARE_WEBHOOK_SIGNATURE_KEY=your_signature_key_from_step_2
ADMIN_EMAIL=zach@vurmz.com
RESEND_API_KEY=your_resend_api_key
```

---

## STEP 4: Deploy

```bash
npm run deploy
```

---

## STEP 5: Find Your Missing $3 Order

Your $3 order is likely in the `quotes` table. To find it:

```sql
SELECT * FROM quotes WHERE price = 3 OR status LIKE '%paid%' ORDER BY created_at DESC LIMIT 10;
```

If found, you can manually create an order in the admin panel, or the next payment will work automatically through the webhook.

---

## Testing the Flow

1. Create a test quote through the website
2. Set a price and send to customer (or yourself)
3. Pay via Square
4. Webhook should:
   - Create order in orders table ✓
   - Send receipt email ✓
   - Notify admin ✓

Check logs in Cloudflare Workers dashboard if something doesn't work.

---

## Rotate Square API Keys (Important!)

Your `.env` file contains real API keys. If this has ever been committed to git:

1. Go to Square Developer Dashboard
2. Generate new API credentials
3. Update your production environment variables
4. Never commit `.env` to git (add to `.gitignore`)

---

## What Still Needs Work (Future)

- [ ] Add auth middleware to all admin API routes
- [ ] Add rate limiting
- [ ] Convert remaining email templates to Resend
- [ ] Customer portal improvements
