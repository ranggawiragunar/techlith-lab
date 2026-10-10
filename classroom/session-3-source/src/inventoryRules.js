export function validateOutbound(stock, amount) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { valid: false, message: 'Transaction could not be processed.', nextStock: stock };
  }
  if (amount > stock) {
    return { valid: false, message: 'Transaction could not be processed.', nextStock: stock };
  }
  return { valid: true, message: 'Transaction recorded.', nextStock: stock - amount };
}

export function isProductValid(product) {
  return (
    product.name.trim() !== '' &&
      product.category.trim() !== '' &&
      product.description.trim() !== '' &&
      product.price > 0 &&
      product.colors.length > 0 &&
      product.sizes.length > 0,
    product.stocks.length > 0
  );
}
