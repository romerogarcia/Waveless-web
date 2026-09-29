import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardGroup } from '../../../components/card-group/card-group';
import { FilterStore } from '../filters/filter.store';

@Component({
  selector: 'wl-filter-results',
  imports: [CardGroup],
  templateUrl: './filter-results.html',
  styleUrl: './filter-results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterResults {
  protected readonly store = inject(FilterStore);
}
