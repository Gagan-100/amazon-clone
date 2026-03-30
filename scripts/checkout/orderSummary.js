import { cart, removeFromCart, updateDeliveryOption,updateQuantity } from "../../data/cart.js";

import { getProduct, products } from "../../data/products.js";
import { currencyFormat } from "../utils/money.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOption.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { updateCheckoutItems } from "../checkout.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

/* Render all cart items in order summary */
export function renderOrderSummary() {
  let cartSummaryHtml = "";

  /* Loop through cart items */
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

     /* Get product details */
    let matchingProduct = getProduct(productId);

    /* Get selected delivery option */
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    /* Calculate delivery date */
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const finalDeliveryDate = deliveryDate.format("dddd, D MMMM");

    cartSummaryHtml += `
  
  <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              ${finalDeliveryDate}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                 ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link"
                    data-product-id = "${matchingProduct.id}"
                  >
                    Update
                  </span>

                  <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                  <span class="save-quantity-link link-primary js-save-link"
                    data-product-id="${matchingProduct.id}">
                     Save
                  </span>


                  <span class="delete-quantity-link link-primary js-delete-button js-delete-button-${matchingProduct.id}" data-delete-id = "${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                
                ${deliveryOptionsHtml(matchingProduct, cartItem)}
               
               </div>
              </div>
            </div>
          

`;
  });

  /* Generate delivery options UI */
  function deliveryOptionsHtml(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {

      /* Calculate delivery date for each option */
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const finalDeliveryDate = deliveryDate.format("dddd, D MMMM");

      /* Show Free or formatted price */
      let deliveryFees =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `${currencyFormat(deliveryOption.priceCents)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
       <div class="delivery-option js-delivery-option" data-product-id = "${matchingProduct.id}" data-delivery-option-id = "${deliveryOption.id}">
          <input type="radio"
          ${isChecked ? "checked" : ""}
            class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}"
              value = "${deliveryOption.id}"
              >
                <div>
                  <div class="delivery-option-date">
                    ${finalDeliveryDate}
                  </div>
                  <div class="delivery-option-price">
                  ${deliveryFees} Shipping
                </div>
              </div>
              </div>
    
      `;
    });

    return html;
  }

  /* Render cart items */
  document.querySelector(".js-order-summary").innerHTML = cartSummaryHtml;

   /* Handle delete item */
  document.querySelectorAll(".js-delete-button").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.deleteId;

      removeFromCart(productId);

      renderOrderSummary();
      renderPaymentSummary();
      updateCheckoutItems();

    });
  });

  /* Handle delivery option change */
  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      //using shortHand property
      const { productId, deliveryOptionId } = element.dataset;

      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });



  /* Enable quantity editing */
  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.add('is-editing-quantity');
      });
    });

  /* Save updated quantity */
  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');

        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );
        const newQuantity = Number(quantityInput.value);
        updateQuantity(productId, newQuantity);

      
        renderOrderSummary();
        renderPaymentSummary();
        updateCheckoutItems();

          });
        });

}
