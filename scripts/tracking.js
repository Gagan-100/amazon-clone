import { getOrder } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

/* Load data and render tracking page */
async function loadPage() {
  await loadProductsFetch();

  /* Get orderId and productId from URL */
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  /* Fetch order and product details */
  const order = getOrder(orderId);
  const product = getProduct(productId);


 /* Find specific product details inside the order */
  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  });

  
  /* Calculate delivery progress percentage */
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);

  const progressPercent = ((today - orderTime)/(deliveryTime - orderTime)*100);

  /* Generate tracking UI */
  const trackingHTML = `
  
   <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${dayjs(productDetails.estimatedDeliveryTime).format(
            "dddd, D MMMM",
          )}
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Quantity: ${productDetails.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${
              progressPercent < 50? 'current-status' : ''
          }">
            Preparing
          </div>
          <div class="progress-label ${
            (progressPercent >= 50 && progressPercent < 100 ) ? 'current-status' : ''
          }">
            Shipped
          </div>
          <div class="progress-label ${progressPercent >= 100 ? 'current-status' : ''}">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style = "width: ${progressPercent}%;"></div>
        </div>
  
  `;
  
  /* Render tracking details on page */
  document.querySelector(".js-order-tracking").innerHTML = trackingHTML;
}

/* Load and render tracking page */
loadPage();
