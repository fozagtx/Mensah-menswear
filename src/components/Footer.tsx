import { useState } from "react";
import { getApiAssetUrl, type MerchantDetail } from "../api";

interface FooterProps {
  merchant: MerchantDetail | null;
}

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/mensahgh/",
  tiktok: "https://www.tiktok.com/@mensahgh",
  maps: "https://www.google.com/maps/search/?api=1&query=Mensah%20menswear%20Accra%20Ghana",
  mapsEmbed: "https://www.google.com/maps?q=Mensah%20menswear%20Accra%20Ghana&output=embed",
};

export default function Footer({ merchant }: FooterProps) {
  const [mailingListOpen, setMailingListOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const merchantName = merchant?.name ?? "Mensah";
  const logoUrl = getApiAssetUrl(merchant?.logo_url) ?? "/Mensah_Logo.png";

  const handleSubscribe = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    window.localStorage.setItem("mensah_mailing_list_email", trimmed);
    setEmailError(null);
    setSubscribed(true);
  };

  const closeMailingList = () => {
    setMailingListOpen(false);
    setEmailError(null);
  };

  return (
    <>
      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#" className="footer-logo-mark" aria-label="Mensah home">
                <img
                  src={logoUrl}
                  alt={merchantName}
                  className="footer-logo"
                />
              </a>
              <p className="footer-tagline">
                Luxury tailored menswear for the modern West African gentleman.
              </p>
              <button
                type="button"
                className="footer-newsletter-btn"
                onClick={() => {
                  setSubscribed(false);
                  setMailingListOpen(true);
                }}
              >
                Get top product picks
              </button>
            </div>

            <div className="footer-links">
              <h4>Shop</h4>
              <a href="#shop">Collection</a>
              <a href="#campaigns">Campaigns</a>
              <a href="#about">About</a>
            </div>

            <div className="footer-links">
              <h4>Contact</h4>
              <a href={SOCIAL_LINKS.maps} target="_blank" rel="noreferrer">
                Accra, Ghana
              </a>
              <p>info@mensahgh.com</p>
              <p>+233 50 086 1334</p>
              <div className="footer-socials" aria-label="Mensah social links">
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer">
                  TikTok
                </a>
              </div>
            </div>

            <div className="footer-links">
              <h4>Hours</h4>
              <p>Mon – Fri: 9AM – 7PM</p>
              <p>Sat: 10AM – 5PM</p>
              <p>Sun: Closed</p>
            </div>
          </div>

          <div className="footer-map">
            <div>
              <h4>Location</h4>
              <p>View Mensah on Google Maps.</p>
            </div>
            <iframe
              title="Mensah location on Google Maps"
              src={SOCIAL_LINKS.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} {merchantName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {mailingListOpen && (
        <div className="modal-overlay" onClick={closeMailingList}>
          <div
            className="modal-content mailing-list-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={closeMailingList}>
              ×
            </button>

            {subscribed ? (
              <div className="mailing-list-success">
                <h2>You're on the list</h2>
                <p>Top product picks will be sent to {email.trim()}.</p>
                <button className="btn-primary btn-full" onClick={closeMailingList}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="mailing-list-title">Top Product Picks</h2>
                <p className="mailing-list-copy">
                  Receive curated Mensah selections, campaign drops, and standout pieces by email.
                </p>

                <form className="mailing-list-form" onSubmit={handleSubscribe}>
                  <div className="form-group">
                    <label htmlFor="mailing-list-email">Email Address</label>
                    <input
                      id="mailing-list-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setEmailError(null);
                      }}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  {emailError && <p className="form-error">{emailError}</p>}

                  <button type="submit" className="btn-primary btn-full">
                    Join Mailing List
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
