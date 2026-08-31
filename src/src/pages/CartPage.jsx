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
        week={4}
        description="This page intentionally ships without data in Week 1. Cart items, quantities, and checkout will be built out in Week 4."
        icon={CartIcon}
      />
    </>
  );
}

export default CartPage;
