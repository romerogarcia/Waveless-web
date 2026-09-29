import { slugify } from './slugify';

describe('slugify', () => {
  it('quita tildes, pasa a minúsculas y separa con guiones', () => {
    expect(slugify('Corea del Sur')).toBe('corea-del-sur');
    expect(slugify('Japón')).toBe('japon');
    expect(slugify('  Sudeste Asiático ')).toBe('sudeste-asiatico');
  });
});
