import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { CardPriceDetails } from '../card-price-details/card-price-details';
import { Modal } from '../modal/modal';
import { Destination } from '../../models/destination';
import { formatPrice } from '../../utils/format-price';

@Component({
  selector: 'wl-card',
  imports: [FaIconComponent, CardPriceDetails, Modal],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  // Todos los datos de la tarjeta salen del destino (ver src/app/data/asia.ts).
  readonly destination = input.required<Destination>();

  protected readonly faChevronDown = faChevronDown;
  protected readonly breakdownOpen = signal(false);
  protected readonly reserveOpen = signal(false);

  protected readonly price = computed(() => formatPrice(this.destination().price));

  protected openBreakdown(): void {
    this.breakdownOpen.set(true);
  }

  protected closeBreakdown(): void {
    this.breakdownOpen.set(false);
  }

  protected openReserve(): void {
    this.reserveOpen.set(true);
  }

  protected closeReserve(): void {
    this.reserveOpen.set(false);
  }
}
