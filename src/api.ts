const API_BASE = "/api";
export const MERCHANT_SLUG = "mensah";
export const MENSAH_WHATSAPP_FALLBACK = "+233500861334";

export interface MerchantDetail {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  brand_colors: string[] | null;
  whatsapp_number: string | null;
}

export interface ItemResponse {
  id: string;
  merchant_id: string;
  name: string;
  description: string | null;
  price_minor: number;
  currency: string;
  image_urls: string[] | null;
  in_stock: boolean;
}

export interface CampaignSummary {
  id: string;
  title: string;
  copy_text: string | null;
  image_urls: string[] | null;
  team_slug: string | null;
  created_at: number;
}

export interface CampaignFeaturedItem {
  id: string;
  name: string;
  price_minor: number;
  currency: string;
  image_url: string | null;
  in_stock: boolean;
}

export interface BasketCreateRequest {
  merchant_id: string;
  items: BasketItemInput[];
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_note?: string | null;
  team_slug?: string | null;
}

export interface BasketItemInput {
  item_id: string;
  qty: number;
  item_note?: string | null;
}

export interface BasketCreateResponse {
  id: string;
}

export interface BasketDetail {
  id: string;
  merchant: { id: string; name: string; whatsapp_number: string | null } | null;
  items: BasketItem[];
  total_minor: number;
  currency: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_note: string | null;
  team_slug: string | null;
  created_at: number;
}

export interface BasketItem {
  item_id: string;
  name: string;
  price_minor: number;
  currency: string;
  image_url: string | null;
  in_stock: boolean;
  qty: number;
  item_note: string | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export function getApiAssetUrl(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith(API_BASE)) {
    return path;
  }

  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export interface MensahStorefront {
  merchant: MerchantDetail;
  items: ItemResponse[];
  campaigns: CampaignSummary[];
}

export const api = {
  getMensahMerchant: () => request<MerchantDetail>(`/merchants/${MERCHANT_SLUG}`),
  getMensahItems: () =>
    request<ItemResponse[]>(`/merchants/${MERCHANT_SLUG}/items`),
  getMensahCampaigns: (teamSlug?: string) =>
    request<CampaignSummary[]>(
      `/merchants/${MERCHANT_SLUG}/campaigns${teamSlug ? `?team_slug=${teamSlug}` : ""}`,
    ),
  getMensahStorefront: async (): Promise<MensahStorefront> => {
    const [merchant, items, campaigns] = await Promise.all([
      api.getMensahMerchant(),
      api.getMensahItems(),
      api.getMensahCampaigns(),
    ]);

    if (merchant.id !== MERCHANT_SLUG) {
      throw new Error(`Expected merchant "${MERCHANT_SLUG}", received "${merchant.id}".`);
    }

    return {
      merchant,
      items: items.filter((item) => item.merchant_id === MERCHANT_SLUG && item.in_stock),
      campaigns,
    };
  },
  getItem: (itemId: string) => request<ItemResponse>(`/items/${itemId}`),
  createBasket: (data: BasketCreateRequest) =>
    request<BasketCreateResponse>("/baskets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getBasket: (basketId: string) => request<BasketDetail>(`/baskets/${basketId}`),
};

export function formatPrice(minor: number, currency: string): string {
  const major = minor / 100;
  return `${currency} ${major.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function cleanWhatsAppNumber(whatsappNumber: string): string {
  const digits = whatsappNumber.replace(/\D/g, "");

  if (digits.length === 10 && digits.startsWith("0")) {
    return `233${digits.slice(1)}`;
  }

  return digits;
}

export function getWhatsAppWebUrl(
  whatsappNumber: string,
  message: string,
): string {
  const clean = cleanWhatsAppNumber(whatsappNumber);
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppDeepLink(
  whatsappNumber: string,
  message: string,
): string {
  const clean = cleanWhatsAppNumber(whatsappNumber);
  return `whatsapp://send?phone=${clean}&text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppMessage(
  items: { name: string; qty: number; price_minor: number; item_note?: string | null }[],
  currency: string,
  total: number,
  customer: { name?: string | null; phone?: string | null; note?: string | null },
): string {
  const lines = items.map(
    (i) =>
      `• ${i.qty}x ${i.name} — ${formatPrice(i.price_minor * i.qty, currency)}${i.item_note ? ` (${i.item_note})` : ""}`,
  );
  return [
    "*Mensah Order*",
    "",
    ...lines,
    "",
    `*Total: ${formatPrice(total, currency)}*`,
    "",
    `Name: ${customer.name || "—"}`,
    `Phone: ${customer.phone || "—"}`,
    `Note: ${customer.note || "—"}`,
  ].join("\n");
}
