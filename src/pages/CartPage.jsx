import ComingSoon from "../components/ComingSoon.jsx";
import { CartIcon } from "../components/Icons.jsx";

function CartPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">EZTechMovie / Cart</p>
        <h1 className="page-title">Your Cart</h1>
        <p className="page-subtitle">
          Rentals and purchases will collect here before checkout.
        </p>
      </div>
      <ComingSoon
        title="Nothing in the cart — by design"
        tag="Planned for a future release"
        description="Cart, rentals, and checkout are scoped as a future release beyond this five-week build. The rest of the app — StreamList, Movies/TMDB search, and About — is complete."
        icon={CartIcon}
      />
    </>
  );
}

export default CartPage;
