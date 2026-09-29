// Formatea precios igual que el diseño: "1.124,00 €".
// Se usa 'de-DE' en lugar de 'es-ES' porque el formato español no pone el punto
// de miles en cifras de 4 dígitos (daría "1124,00 €"); el resultado es idéntico
// al del diseño en todo lo demás (coma decimal y € detrás).
const formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return formatter.format(value);
}
