import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

let nextModalId = 0;

// Margen mínimo que dejamos respecto al borde de la pantalla al recolocar un popover "anchored"
const ANCHORED_EDGE_MARGIN = 8;

@Component({
  selector: 'wl-modal',
  imports: [FaIconComponent],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  readonly open = input<boolean>(false);
  readonly heading = input<string>('');
  readonly anchored = input<boolean>(false);
  readonly floatLeft = input<boolean>(false);
  // Caja centrada con fondo oscurecido (desde tablet); en móvil ocupa toda la pantalla.
  readonly centered = input<boolean>(false);
  readonly close = output<void>();

  protected readonly faXmark = faXmark;
  protected readonly headingId = `modal-heading-${nextModalId++}`;

  // Solo para el caso "anchored": medir dónde ha quedado pintado en pantalla para saber si se sale por algún borde
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  // Corrección horizontal para que el no quede cortado por el borde de la pantalla
  protected readonly anchoredOffsetX = signal(0);

  // Elemento que tenía el foco justo antes de abrir el modal, para devolvérselo al cerrar
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const panelEl = this.panel()?.nativeElement;

      if (!this.open() || !this.anchored() || !panelEl) {
        this.anchoredOffsetX.set(0);
        return;
      }

      // Esperamos a que el navegador haya pintado el popover en su posición por defecto antes de medirla.
      requestAnimationFrame(() => this.clampToViewport(panelEl));
    });

    effect(() => {
      const panelEl = this.panel()?.nativeElement;

      if (this.open()) {
        this.previouslyFocused = document.activeElement as HTMLElement | null;
        requestAnimationFrame(() => panelEl?.focus());
      } else if (this.previouslyFocused) {
        this.previouslyFocused.focus();
        this.previouslyFocused = null;
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }

    if (event.key === 'Escape') {
      this.close.emit();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent): void {
    const panelEl = this.panel()?.nativeElement;
    if (!panelEl) {
      return;
    }

    const focusable = panelEl.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private clampToViewport(panelEl: HTMLElement): void {
    // Esta lógica  variante anchored
    if (getComputedStyle(panelEl).position !== 'absolute') {
      this.anchoredOffsetX.set(0);
      return;
    }

    const rect = panelEl.getBoundingClientRect();
    // Lógica necesaria para evitar que desborde la modal
    if (rect.left < ANCHORED_EDGE_MARGIN) {
      this.anchoredOffsetX.set(ANCHORED_EDGE_MARGIN - rect.left);
    } else if (rect.right > window.innerWidth - ANCHORED_EDGE_MARGIN) {
      this.anchoredOffsetX.set(window.innerWidth - ANCHORED_EDGE_MARGIN - rect.right);
    } else {
      this.anchoredOffsetX.set(0);
    }
  }
}
