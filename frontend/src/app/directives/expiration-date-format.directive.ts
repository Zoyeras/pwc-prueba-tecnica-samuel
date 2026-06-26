import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appExpirationDate]',
  standalone: true,
})
export class ExpirationDateFormatDirective {
  constructor(private readonly el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 7);
    let formatted = digits;

    if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length === 2) {
      formatted = `${digits}/`;
    }

    if (input.value !== formatted) {
      input.value = formatted;
    }

    if (formatted.length === 5 || formatted.length === 7) {
      this.focusNext(input, 'cvv');
    }
  }

  private focusNext(current: HTMLInputElement, nextName: string): void {
    const form = current.closest('form');
    const next = form?.querySelector<HTMLInputElement>(
      `input[formControlName="${nextName}"]`,
    );
    next?.focus();
  }
}
