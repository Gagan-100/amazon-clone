/* Load orders from localStorage */
export const orders = JSON.parse(localStorage.getItem("orders")) || [];

/* Add new order and save to storage */
export function addOrder(order) {
  orders.unshift(order); // Add latest order at top
  saveToStorage();
}

/* Save orders to localStorage */
function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

/* Get specific order by ID */
export function getOrder(orderId) {
  let matchingOrder;

  orders.forEach((order) => {
    /* Skip invalid data */
    if(!order) return;
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });

  return matchingOrder;
}
