# Waveless

## Descripción

Web de una agencia de viajes de aventura por Asia, construida como una app **Angular 20** con rutas, componentes reutilizables y signals para todo el estado. Tiene cuatro páginas:

| Ruta | Página |
|---|---|
| `/` | **Aventura** (home): carrusel, destinos destacados y filtros funcionales |
| `/destinos` | Destinos por región: Japón, Corea del Sur, Sudeste Asiático y Sur de Asia |
| `/alojamiento` | Alojamientos con encanto: ryokans, hanoks, havelis, bungalows… |
| `/sobre-nosotros` | Historia y valores de la agencia |

## Instalación

```
npm install
npm start
```

Entorno: `http://localhost:4200`.

### Otros comandos

| Comando | Qué hace |
|---|---|
| `npm test` | Tests unitarios (Karma + Jasmine) |
| `npm run build` | Build de producción en `dist/waveless/browser` |
| `npm run build:pages` | Build + copia `index.html` a `404.html` para publicar en GitHub Pages (así funcionan las rutas al recargar) |

## Estructura del proyecto

```
src/
├─ index.html
├─ styles.scss                  paleta, breakpoints, botones, .sr-only y enlace "Saltar al contenido"
└─ app/
   ├─ app.html / app.ts          cabecera + <router-outlet> + pie
   ├─ app.routes.ts              rutas (las páginas se cargan bajo demanda)
   ├─ app.config.ts              router y detección de cambios sin zone.js
   ├─ pages/                     una carpeta por página (home, destinations, accommodation, about)
   ├─ layout/
   │  ├─ header/                 logo, nav con enlace activo, botón "Reserva", menú hamburguesa
   │  └─ footer/
   ├─ features/home/
   │  ├─ hero/                   carrusel (Swiper) reutilizado en varias páginas
   │  ├─ filters/                filtros + filter.store.ts (estado compartido de los filtros)
   │  └─ filter-results/         resultados filtrados agrupados en wl-card-group
   ├─ components/
   │  ├─ card/                   tarjeta de destino con desglose y reserva
   │  ├─ card-group/             título de grupo + rejilla de tarjetas
   │  ├─ card-price-details/     desglose de precios
   │  ├─ modal/                  modal/popover genérico (anclado, lateral o centrado)
   │  ├─ tooltip/                tooltip genérico
   │  ├─ icon/
   │  └─ title/                  título principal (h1) + subtítulo de cada página
   ├─ services/
   │  └─ destinations.service.ts acceso único a los datos
   ├─ data/asia.ts               destinos y alojamientos de ejemplo
   ├─ models/destination.ts      modelo de datos de un destino
   └─ utils/                     formatPrice, slugify
public/
└─ img/photos/                  fotos optimizadas en WebP
```

`features/` agrupa los bloques propios de la home y `components/` las piezas genéricas que se reutilizan en varias páginas.

## Decisiones técnicas

- **Angular 20**, standalone components, signals para todo el estado (`signal`, `computed`, `input`, `output`, `effect`, `viewChild`).
- **Zoneless + OnPush**: la app funciona sin `zone.js` (`provideZonelessChangeDetection`) y todos los componentes usan `ChangeDetectionStrategy.OnPush`. Como el estado está en signals, Angular repinta solo lo que cambia.
- **Rutas con carga diferida**: cada página se descarga cuando se visita. El título de la pestaña cambia por ruta y el router vuelve arriba al navegar y respeta las anclas (`/destinos#japon`).
- **Datos desacoplados**: los componentes no importan los datos directamente, los piden a `DestinationsService`. Para conectar una API real solo habría que cambiar el servicio.
- **Filtros funcionales**: `FilterStore` guarda el estado de los filtros y se provee en la página de inicio, así `wl-filters` (que escribe) y `wl-filter-results` (que lee) comparten estado sin conocerse. La regla de filtrado es una función pura (`matchesFilters`) fácil de testear: las opciones de una misma sección suman (O) y las secciones se combinan entre sí (Y).
- **Sass** por componente con **BEM**. Paleta y breakpoints (`$breakpoint-tablet`, `$breakpoint-desktop`, `$breakpoint-wide`) centralizados en `styles.scss` y usados con `@use 'styles' as bp;` gracias a `stylePreprocessorOptions.includePaths: ["src"]`.
- **Tipografía en `rem`** para que el texto escale con el ajuste de tamaño del navegador.
- **Sistema de botones**: `.btn-primary` / `.btn-secondary` centralizan lo común (radio, cursor, tipografía, peso) y dejan el color a cada botón.
- **Modal reutilizable** (`components/modal`) con tres variantes: anclado (desglose de precios), lateral (filtros en móvil) y centrado (reserva).
- **Carrusel**: Swiper 14 en su versión Web Components (`swiper/element/bundle`), configurado desde código para poder pasarle los textos de accesibilidad en español.
- **Imágenes optimizadas**: WebP redimensionadas (tarjetas a 800 px y heros a 1600 px), con `loading="lazy"`, `decoding="async"` y `width`/`height` para evitar saltos de maquetación. Cada página carga entre 0,2 y 1,2 MB de imágenes.

## Accesibilidad

Revisada con axe (WCAG 2.2 AA, 0 incidencias) y probada con teclado en escritorio y móvil.

- **Estructura**: un único `<h1>` por página y jerarquía de encabezados ordenada. Los grupos de tarjetas son listas (`<ul>`).
- **Teclado**: enlace "Saltar al contenido", foco visible, Escape cierra el menú móvil (y devuelve el foco al botón hamburguesa), los modales y los tooltips.
- **Carrusel**: solo la diapositiva visible es enfocable (el resto lleva `inert`), puntos de paginación con área táctil de 24×24 px y etiquetas en español ("Ir a la diapositiva 2").
- **Modales** con `role="dialog"`, `aria-modal`, título asociado, focus trap y foco devuelto al botón que los abrió. Los botones que los abren llevan `aria-haspopup="dialog"`.
- **Nombres únicos**: "Reservar" y "Ver desglose" incluyen el destino para lectores de pantalla ("Reservar Amanecer en el monte Fuji"), igual que los tooltips de los filtros.
- **Resultados**: al cambiar un filtro, un `role="status"` anuncia cuántos destinos hay.
- **Imágenes**: texto alternativo descriptivo en las fotos de las tarjetas; las imágenes decorativas llevan `alt=""`.
- Contraste AA en la paleta de `styles.scss` y tipografía en `rem`.

## Notas

- Es una web de demostración: "Reservar" muestra un resumen de la selección pero no hace reservas reales.
- Las imágenes e iconos usan rutas absolutas (`/img/...`, `/icons/...`), así que la web debe publicarse en la raíz de un dominio. Si se publica en una subcarpeta (por ejemplo `usuario.github.io/waveless-web/`), habría que ajustar esas rutas y el `--base-href`.
