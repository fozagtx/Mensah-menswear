import { useEffect, useState } from "react";
import {
  api,
  getApiAssetUrl,
  type ItemResponse,
  type CampaignSummary,
  type MerchantDetail,
} from "./api";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductGrid, { type OccasionFilter } from "./components/ProductGrid";
import Campaigns from "./components/Campaigns";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";

export interface CartItem {
  item: ItemResponse;
  qty: number;
  note: string;
}

const STYLE_PREFERENCE_KEY = "mensah_style_preference";

const preferenceOptions: {
  value: OccasionFilter;
  title: string;
  copy: string;
}[] = [
  {
    value: "party",
    title: "Party person",
    copy: "Polished evening looks, dinners, and standout arrivals.",
  },
  {
    value: "summer",
    title: "Summer person",
    copy: "Light, breathable pieces for warm days and easy movement.",
  },
  {
    value: "beach",
    title: "Beach vacation",
    copy: "Relaxed outing styles for travel, resorts, and waterfront plans.",
  },
  {
    value: "programs",
    title: "Programs",
    copy: "Dress-ready outfits for ceremonies, visits, and formal gatherings.",
  },
  {
    value: "afropop",
    title: "Afro pop",
    copy: "Culture-forward looks with color, rhythm, and weekend energy.",
  },
];

function isOccasionFilter(value: string | null): value is OccasionFilter {
  return (
    value === "all" ||
    preferenceOptions.some((option) => option.value === value)
  );
}

export default function App() {
  const [merchant, setMerchant] = useState<MerchantDetail | null>(null);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);
  const [stylePreference, setStylePreference] = useState<OccasionFilter>("all");
  const [preferenceOpen, setPreferenceOpen] = useState(false);

  useEffect(() => {
    const savedPreference = window.localStorage.getItem(STYLE_PREFERENCE_KEY);
    if (isOccasionFilter(savedPreference)) {
      setStylePreference(savedPreference);
    } else {
      setPreferenceOpen(true);
    }

    async function load() {
      try {
        const storefront = await api.getMensahStorefront();
        setMerchant(storefront.merchant);
        setItems(storefront.items);
        setCampaigns(storefront.campaigns);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const choosePreference = (preference: OccasionFilter) => {
    setStylePreference(preference);
    window.localStorage.setItem(STYLE_PREFERENCE_KEY, preference);
    setPreferenceOpen(false);
    window.setTimeout(() => {
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const addToCart = (item: ItemResponse) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, qty: ci.qty + 1 } : ci,
        );
      }
      return [...prev, { item, qty: 1, note: "" }];
    });
    setSelectedItem(null);
    setCartOpen(true);
  };

  const updateCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, qty } : ci)),
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const cartTotal = cart.reduce(
    (sum, ci) => sum + ci.item.price_minor * ci.qty,
    0,
  );
  const cartCount = cart.reduce((sum, ci) => sum + ci.qty, 0);
  const heroImageUrl = campaigns[0]?.image_urls?.[0] ?? items[0]?.image_urls?.[0] ?? null;
  const aboutImageItem = items[1] ?? items[0] ?? null;

  if (loading) {
    return (
      <div className="loading-screen">
        <img src="/Mensah_Logo.png" alt="Mensah" className="loading-logo" />
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <h1>Something went wrong</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        merchant={merchant}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        <Hero imageUrl={heroImageUrl} />
        <section id="shop" className="shop-section">
          <div className="container">
            <h2 className="section-title">The Collection</h2>
            <p className="section-subtitle">
              Tailored pieces for the modern gentleman. Each garment crafted with precision and care.
            </p>
            <ProductGrid
              items={items}
              preferredOccasion={stylePreference}
              onSelect={(item) => setSelectedItem(item)}
              onAddToCart={addToCart}
            />
          </div>
        </section>

        {campaigns.length > 0 && (
          <Campaigns campaigns={campaigns} items={items} />
        )}

        <section id="about" className="about-section">
          <div className="container">
            <div className="about-content">
              <div className="about-text">
                <h2 className="section-title">The House of Mensah</h2>
                <p>
                  Mensah embodies the pinnacle of West African tailoring tradition.
                  Every stitch, every cut, every fabric selection is an intentional
                  choice — a commitment to clothing that commands presence.
                </p>
                <p>
                  From the boardroom to ceremonial occasions, our garments are designed
                  for men who understand that how you dress is how you address the world.
                </p>
                <a href="#shop" className="btn-outline">
                  View Collection
                </a>
              </div>
              <div className="about-visual">
                <div className="about-accent">
                  {aboutImageItem?.image_urls?.[0] ? (
                    <img
                      src={getApiAssetUrl(aboutImageItem.image_urls[0]) ?? ""}
                      alt={aboutImageItem.name}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer merchant={merchant} />

      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>
            <div className="product-modal-grid">
              <div className="product-modal-image">
                {selectedItem.image_urls?.[0] ? (
                  <img
                    src={getApiAssetUrl(selectedItem.image_urls[0]) ?? ""}
                    alt={selectedItem.name}
                  />
                ) : (
                  <div className="img-placeholder" />
                )}
              </div>
              <div className="product-modal-info">
                <h2>{selectedItem.name}</h2>
                <p className="product-modal-price">
                  GHS {(selectedItem.price_minor / 100).toFixed(2)}
                </p>
                {selectedItem.description && (
                  <p className="product-modal-desc">{selectedItem.description}</p>
                )}
                <div className="product-modal-specs">
                  <div className="spec">
                    <span className="spec-label">Material</span>
                    <span className="spec-value">Premium Cotton Blend</span>
                  </div>
                  <div className="spec">
                    <span className="spec-label">Fit</span>
                    <span className="spec-value">Tailored</span>
                  </div>
                  <div className="spec">
                    <span className="spec-label">Care</span>
                    <span className="spec-value">Dry Clean Only</span>
                  </div>
                </div>
                <button
                  className="btn-primary btn-large"
                  onClick={() => addToCart(selectedItem)}
                >
                  Add to Cart — GHS {(selectedItem.price_minor / 100).toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        cartCount={cartCount}
        onUpdateQty={updateCartQty}
        onRemove={removeFromCart}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
          cart={cart}
          cartTotal={cartTotal}
          onClearCart={() => setCart([])}
          whatsappNumber={merchant?.whatsapp_number ?? ""}
        />
      )}

      {preferenceOpen && !loading && (
        <div className="modal-overlay preference-overlay" onClick={() => choosePreference("all")}>
          <div
            className="modal-content preference-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => choosePreference("all")}
              aria-label="Close preference modal"
            >
              ×
            </button>

            <span className="section-kicker">Mensah Style Concierge</span>
            <h2 className="preference-title">What are you buying for?</h2>
            <p className="preference-copy">
              Choose a style lane and we will tune the collection around your first browse.
              You can still change filters anytime.
            </p>

            <div className="preference-options">
              {preferenceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="preference-option"
                  onClick={() => choosePreference(option.value)}
                >
                  <span>{option.title}</span>
                  <small>{option.copy}</small>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="preference-skip"
              onClick={() => choosePreference("all")}
            >
              Browse everything
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
