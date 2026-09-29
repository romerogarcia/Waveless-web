import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Card } from '../card/card';
import { Destination } from '../../models/destination';
import { slugify } from '../../utils/slugify';

// Grupo de tarjetas con título (p. ej. "Japón"). Pinta una wl-card por cada destino.
// El id del título (p. ej. "japon") sirve de ancla para los enlaces del hero.
@Component({
  selector: 'wl-card-group',
  imports: [Card],
  templateUrl: './card-group.html',
  styleUrl: './card-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardGroup {
  readonly heading = input.required<string>();
  readonly destinations = input<Destination[]>([]);

  protected readonly anchorId = computed(() => slugify(this.heading()));
}
