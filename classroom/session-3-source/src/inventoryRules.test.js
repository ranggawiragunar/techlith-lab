import { isProductValid, validateOutbound } from './inventoryRules';

describe('Inventory outbound scenarios', () => {
  test.each([
    [-1, false, 10],
    [0, false, 10],
    [1, true, 9],
    [9, true, 1],
    [10, true, 0],
    [11, false, 10]
  ])('stock=10, amount=%s', (amount, valid, nextStock) => {
    expect(validateOutbound(10, amount)).toMatchObject({ valid, nextStock });
  });
});

describe('Product validation', () => {
  test('rejects a product that does not meet the product requirements', () => {
    const incompleteProduct = {
      name: '',
      category: '',
      description: '',
      price: 0,
      colors: [],
      sizes: [],
      stocks: [{ color: 'Black', size: 'M', amount: 1 }]
    };

    expect(isProductValid(incompleteProduct)).toBe(false);
  });
});
