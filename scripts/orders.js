import { orders } from "../data/orders.js";
import { currencyFormat } from "./utils/money.js";
import { loadProductsFetch, getProduct } from "../data/products.js";
import { addToCart } from "../data/cart.js";
import { initGlobalSearch } from "./utils/search.js";
import { updateCartQuantity } from "./amazon.js";

import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

/* Load products and render orders page */
async function loadPage() {
  await loadProductsFetch();

  let ordersHtml = "";

  /* Loop through all orders */
  orders.forEach((order) => {
    if (!order) return;

    /* Format order date */
    const orderTimeString = dayjs(order.orderTime).format("D MMMM");

    ordersHtml += `
  
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderTimeString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>${currencyFormat(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>


          <div class = "order-details-grid">
         
          ${productListHtml(order)}
         
         </div>
          </div>

  
  
  `;
  });

  /* Generate HTML for products inside each order */
  function productListHtml(order) {
    let productListHtml = "";

    order.products.forEach((productDetails) => {

      /* Get full product data using productId */
      const product = getProduct(productDetails.productId);

      productListHtml += `

            <div class="product-image-container">
              <img src="${product.image}" />
            </div>

            <div class="product-details">
              <div class="product-name">
               ${product.name}
              </div>
              <div class="product-delivery-date">Arriving on: ${dayjs(
                productDetails.estimatedDeliveryTime,
              ).format("D MMMM")}
              </div>
              <div class="product-quantity">Quantity: ${productDetails.quantity}</div>
              <button class="buy-again-button button-primary js-buy-again" data-product-id = "${product.id}">
                <img class="buy-again-icon" src="images/icons/buy-again.png" />
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>
`;
    });

    return productListHtml;
  }

  /* Render all orders to the page */
  document.querySelector(".js-orders-grid").innerHTML = ordersHtml;

   /* Handle "Buy Again" button click */
  document.querySelectorAll(".js-buy-again").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      /* Add product again to cart */
      addToCart(productId);
      updateCartQuantity();

      /* Show temporary feedback to user */
      button.innerHTML = "Added";
      
      /* Reset button after 1 second */
      setTimeout(() => {
        button.innerHTML = `
        <img class="buy-again-icon" src="images/icons/buy-again.png" />
                <span class="buy-again-message">Buy it again</span>
        
        `;
      }, 1000);
    });
  });

 

}

/* Initialize search functionality */
initGlobalSearch();

/* Load orders page */
loadPage();
