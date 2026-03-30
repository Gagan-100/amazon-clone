import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { cart, loadCart } from "../data/cart.js";



/* Update total items count in checkout header */
 export function updateCheckoutItems(){
      let cartQuan = 0;

      /* Sum all cart item quantities */
      cart.forEach((cartItem)=>{
      cartQuan += cartItem.quantity;
      });

       /* Update checkout UI with item count */
      document.querySelector('.js-checkout-items').innerHTML = `
       Checkout (<a class="return-to-home-link" href="amazon.html">${cartQuan} items</a
          >)
      `;
    }

/* Load required data and render checkout page */
async function loadPage() {
  try {

    /* Load product data (async) */
    await loadProductsFetch();

    /* Load cart data using Promise wrapper */
    const value = await new Promise((resolve,reject) => {
      loadCart(() => {
        resolve("value 5");
      });
    });

  } catch (error) {
    /* Handle any loading errors */
    console.log("Unxpected error. Please try again later.");
  }

  /* Render checkout sections after data is ready */
  renderOrderSummary();
  renderPaymentSummary();
  updateCheckoutItems();
}

/* Initialize checkout page */
loadPage();
