import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'Waveless · Aventura' },
  {
    path: 'destinos',
    loadComponent: () => import('./pages/destinations/destinations').then((m) => m.DestinationsPage),
    title: 'Waveless · Destinos',
  },
  {
    path: 'alojamiento',
    loadComponent: () =>
      import('./pages/accommodation/accommodation').then((m) => m.AccommodationPage),
    title: 'Waveless · Alojamiento',
  },
  {
    path: 'sobre-nosotros',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutPage),
    title: 'Waveless · Sobre nosotros',
  },
  { path: '**', redirectTo: '' },
];
