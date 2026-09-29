import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { EMPTY_FILTERS, FilterStore, matchesFilters } from './filter.store';
import { Destination } from '../../../models/destination';

const trekking: Destination = {
  id: 'himalaya',
  category: 'Trekking',
  place: 'Himalaya, Nepal',
  duration: '14 días',
  title: 'Trekking al campo base del Everest',
  imageUrl: '',
  imageAlt: '',
  price: 1980,
  isBundle: false,
  activityTags: [],
  priceBreakdown: { priceBeforeTax: 1730, tax: 173, extra: 77, finalPrice: 1980 },
};

describe('matchesFilters', () => {
  it('sin filtros, todo coincide', () => {
    expect(matchesFilters(trekking, 'Sur de Asia', EMPTY_FILTERS)).toBeTrue();
  });

  it('filtra por región, categoría y alojamiento', () => {
    expect(matchesFilters(trekking, 'Sur de Asia', { ...EMPTY_FILTERS, regions: new Set(['Japón']) })).toBeFalse();
    expect(matchesFilters(trekking, 'Sur de Asia', { ...EMPTY_FILTERS, categories: new Set(['Trekking']) })).toBeTrue();
    expect(
      matchesFilters(trekking, 'Sur de Asia', { ...EMPTY_FILTERS, accommodation: new Set(['con-alojamiento'] as const) }),
    ).toBeFalse();
  });

  it('respeta el rango de precio', () => {
    expect(matchesFilters(trekking, 'Sur de Asia', { ...EMPTY_FILTERS, priceMax: 1000 })).toBeFalse();
    expect(matchesFilters(trekking, 'Sur de Asia', { ...EMPTY_FILTERS, priceMin: 1000 })).toBeTrue();
  });
});

describe('FilterStore', () => {
  let store: FilterStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), FilterStore] });
    store = TestBed.inject(FilterStore);
  });

  it('empieza sin filtros y con todos los destinos de la home', () => {
    expect(store.activeCount()).toBe(0);
    expect(store.resultCount()).toBe(9);
  });

  it('las opciones de una misma sección suman resultados', () => {
    store.toggleCategory('Trekking');
    expect(store.resultCount()).toBe(1);
    store.toggleCategory('Senderismo');
    expect(store.resultCount()).toBe(3);
  });

  it('oculta los grupos vacíos y reset lo deja todo como al principio', () => {
    store.toggleCategory('Kayak');
    expect(store.groups().map((g) => g.heading)).toEqual(['Más aventuras en Asia']);
    store.reset();
    expect(store.resultCount()).toBe(9);
    expect(store.activeCount()).toBe(0);
  });

  it('ignora un precio vacío o no numérico', () => {
    store.setPrice('priceMax', '');
    store.setPrice('priceMin', 'abc');
    expect(store.activeCount()).toBe(0);
  });
});
