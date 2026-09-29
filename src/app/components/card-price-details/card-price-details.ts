import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Modal } from '../modal/modal';
import { Destination } from '../../models/destination';
import { formatPrice } from '../../utils/format-price';

@Component({
  selector: 'wl-card-price-details',
  imports: [Modal],
  templateUrl: './card-price-details.html',
  styleUrl: './card-price-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPriceDetails {
  readonly open = input<boolean>(false);
  readonly destination = input.required<Destination>();
  readonly close = output<void>();

  protected readonly view = computed(() => {
    const destination = this.destination();
    const { priceBeforeTax, tax, extra, finalPrice } = destination.priceBreakdown;
    return {
      place: destination.place,
      duration: destination.duration,
      rows: [
        { label: 'Precio antes de impuestos', value: formatPrice(priceBeforeTax) },
        { label: 'Impuesto', value: formatPrice(tax) },
        { label: 'Tasas y gestión', value: formatPrice(extra) },
      ],
      total: formatPrice(finalPrice),
    };
  });
}
