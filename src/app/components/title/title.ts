import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'wl-title',
  imports: [],
  templateUrl: './title.html',
  styleUrl: './title.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// Título principal de cada página: es el único <h1>.
export class Title {
  readonly heading = input('Vive tus propias aventuras');
  readonly subtitle = input('Para los que les gusta explorar y conocer mundo sin complejos.');
}
