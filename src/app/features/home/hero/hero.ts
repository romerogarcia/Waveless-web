import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { register } from 'swiper/element/bundle';
import type { SwiperContainer } from 'swiper/element';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

register();

export interface HeroSlide {
  title: string;
  subtitle: string;
  image: string;
  /** Ruta del botón "Más información". Sin ella, el slide no muestra botón. */
  link?: string;
  /** Ancla dentro de la ruta (p. ej. el id de un grupo de destinos). */
  fragment?: string;
}

// Slides de la home. Otras páginas pasan las suyas por el input `slides`.
const HOME_SLIDES: HeroSlide[] = [
  {
    title: 'Tu próxima aventura en Asia',
    subtitle: 'Si te va la aventura, no te lo puedes perder',
    image: '/img/photos/hero-australia.webp',
    link: '/destinos',
  },
  {
    title: 'Trekking en el Himalaya',
    subtitle: 'Camina hasta el campo base del Everest',
    image: '/img/photos/hero-himalaya.webp',
    link: '/destinos',
    fragment: 'sur-de-asia',
  },
  {
    title: 'Kayak en la bahía de Ha Long',
    subtitle: 'Rema entre islotes de piedra caliza y duerme a bordo de un junco',
    image: '/img/photos/hero-halong.webp',
    link: '/destinos',
    fragment: 'sudeste-asiatico',
  },
];

@Component({
  selector: 'wl-hero',
  imports: [FaIconComponent, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero implements AfterViewInit {
  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;

  protected readonly swiperRef = viewChild<ElementRef<SwiperContainer>>('swiperEl');

  protected readonly paginationStyles = [
    `
    .swiper-pagination-bullet {
      align-items: center;
      background: transparent;
      display: inline-flex;
      height: 24px;
      justify-content: center;
      opacity: 1;
      width: 24px;
    }
    .swiper-pagination-bullet-active {
      background: transparent;
    }
    .swiper-pagination-bullet::after {
      background-color: transparent;
      border: 1.5px solid var(--color-white, #fff);
      border-radius: 50%;
      box-sizing: border-box;
      content: '';
      display: block;
      height: 10px;
      opacity: var(--swiper-pagination-bullet-inactive-opacity, 0.6);
      width: 10px;
    }
    .swiper-pagination-bullet-active::after {
      background-color: var(--swiper-pagination-color, var(--color-orange));
      opacity: 1;
    }
    `,
  ];

  readonly slides = input<HeroSlide[]>(HOME_SLIDES);
  // Nombre accesible del carrusel (aria-label de la sección).
  readonly label = input('Destacados');

  // Slide visible. Los demás se marcan como `inert` para que el teclado y los lectores
  // de pantalla no entren en contenido que no se ve.
  protected readonly activeIndex = signal(0);



  ngAfterViewInit(): void {
    const el = this.swiperRef()?.nativeElement;
    if (!el) {
      return;
    }
    // Configuración por propiedades en vez de atributos: así podemos pasar objetos
    // (textos de accesibilidad en español) antes de que Swiper se inicialice.
    Object.assign(el, {
      spaceBetween: 0,
      pagination: this.slides().length > 1 ? { clickable: true } : false,
      injectStyles: this.paginationStyles,
      a11y: {
        containerRoleDescriptionMessage: 'carrusel',
        itemRoleDescriptionMessage: 'diapositiva',
        slideLabelMessage: '{{index}} de {{slidesLength}}',
        paginationBulletMessage: 'Ir a la diapositiva {{index}}',
      },
    });
    el.initialize();
  }

  protected onSlideChange(event: Event): void {
    const [swiper] = (event as CustomEvent<[{ activeIndex: number }]>).detail;
    this.activeIndex.set(swiper.activeIndex);
  }

  protected slidePrev(): void {
    this.swiperRef()?.nativeElement.swiper?.slidePrev();
  }

  protected slideNext(): void {
    this.swiperRef()?.nativeElement.swiper?.slideNext();
  }
}
