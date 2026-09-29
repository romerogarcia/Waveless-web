import { Injectable, computed, inject, signal } from '@angular/core';
import { DestinationsService } from '../../../services/destinations.service';
import { Destination } from '../../../models/destination';

export type AccommodationOption = 'con-alojamiento' | 'solo-actividad';

export interface FilterState {
  regions: ReadonlySet<string>;
  categories: ReadonlySet<string>;
  accommodation: ReadonlySet<AccommodationOption>;
  priceMin: number | null;
  priceMax: number | null;
}

export interface HomeGroup {
  heading: string;
  ids: readonly string[];
}

// Destinos de aventura que se muestran en la home, agrupados por tipo de actividad.
export const HOME_GROUPS: readonly HomeGroup[] = [
  { heading: 'Montaña y trekking', ids: ['himalaya', 'fuji', 'seoraksan'] },
  {
    heading: 'Más aventuras en Asia',
    ids: ['halong', 'okinawa', 'bali', 'jeju', 'sri-lanka', 'agra-rajastan'],
  },
];

export const EMPTY_FILTERS: FilterState = {
  regions: new Set(),
  categories: new Set(),
  accommodation: new Set(),
  priceMin: null,
  priceMax: null,
};

/**
 * Función pura con la regla de filtrado (fácil de testear).
 * Dentro de una misma sección las opciones suman (OR); entre secciones se combinan (AND).
 */
export function matchesFilters(destination: Destination, region: string, filters: FilterState): boolean {
  const byRegion = filters.regions.size === 0 || filters.regions.has(region);
  const byCategory = filters.categories.size === 0 || filters.categories.has(destination.category);
  const byAccommodation =
    filters.accommodation.size === 0 ||
    filters.accommodation.has(destination.isBundle ? 'con-alojamiento' : 'solo-actividad');
  const byMin = filters.priceMin == null || destination.price >= filters.priceMin;
  const byMax = filters.priceMax == null || destination.price <= filters.priceMax;
  return byRegion && byCategory && byAccommodation && byMin && byMax;
}

/**
 * Estado de los filtros de la home. Se provee en HomePage para que wl-filters (que escribe)
 * y wl-filter-results (que lee) compartan la misma instancia sin conocerse entre sí.
 */
@Injectable()
export class FilterStore {
  private readonly data = inject(DestinationsService);

  readonly state = signal<FilterState>(EMPTY_FILTERS);

  /** Destinos candidatos de la home (sin filtrar). */
  readonly candidates = computed(() => this.data.byIds(HOME_GROUPS.flatMap((group) => group.ids)));

  /** Opciones de cada sección, sacadas de los propios datos para que siempre haya resultados. */
  readonly regionOptions = computed(() => {
    // En el mismo orden que la página de Destinos, solo las regiones que tienen resultados.
    const present = new Set(this.candidates().map((d) => this.data.regionById().get(d.id)));
    return this.data.destinationGroups().map((g) => g.heading).filter((h) => present.has(h));
  });
  readonly categoryOptions = computed(() => unique(this.candidates().map((d) => d.category)));

  readonly groups = computed(() => {
    const filters = this.state();
    const regionById = this.data.regionById();
    return HOME_GROUPS.map((group) => ({
      heading: group.heading,
      items: this.data
        .byIds(group.ids)
        .filter((d) => matchesFilters(d, regionById.get(d.id) ?? '', filters)),
    })).filter((group) => group.items.length > 0);
  });

  readonly resultCount = computed(() =>
    this.groups().reduce((total, group) => total + group.items.length, 0),
  );

  readonly activeCount = computed(() => {
    const { regions, categories, accommodation, priceMin, priceMax } = this.state();
    return (
      regions.size + categories.size + accommodation.size + (priceMin == null ? 0 : 1) + (priceMax == null ? 0 : 1)
    );
  });

  toggleRegion(value: string): void {
    this.state.update((s) => ({ ...s, regions: toggle(s.regions, value) }));
  }

  toggleCategory(value: string): void {
    this.state.update((s) => ({ ...s, categories: toggle(s.categories, value) }));
  }

  toggleAccommodation(value: AccommodationOption): void {
    this.state.update((s) => ({ ...s, accommodation: toggle(s.accommodation, value) }));
  }

  setPrice(bound: 'priceMin' | 'priceMax', raw: string): void {
    const value = raw.trim() === '' ? null : Number(raw);
    this.state.update((s) => ({ ...s, [bound]: value != null && Number.isFinite(value) ? value : null }));
  }

  reset(): void {
    this.state.set(EMPTY_FILTERS);
  }
}

function toggle<T>(set: ReadonlySet<T>, value: T): ReadonlySet<T> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
