import { getApiAssetUrl, type MerchantDetail } from "../api";

interface HeaderProps {
  merchant: MerchantDetail | null;
  cartCount: number;
  onCartClick: () => void;
}

export default function Header({ merchant, cartCount, onCartClick }: HeaderProps) {
  const logoUrl = getApiAssetUrl(merchant?.logo_url) ?? "/Mensah_Logo.png";

  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#" className="logo">
          <img
            src={logoUrl}
            alt={merchant?.name ?? "Mensah"}
            className="logo-img"
          />
        </a>

        <nav className="nav">
          <a href="#shop" className="nav-link">Collection</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#campaigns" className="nav-link">Campaigns</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        <button className="cart-btn" onClick={onCartClick}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
