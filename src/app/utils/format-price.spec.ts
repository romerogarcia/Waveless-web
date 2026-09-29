import { formatPrice } from './format-price';

describe('formatPrice', () => {
  // Intl usa un espacio duro (U+00A0) antes del símbolo; lo normalizamos para comparar.
  const clean = (value: string) => value.replace(/\s/g, ' ');

  it('formatea con coma decimal y € al final', () => {
    expect(clean(formatPrice(248))).toBe('248,00 €');
  });

  it('pone punto de miles también en cifras de 4 dígitos', () => {
    expect(clean(formatPrice(1980))).toBe('1.980,00 €');
  });
});
