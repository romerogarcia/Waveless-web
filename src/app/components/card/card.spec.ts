import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Card } from './card';
import { DESTINATION_GROUPS } from '../../data/asia';

describe('Card', () => {
  let fixture: ComponentFixture<Card>;
  const destination = DESTINATION_GROUPS[0].items[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(Card);
    fixture.componentRef.setInput('destination', destination);
    await fixture.whenStable();
  });

  it('pinta los datos del destino', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.card__title')?.textContent).toContain(destination.title);
    expect(el.querySelector('img')?.getAttribute('alt')).toBe(destination.imageAlt);
    expect(el.querySelector('img')?.getAttribute('loading')).toBe('lazy');
  });

  it('el botón "Reservar" incluye el nombre del destino para lectores de pantalla', () => {
    const button = [...fixture.nativeElement.querySelectorAll('button')].find((b: HTMLButtonElement) =>
      b.textContent?.includes('Reservar'),
    ) as HTMLButtonElement;
    expect(button.textContent?.replace(/\s+/g, ' ').trim()).toBe(`Reservar ${destination.title}`);
  });

  it('"Reservar" abre el diálogo de reserva', async () => {
    const button = [...fixture.nativeElement.querySelectorAll('button')].find((b: HTMLButtonElement) =>
      b.textContent?.includes('Reservar'),
    ) as HTMLButtonElement;
    button.click();
    await fixture.whenStable();
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog?.textContent).toContain('Solicitud de reserva');
  });
});
