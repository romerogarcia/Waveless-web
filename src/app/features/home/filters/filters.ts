import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '../../../components/tooltip/tooltip';
import { Modal } from '../../../components/modal/modal';
import { AccommodationOption, FilterStore } from './filter.store';

// Las 4 secciones del acordeón de filtros. Un union type en vez de un string
// suelto: así el compilador avisa si en la plantilla escribimos mal el
// nombre de una sección
type FilterSection = 'destinos' | 'aventura' | 'alojamiento' | 'precio';
type CheckboxSection = Exclude<FilterSection, 'precio'>;

interface CheckboxOption {
  value: string;
  label: string;
  checked: boolean;
  tooltip: string;
}

interface CheckboxGroup {
  key: CheckboxSection;
  label: string;
  icon: string;
  options: CheckboxOption[];
}

// Textos de ayuda de cada opción
const HELP: Record<string, string> = {
  Japón: 'Montañas sagradas, templos e islas tropicales',
  'Corea del Sur': 'Parques nacionales e islas volcánicas',
  'Sudeste Asiático': 'Bahías, arrozales y playas de agua cálida',
  'Sur de Asia': 'Himalaya, palacios y plantaciones de té',
  Trekking: 'Rutas de varios días por alta montaña',
  Senderismo: 'Caminatas de una jornada, nivel medio',
  Kayak: 'Remo en aguas tranquilas, sin experiencia previa',
  Buceo: 'Inmersiones guiadas con equipo incluido',
  Surf: 'Clases y tablas para todos los niveles',
  Explora: 'Viajes culturales a tu ritmo',
  Ruta: 'Itinerario por varias ciudades',
  'con-alojamiento': 'El precio incluye las noches de hotel',
  'solo-actividad': 'Solo la experiencia; el alojamiento lo eliges tú',
};

const ACCOMMODATION_LABELS: Record<AccommodationOption, string> = {
  'con-alojamiento': 'Con alojamiento incluido',
  'solo-actividad': 'Solo actividad',
};

@Component({
  selector: 'wl-filters',
  imports: [FaIconComponent, Tooltip, Modal, NgTemplateOutlet],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Filters {
  protected readonly store = inject(FilterStore);

  protected readonly faChevronDown = faChevronDown;
  protected readonly faChevronRight = faChevronRight;

  protected readonly groups = computed<CheckboxGroup[]>(() => {
    const { regions, categories, accommodation } = this.store.state();
    const option = (value: string, label: string, checked: boolean): CheckboxOption => ({
      value,
      label,
      checked,
      tooltip: HELP[value] ?? '',
    });
    return [
      {
        key: 'destinos',
        label: 'Destinos',
        icon: 'destination',
        options: this.store.regionOptions().map((r) => option(r, r, regions.has(r))),
      },
      {
        key: 'aventura',
        label: 'Aventura',
        icon: 'adventure',
        options: this.store.categoryOptions().map((c) => option(c, c, categories.has(c))),
      },
      {
        key: 'alojamiento',
        label: 'Alojamiento',
        icon: 'house',
        options: (Object.keys(ACCOMMODATION_LABELS) as AccommodationOption[]).map((a) =>
          option(a, ACCOMMODATION_LABELS[a], accommodation.has(a)),
        ),
      },
    ];
  });

  // Abre/cierra el wl-modal que envuelve el formulario (solo relevante hasta
  // 1200px; el botón que lo dispara se oculta a partir de ahí).
  protected readonly open = signal(false);

  protected toggle(): void {
    this.open.update((open) => !open);
  }

  // Secciones abiertas del acordeón (pueden estar varias abiertas a la vez).
  protected readonly openSections = signal<ReadonlySet<FilterSection>>(new Set());

  protected isOpen(section: FilterSection): boolean {
    return this.openSections().has(section);
  }

  protected toggleSection(section: FilterSection): void {
    this.openSections.update((current) => {
      const next = new Set(current);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }

  protected onOptionChange(section: CheckboxSection, value: string): void {
    if (section === 'destinos') {
      this.store.toggleRegion(value);
    } else if (section === 'aventura') {
      this.store.toggleCategory(value);
    } else {
      this.store.toggleAccommodation(value as AccommodationOption);
    }
  }

  protected onPriceInput(bound: 'priceMin' | 'priceMax', event: Event): void {
    this.store.setPrice(bound, (event.target as HTMLInputElement).value);
  }

  // Los filtros se aplican en vivo, pero al estar dentro de un <form> nativo evitamos
  // que un Enter en los inputs de precio dispare un submit real (recarga de página).
  protected onSubmit(event: Event): void {
    event.preventDefault();
  }
}
