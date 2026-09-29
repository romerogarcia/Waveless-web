import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title } from '../../components/title/title';
import { Icon } from '../../components/icon/icon';

interface Value {
  icon: string;
  title: string;
  text: string;
}

@Component({
  selector: 'wl-about-page',
  imports: [Title, Icon, RouterLink],
  templateUrl: './about.html',
  styleUrls: ['../_page.scss', './about.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {
  protected readonly values: Value[] = [
    {
      icon: 'adventure',
      title: 'Aventura con cabeza',
      text: 'Diseñamos cada ruta para que vivas experiencias intensas sin renunciar a la seguridad ni al descanso.',
    },
    {
      icon: 'destination',
      title: 'Especialistas en Asia',
      text: 'Conocemos Asia de primera mano, de Tokio a Katmandú, y trabajamos con guías locales en cada destino.',
    },
    {
      icon: 'house',
      title: 'Alojamientos con alma',
      text: 'Ryokans, casas hanok o una noche en un templo: dormir también forma parte del viaje.',
    },
  ];
}
