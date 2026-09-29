import { Injectable, computed, signal } from '@angular/core';
import { ACCOMMODATION_GROUPS, DESTINATION_GROUPS, DestinationGroup } from '../data/asia';
import { Destination } from '../models/destination';

/**
 * Punto único de acceso a los datos de destinos y alojamientos.
 * Hoy lee los datos estáticos de `data/asia.ts`; el día que haya una API,
 * solo cambia este servicio
 */
@Injectable({ providedIn: 'root' })
export class DestinationsService {
  private readonly destinationGroupsState = signal<DestinationGroup[]>(DESTINATION_GROUPS);
  private readonly accommodationGroupsState = signal<DestinationGroup[]>(ACCOMMODATION_GROUPS);

  readonly destinationGroups = this.destinationGroupsState.asReadonly();
  readonly accommodationGroups = this.accommodationGroupsState.asReadonly();

  readonly destinations = computed(() => this.destinationGroups().flatMap((group) => group.items));

  /** Región al que pertenece cada destino, indexada por id. */
  readonly regionById = computed(() => {
    const map = new Map<string, string>();
    for (const group of this.destinationGroups()) {
      for (const item of group.items) {
        map.set(item.id, group.heading);
      }
    }
    return map;
  });

  /** Devuelve los destinos con esos ids, en el mismo orden. */
  byIds(ids: readonly string[]): Destination[] {
    const all = this.destinations();
    return ids
      .map((id) => all.find((destination) => destination.id === id))
      .filter((destination): destination is Destination => !!destination);
  }
}
