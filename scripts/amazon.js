import { cart, addToCart } from "../data/cart.js";
import { loadProducts, products } from "../data/products.js";
import { currencyFormat } from "./utils/money.js";
import { initGlobalSearch } from "./utils/search.js";

loadProducts(renderProductsGrid);

  /* Calculate total items in cart and update UI */
  export function updateCartQuantity() {

    let cartQuantity = 0;
    /* Sum all product quantities */
    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });

   const cartElement =  document.querySelector(".js-cart-quantity");

    /* Update cart quantity in navbar if element exists */
    if(cartElement){
      cartElement.innerHTML = cartQuantity;
    }
  }



export function renderProductsGrid() {
  let productsHtml = "";

  /* Get search query from URL */
  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

 
  /* Filter products based on search keyword */
  if(search){
    filteredProducts = products.filter((product)=>{

      let matchingKeyword = false;

      product.keywords.forEach((keyword)=>{

        /* Check if product keywords match search */
        if(keyword.toLowerCase().includes(search.toLowerCase()))
          matchingKeyword = true;
      });

        /* Also match product name */
        return matchingKeyword|| product.name.toLowerCase().includes(search.toLowerCase());


    });
  }

  /* Generate HTML for each product */
  filteredProducts.forEach((product) => {
    productsHtml += `
   <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="${product.getStarUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

         
            ${product.sizeChartHtml()}
          

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id = "${product.id}">
            Add to Cart
          </button>
        </div>
  `;
  });

  const grid = document.querySelector(".js-products-grid");

  /* Render products in grid */
  if(grid){
    grid.innerHTML = productsHtml;
  }


  /* Handle add to cart button click */
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      /* Add selected product to cart and update quantity */
      addToCart(productId);
      updateCartQuantity();
    });

  });

  /* Initialize global search functionality */
  initGlobalSearch();

}

/* Update cart quantity on page load */
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartQuantity();
})





