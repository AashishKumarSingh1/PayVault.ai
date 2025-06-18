export const loadRazorpayScript = (callback: () => void) => {
  if ((window as Window & typeof globalThis).Razorpay) return callback();
  
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = callback;
  document.body.appendChild(script);
};