import type { CartItem } from "../App";
import { getApiAssetUrl } from "../api";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  onUpdateQty: (itemId: string, qty: number) => void;
  onRemove: (itemId: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  open,
  onClose,
  cart,
  cartTotal,
  cartCount,
  onUpdateQty,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  return (
    <>
      {open && <div className="drawer-backdrop" onClick={onClose} />}
      <aside className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart ({cartCount})</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button className="btn-primary" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map((ci) => (
                <li key={ci.item.id} className="cart-item">
                  <div className="cart-item-image">
                    {getApiAssetUrl(ci.item.image_urls?.[0]) ? (
                      <img
                        src={getApiAssetUrl(ci.item.image_urls?.[0]) ?? ""}
                        alt={ci.item.name}
                      />
                    ) : (
                      <div className="img-placeholder-sm" />
                    )}
                  </div>
                  <div className="cart-item-body">
                    <h4 className="cart-item-name">{ci.item.name}</h4>
                    <p className="cart-item-price">
                      GHS {(ci.item.price_minor / 100).toFixed(2)}
                    </p>
                    <div className="cart-item-qty">
                      <button
                        onClick={() => onUpdateQty(ci.item.id, ci.qty - 1)}
                      >
                        −
                      </button>
                      <span>{ci.qty}</span>
                      <button
                        onClick={() => onUpdateQty(ci.item.id, ci.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => onRemove(ci.item.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="cart-item-total">
                    GHS {((ci.item.price_minor * ci.qty) / 100).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>GHS {(cartTotal / 100).toFixed(2)}</span>
              </div>
              <button className="btn-primary btn-full" onClick={onCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
