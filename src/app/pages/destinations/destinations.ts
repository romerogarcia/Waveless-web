import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Hero, HeroSlide } from '../../features/home/hero/hero';
import { Title } from '../../components/title/title';
import { CardGroup } from '../../components/card-group/card-group';
import { DestinationsService } from '../../services/destinations.service';

@Component({
  selector: 'wl-destinations-page',
  imports: [Hero, Title, CardGroup],
  templateUrl: './destinations.html',
  styleUrl: '../_page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestinationsPage {
  protected readonly groups = inject(DestinationsService).destinationGroups;

  // Cada slide enlaza con su grupo de la misma página (el id sale del título del grupo).
  protected readonly slides: HeroSlide[] = [
    {
      title: 'Japón',
      subtitle: 'Templos, montañas sagradas y ciudades que nunca duermen',
      image: '/img/photos/hero-japon.webp',
      link: '/destinos',
      fragment: 'japon',
    },
    {
      title: 'Corea del Sur',
      subtitle: 'Palacios, islas volcánicas y el ritmo de Seúl',
      image: '/img/photos/hero-corea.webp',
      link: '/destinos',
      fragment: 'corea-del-sur',
    },
    {
      title: 'Sudeste Asiático',
      subtitle: 'Templos entre la selva, bahías de piedra y arrozales infinitos',
      image: '/img/photos/hero-sudeste-asiatico.webp',
      link: '/destinos',
      fragment: 'sudeste-asiatico',
    },
  ];
}
