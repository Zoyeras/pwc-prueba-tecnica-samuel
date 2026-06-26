import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appCardNumber]',
  standalone: true,
})
export class CardNumberFormatDirective {
  constructor(private readonly el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();

    if (input.value !== formatted) {
      input.value = formatted;
    }

    if (digits.length === 16) {
      this.focusNext(input, 'expirationDate');
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
