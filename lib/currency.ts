// Currency formatting utilities for INR

export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatINRCompact = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return formatINR(amount);
};

// USD to INR conversion (approximate rate: 1 USD = 83 INR)
export const usdToINR = (usdAmount: number): number => {
  return usdAmount * 83;
};
