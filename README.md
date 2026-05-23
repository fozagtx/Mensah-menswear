# Mensah — Luxury Tailored Menswear

Hackathon e-commerce platform for the Mensah track, built with Vite, React, TypeScript, and Bun.

## Setup

```bash
bun install
```

## Run

```bash
bun run dev
```

- Vite dev server on `http://localhost:5174`
- API calls proxied to `https://api-hackathon.codedematrixtech.com` via `/api/*`

## Build

```bash
bun run build
```

## Features

- Product catalog fetched from the hackathon merchant API (`mensah` merchant)
- Product filtering by price range
- Product quick-view modal
- Shopping cart (add/remove/adjust quantities)
- WhatsApp checkout flow (`POST /baskets` → WhatsApp redirect with order summary)
- Campaign display (when campaigns exist for the merchant)
- Mobile responsive design

## Product Flow

Miro board: [Mensah storefront user flow](https://miro.com/app/board/uXjVLjqOV-k=/?moveToWidget=3458764672976345822&cot=14)

![Mensah Miro user-flow board preview](docs/miro-user-flow-board.svg)
