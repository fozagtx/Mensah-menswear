# API Endpoints

Base: `https://api-hackathon.codedematrixtech.com`
Proxied via: `/api/*` → upstream base

## GET `/merchants/{slug}`

Returns merchant details — name, logo URL, WhatsApp number, brand colors.

```
GET /api/merchants/mensah
```

**Response:**
```json
{
  "id": "mensah",
  "name": "Mensah",
  "description": "",
  "logo_url": "/images/mensah/logo.png",
  "brand_colors": [],
  "whatsapp_number": ""
}
```

**Type:** `MerchantDetail`

---

## GET `/merchants/{slug}/items`

Returns all products for the merchant.

```
GET /api/merchants/mensah/items
```

**Response:**
```json
[
  {
    "id": "outfit-1",
    "merchant_id": "mensah",
    "name": "Outfit 1",
    "description": "",
    "price_minor": 80000,
    "currency": "GHS",
    "image_urls": ["/images/mensah/outfit1.jpeg"],
    "in_stock": true
  }
]
```

**Type:** `ItemResponse[]`

Pricing is in minor units — divide `price_minor` by 100 for GHS (e.g. 80000 = GHS 800.00).

Product images are served from the API at the `image_urls` paths (proxied as `/api/images/mensah/outfit1.jpeg`).

---

## GET `/merchants/{slug}/campaigns`

Returns active campaigns for the merchant.

```
GET /api/merchants/mensah/campaigns
```

**Response:**
```json
[
  {
    "id": "campaign-1",
    "title": "Summer Sale",
    "copy_text": "20% off all tailored suits",
    "image_urls": ["/images/mensah/campaign1.jpeg"],
    "team_slug": null,
    "created_at": 1716393600
  }
]
```

**Type:** `CampaignSummary[]`

Currently returns `[]` for the Mensah merchant (no campaigns exist).

---

## POST `/baskets`

Creates a basket (order) with items and customer information.

```
POST /api/baskets
```

**Request:**
```json
{
  "merchant_id": "mensah",
  "items": [
    {
      "item_id": "outfit-1",
      "qty": 2,
      "item_note": "Size XL"
    }
  ],
  "customer_name": "Kofi Mensah",
  "customer_phone": "+233241234567",
  "customer_note": "Alter sleeves to 34in",
  "team_slug": null
}
```

**Response:**
```json
{
  "id": "basket-abc123"
}
```

**Type:** `BasketCreateRequest` → `BasketCreateResponse`

On success, the app constructs a WhatsApp message from the order and redirects to `wa.me` with the merchant's phone number.
Because the Mensah API currently returns an empty `whatsapp_number`, the storefront falls back to `+233500861334`.

---

## GET `/items/{item_id}`

Get a single item by ID.

```
GET /api/items/outfit-1
```

**Type:** `ItemResponse`

Available in `api.getItem()` but not currently wired to the UI.

---

## GET `/baskets/{basket_id}`

Get basket details after creation.

```
GET /api/baskets/basket-abc123
```

**Type:** `BasketDetail`

Available in `api.getBasket()` but not currently wired to the UI.

---

## Proxying

During development, Vite proxies `/api/*` → `https://api-hackathon.codedematrixtech.com/*`:

```
vite.config.ts
  proxy: { "/api": { target: "https://api-hackathon.codedematrixtech.com", ... } }
```

In production, the Bun server (`server/index.ts`) forwards `/api/*` requests to the same upstream.

Image paths like `/images/mensah/outfit1.jpeg` are prefixed with `/api` in the frontend so they route through the proxy to the API's asset server.
