import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'wl-tooltip',
  imports: [],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tooltip {
  readonly text = input<string>('');
  /** Nombre accesible del botón; conviene que sea único ("Más información sobre Surf"). */
  readonly label = input<string>('Más información');

  protected readonly open = signal(false);
  protected readonly bubbleId = `tooltip-${nextId++}`;

  protected show(): void {
    this.open.set(true);
  }

  protected hide(): void {
    this.open.set(false);
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.open.update((open) => !open);
  }
}

let nextId = 0;
