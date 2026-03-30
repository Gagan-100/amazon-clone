
/* Convert price (in cents) to INR currency format */
export function currencyFormat(priceCents){

  /* Convert cents → USD */
  const usd = Math.round(priceCents)/100;
  
  /* Convert USD → INR using fixed exchange rate */
  const rate = 85;
  const inr = usd * rate;

  /* Format INR value using Indian currency style */
  return new Intl.NumberFormat('en-IN',{
    style: 'currency',
    currency:'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(inr);

}