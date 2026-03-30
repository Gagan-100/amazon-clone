/* Available delivery options (days + cost in cents) */
export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

/* Return matching delivery option by ID */
export function getDeliveryOption(deliveryOptionId){

  let deliveryOption;
  
    /* Find matching delivery option */
    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });

    /* Fallback to default option if not found */
    return deliveryOption || deliveryOption[0];
}