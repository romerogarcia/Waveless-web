import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Modal } from './modal';

describe('Modal', () => {
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(Modal);
    fixture.componentRef.setInput('heading', 'Desglose de precios');
  });

  it('no pinta nada cerrado', async () => {
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('abierto, es un diálogo modal con título accesible', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    const dialog: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const heading = fixture.nativeElement.querySelector('#' + dialog.getAttribute('aria-labelledby'));
    expect(heading.textContent).toContain('Desglose de precios');
  });

  it('Escape emite close', async () => {
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    let closed = false;
    fixture.componentInstance.close.subscribe(() => (closed = true));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(closed).toBeTrue();
  });
});
