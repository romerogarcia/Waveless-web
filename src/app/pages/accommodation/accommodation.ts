import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Hero, HeroSlide } from '../../features/home/hero/hero';
import { Title } from '../../components/title/title';
import { CardGroup } from '../../components/card-group/card-group';
import { DestinationsService } from '../../services/destinations.service';

@Component({
  selector: 'wl-accommodation-page',
  imports: [Hero, Title, CardGroup],
  templateUrl: './accommodation.html',
  styleUrl: '../_page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccommodationPage {
  protected readonly groups = inject(DestinationsService).accommodationGroups;

  protected readonly slides: HeroSlide[] = [
    {
      title: 'Dormir como un local',
      subtitle: 'Ryokans, havelis, bungalows en la playa y casas de té en el Himalaya',
      image: '/img/photos/hero-alojamiento.webp',
      link: '/alojamiento',
      fragment: 'japon',
    },
  ];
}
