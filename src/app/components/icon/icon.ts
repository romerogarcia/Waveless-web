import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// Componente reutilizable para referenciar los SVG de public/icons/ sin
// duplicar el marcado en cada sitio donde se usan. Convención de nombre:
// name="adventure" -> /icons/icon-adventure.svg
@Component({
  selector: 'wl-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<string>();
  // Deja alt="" (por defecto) cuando el icono es decorativo y ya hay texto
  // visible al lado; ponle un texto solo si el icono va solo y aporta significado.
  readonly alt = input<string>('');
}
