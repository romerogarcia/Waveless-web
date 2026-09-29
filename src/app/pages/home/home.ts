import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Hero } from '../../features/home/hero/hero';
import { Title } from '../../components/title/title';
import { Filters } from '../../features/home/filters/filters';
import { FilterResults } from '../../features/home/filter-results/filter-results';
import { FilterStore } from '../../features/home/filters/filter.store';

@Component({
  selector: 'wl-home-page',
  imports: [Hero, Title, Filters, FilterResults],
  providers: [FilterStore],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
