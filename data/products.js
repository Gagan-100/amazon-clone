import { currencyFormat } from "../scripts/utils/money.js";

/* Get product by ID */
export function getProduct(productId) {
  let matchingProduct;

  /* Find matching product */
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}

/* Base Product class */
class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }

  /* Get rating stars image URL */
  getStarUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  /* Get formatted price */
  getPrice() {
    return currencyFormat(this.priceCents);
  }

  /* By Default no size chart */
  sizeChartHtml() {
    return "";
  }
}

/* Clothing product (inherits Product) */
class Clothing extends Product {
  sizeChartLink;

  /* Show size chart link */
  sizeChartHtml() {
    return `
    <a href = "${this.sizeChartLink}" target = "_blank">Size Chart</a>
    `;
  }

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }
}

/* Load products from backend using fetch */
export function loadProductsFetch() {
  const promise = fetch("https://supersimplebackend.dev/products")
    .then((response) => {
      return response.json();
    })
    .then((productsData) => {

      /* Convert raw data into Product/Clothing objects */
      products = productsData.map((productDetails) => {
        if (productDetails.type === "clothing") {
          return new Clothing(productDetails);
        } else {
          return new Product(productDetails);
        }
      });
      
    })
    .catch((error) => {
      console.log("Unxpected error. Please try again later.");
    });
  return promise;
}


/* Store products globally */
export let products = [];

/* Load products using XMLHttpRequest (callback-based) */
export function loadProducts(prodFun) {
  const xhr = new XMLHttpRequest();

  /* Convert response into Product objects */
  xhr.addEventListener("load", () => {
    products = JSON.parse(xhr.response).map((productDetails) => {
      if (productDetails.type === "clothing") {
        return new Clothing(productDetails);
      } else {
        return new Product(productDetails);
      }
    });
    prodFun();
  });

  xhr.addEventListener("error", () => {
    console.log("Unxpected error. Please try again later.");
  });

  xhr.open("GET", "https://supersimplebackend.dev/products");
  xhr.send();
}
