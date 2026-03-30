/* Cart data (loaded from localStorage) */
export let cart;

loadFromStorage();

/* Load cart from localStorage */
export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart"));

  /* Initialize empty cart if no data */
  if (!cart) {
    cart = [];
  }
}

/* Save cart to localStorage */
function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* Store timeout IDs for "Added" message (per product) */
const addedMessageTimeouts = {};

/* Add product to cart */
export function addToCart(productId) {
  let itemMatch;

  /* Check if product already exists in cart */
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      itemMatch = cartItem;
    }
  });

    /* Clear previous timeout (for repeated clicks) */
    const previousTimeoutId = addedMessageTimeouts[productId];
      if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
      }

  /* Show "Added" message temporarily */
  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
    if(addedMessage){
        addedMessage.classList.add('added-to-cart-visible');

        const timeoutId =  setTimeout( ()=>{
         addedMessage.classList.remove('added-to-cart-visible');

         }, 2000);

        /* Store timeout ID */
         addedMessageTimeouts[productId] = timeoutId;
    }


  /* Get selected quantity (by default = 1) */
  const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);

  let quantity = 1;
  if(quantitySelector){
     quantity = Number(quantitySelector.value);
  }
 
  /* Update existing item OR add new item */
  if (itemMatch) {
    itemMatch.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: "1",
    });
  }

  saveToStorage();
}

/* Remove product from cart */
export function removeFromCart(productId) {
  const newCart = [];

  /* Filter out the product */
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();

}

/* Update delivery option for a product */
export function updateDeliveryOption(productId, deliveryOptionId) {
  let itemMatch;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      itemMatch = cartItem;
    }
  });

  if (!itemMatch) {
    return;
  }

  itemMatch.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

/* Update quantity of a cart item */
export function updateQuantity(productId, newQuantity) {

  /* Validate input */
  if (newQuantity <= 0 || isNaN(newQuantity)) {
    alert("Please enter a valid quantity");
    return;
  }

  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity = newQuantity;
  }

  saveToStorage();
}



/* Simulate async cart loading, then execute callback */
export function loadCart(prodFun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("load", () => {
    prodFun();
  });

  xhr.open("GET", "https://supersimplebackend.dev/cart");
  xhr.send();
}
  
/* Clear entire cart */
export function clearCart() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
}

