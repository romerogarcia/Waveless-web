import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  path: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'wl-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // Escape cierra el menú móvil y devuelve el foco al botón hamburguesa
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class Header {
  protected readonly isMenuOpen = signal(false);
  private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');

  // "Aventura" es la home. RouterLinkActive marca el link de la página actual
  protected readonly links: NavLink[] = [
    { path: '/', label: 'Aventura', icon: 'adventure' },
    { path: '/destinos', label: 'Destinos', icon: 'destination' },
    { path: '/alojamiento', label: 'Alojamiento', icon: 'house' },
    { path: '/sobre-nosotros', label: 'Sobre nosotros' },
  ];

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected onEscape(): void {
    if (!this.isMenuOpen()) {
      return;
    }
    this.isMenuOpen.set(false);
    this.menuButton()?.nativeElement.focus();
  }
}
