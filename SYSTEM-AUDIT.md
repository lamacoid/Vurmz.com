# VURMZ System Architecture Audit
## Complete Analysis & Recommended Fixes

---

## EXECUTIVE SUMMARY

The current system has **critical architectural issues** that explain the bugs you're experiencing:
- Magic link login redirects to login page (auth systems don't talk to each other)
- Orders page empty despite dashboard showing orders (data in wrong table)
- $3 paid order missing (no payment webhook, quote never converted to order)
- No receipt system (payments aren't tracked)

**Root Cause**: The system was built incrementally with multiple approaches that were never unified.

---

## CRITICAL ISSUES

### 1. THREE DIFFERENT AUTH SYSTEMS (NOT CONNECTED)

| System | Location | How it works | Problem |
|--------|----------|--------------|---------|
| NextAuth + Prisma | `lib/auth.ts` | Uses Prisma ORM | **BROKEN** - App uses D1, not Prisma |
| Custom Edge Auth | `api/auth/[...nextauth]` | Mimics NextAuth, uses D1 | Sets `vurmz_session` cookie |
| Magic Link Auth | `api/admin/auth/*` | Uses Resend email | Sets `vurmz_session` cookie |

**The Bug**: `AdminShell.tsx` calls NextAuth's `useSession()` which returns `unauthenticated` because it doesn't know about the custom cookie. So after magic link sets the cookie, AdminShell redirects back to login.

```
Magic Link clicked
    → /admin/verify sets vurmz_session cookie ✓
    → Redirects to /admin/dashboard
    → AdminShell calls useSession()
    → NextAuth returns {status: 'unauthenticated'} ✗
    → AdminShell redirects to /admin/login
```

### 2. QUOTE vs ORDER TABLE CONFUSION

**Schema defines:**
- `quotes` table - for quote requests
- `orders` table - for confirmed orders

**Actual usage:**
- Quote API writes to `quotes` with columns that don't exist in schema (`order_number`, `payment_url`)
- Quote API generates order numbers for quotes (not orders)
- Quote API creates Square payment links for quotes
- **Orders table is never populated!**

**Why orders page is empty:**
```
Dashboard API:
  "SELECT COUNT(*) FROM orders WHERE status IN ('PENDING', 'IN_PROGRESS')"
  → Returns count from ORDERS table

Orders Page API:
  "SELECT * FROM orders"
  → Returns data from ORDERS table (empty)

But your $3 order is in QUOTES table with status 'pending-payment'
```

### 3. NO PAYMENT WEBHOOK

**Current flow:**
1. Customer submits order → Quote created with payment link
2. Customer pays via Square
3. **NOTHING HAPPENS** - No webhook to notify your system
4. Quote stays in "pending-payment" status forever
5. Order never created in orders table
6. Receipt never sent

**Missing piece**: `POST /api/webhooks/square` endpoint to receive payment notifications

### 4. SECURITY VULNERABILITIES

| Issue | Location | Risk |
|-------|----------|------|
| API keys in .env committed | `.env` | **CRITICAL** - Square access token exposed |
| No auth on admin APIs | `api/orders`, `api/quotes`, etc. | Anyone can read all customer data |
| Session in notes field | Portal auth | Overwrites customer notes, hacky |
| Customer ID cookie readable by JS | Portal auth | Session hijacking risk |
| No CSRF tokens | All POST routes | Cross-site request forgery |
| No rate limiting | All routes | DDoS, brute force attacks |

### 5. EMAIL SYSTEM MISMATCH

| File | Uses | Works on Edge? |
|------|------|----------------|
| `lib/email.ts` | nodemailer | **NO** - Node.js only |
| `api/admin/auth/send-link` | Resend | Yes |
| `api/portal/auth/send-link` | Resend | Yes |

`lib/email.ts` functions (`quoteRequestEmail`, `orderConfirmationEmail`, etc.) are defined but **cannot actually send** on Cloudflare Edge.

---

## DATA FLOW ANALYSIS

### Current (Broken) Flow:
```
Customer submits quote
    ↓
Quote created in QUOTES table
    ↓
Admin reviews, sends invoice via Square
    ↓
Customer pays on Square
    ↓
??? (nothing - no webhook)
    ↓
Quote stays in quotes table
Order never created
Receipt never sent
Dashboard shows wrong counts
```

### Required Flow:
```
Customer submits order request
    ↓
Quote created in quotes table (status: 'new')
    ↓
Admin reviews, sets price (status: 'quoted')
    ↓
Admin sends to customer (generates payment link)
    ↓
Customer views quote, clicks Pay
    ↓
Square processes payment
    ↓
Square webhook hits /api/webhooks/square
    ↓
Webhook handler:
  - Updates quote status to 'paid'
  - Creates ORDER in orders table
  - Generates receipt
  - Emails receipt to customer
  - Notifies admin
    ↓
Admin sees order in dashboard
Admin updates status as work progresses
Customer notified of status changes
```

---

## DATABASE SCHEMA ISSUES

### Missing columns in quotes table:
```sql
-- These are used in code but not in schema:
order_number TEXT
payment_url TEXT
customer_token TEXT
admin_notes TEXT
response_sent_at TEXT
accepted_at TEXT
completed_at TEXT
invoice_url TEXT
price REAL
```

### Missing tables:
```sql
-- Need sessions table instead of using notes field
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_type TEXT, -- 'admin' or 'customer'
  token TEXT UNIQUE,
  expires_at TEXT,
  created_at TEXT
);

-- Need payments table
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  quote_id TEXT,
  order_id TEXT,
  square_payment_id TEXT,
  amount REAL,
  status TEXT,
  paid_at TEXT,
  receipt_sent INTEGER DEFAULT 0
);

-- Need receipts table
CREATE TABLE receipts (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  payment_id TEXT,
  receipt_number TEXT,
  amount REAL,
  sent_at TEXT,
  pdf_url TEXT
);
```

---

## API ROUTES AUDIT

### Unprotected (should require auth):
- `GET /api/orders` - Lists all orders
- `GET /api/quotes` - Lists all quotes
- `GET /api/customers` - Lists all customers
- `GET /api/dashboard` - Shows business stats
- `GET /api/materials` - Lists inventory
- `POST /api/quotes/[id]/send` - Sends quote
- `POST /api/quotes/[id]/invoice` - Creates invoice

### Missing endpoints:
- `POST /api/webhooks/square` - Receive payment notifications
- `GET /api/admin/session` - Verify admin auth
- `POST /api/orders/[id]/status` - Update order status
- `GET /api/receipts/[id]` - Get receipt
- `POST /api/receipts/[id]/resend` - Resend receipt

---

## RECOMMENDED FIX PLAN

### Phase 1: Fix Auth (Day 1)
1. Remove NextAuth dependency entirely
2. Create single auth system:
   - `lib/auth-edge.ts` - Session management for Edge
   - Admin: Magic link → creates session in sessions table → sets cookie
   - Portal: Magic link → creates session in sessions table → sets cookie
3. Create `checkAuth()` middleware for protected routes
4. Update `AdminShell` to check custom session, not NextAuth

### Phase 2: Fix Database Schema (Day 1)
1. Add missing columns to quotes table
2. Create sessions table
3. Create payments table
4. Create receipts table
5. Run migrations

### Phase 3: Fix Quote → Order Flow (Day 2)
1. Quotes stay in quotes table until paid
2. On payment, create order in orders table
3. Link order to quote (quote_id foreign key)
4. Update quote status to 'completed'

### Phase 4: Add Square Webhook (Day 2)
1. Create `POST /api/webhooks/square`
2. Verify webhook signature
3. On payment.completed event:
   - Find quote by payment link ID
   - Create order
   - Generate receipt
   - Email customer
   - Update all statuses

### Phase 5: Add Receipt System (Day 3)
1. Create receipt generation function
2. Store receipt records
3. Email receipt with PDF or link
4. Admin can view/resend receipts

### Phase 6: Secure APIs (Day 3)
1. Add auth middleware to all admin routes
2. Add rate limiting
3. Add CSRF protection
4. Audit all inputs for injection

### Phase 7: Fix Email (Day 3)
1. Convert all email functions to use Resend
2. Create email templates
3. Test all notification flows

### Phase 8: Testing (Day 4)
1. Test complete quote → pay → order → receipt flow
2. Test all edge cases
3. Verify data consistency
4. Load testing

---

## IMMEDIATE ACTIONS REQUIRED

### 1. Rotate Square API keys
Your `.env` file contains real Square access tokens. If this file has ever been committed to git or shared:
- Log into Square Dashboard
- Regenerate your API keys immediately
- Update production environment variables

### 2. Add .env to .gitignore
```
# Add to .gitignore if not already there
.env
.env.local
.env.production
```

### 3. Fix the missing order
Your $3 paid order is likely in the quotes table. Run this query:
```sql
SELECT * FROM quotes WHERE price = 3 OR status = 'pending-payment' ORDER BY created_at DESC;
```

---

## FILES THAT NEED CHANGES

### Delete:
- `lib/auth.ts` (NextAuth/Prisma - unused)
- `lib/prisma.ts` (Prisma client - unused)

### Major Rewrite:
- `components/AdminShell.tsx` - Use custom auth instead of NextAuth
- `app/api/auth/[...nextauth]/route.ts` - Simplify to single auth system
- `app/api/admin/auth/*` - Unify with main auth
- `app/api/portal/auth/*` - Unify with main auth
- `app/api/quotes/route.ts` - Clean up order generation logic

### New Files Needed:
- `app/api/webhooks/square/route.ts` - Payment webhook
- `app/api/receipts/route.ts` - Receipt management
- `lib/receipt-generator.ts` - PDF/HTML receipt generation
- `middleware.ts` - Auth checks for protected routes

---

## CONCLUSION

The system needs a significant overhaul, but it's fixable. The core issue is that it evolved organically without a unified architecture. The fix is to:

1. **Unify auth** - One system, one cookie, one session table
2. **Unify data flow** - Quotes → Payment → Orders → Receipts
3. **Add webhook** - So payments actually update the system
4. **Secure everything** - Auth on APIs, input validation, rate limiting

Estimated time: 3-4 focused days of development.
