import { cart, clearCart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOption.js";
import { currencyFormat } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

/* Calculate and render payment summary */
export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let cartQuant = 0;

  /* Calculate total product price, shipping, and quantity */
  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    cartQuant += cartItem.quantity;

    if (!product) return;
    

    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    shippingPriceCents += deliveryOption.priceCents;
  });

  /* Calculate totals */
  const totalPriceBeforeTax = productPriceCents + shippingPriceCents;

  /* Calculate 10% tax */
  const estimatedTaxCents = (totalPriceBeforeTax * 0.1).toFixed(2);

  /* Final total amount */
  const totalCents =
    Number(productPriceCents) +
    Number(shippingPriceCents) +
    Number(estimatedTaxCents);

  /* Generate payment summary UI */
  const paymentSummaryHtml = `
  
    <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (${cartQuant}):</div>
            <div class="payment-summary-money">${currencyFormat(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">${currencyFormat(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">${currencyFormat(totalPriceBeforeTax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">${currencyFormat(estimatedTaxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">${currencyFormat(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
  
  
  `;

  /* Render payment summary */
  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHtml;

  /* Handle place order action */
  document
    .querySelector(".js-place-order")
    .addEventListener("click", async () => {
      try {

        /* Send order data to backend */
        const response = await fetch("https://supersimplebackend.dev/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: cart,
          }),
        });

        const order = await response.json();

        /* Save order and clear cart */
        addOrder(order);
        clearCart(); 

      }
       catch (error) {
        /* Handle API errors */
        console.log("unexpected error. please try again later");
      }

      /* Redirect to orders page */
      window.location.href = "orders.html";
    });
}
