import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'wl-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  // Año actual, para no tener que actualizar el copyright.
  protected readonly year = new Date().getFullYear();
}
