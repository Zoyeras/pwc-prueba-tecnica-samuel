import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  Pencil,
  Trash2,
  User,
  CreditCard as CardIcon,
  Calendar,
  Key,
  Database,
  X,
} from 'lucide-angular';

import { CardsService } from '../services/cards.service';
import { CardNumberFormatDirective } from '../directives/card-number-format.directive';
import { ExpirationDateFormatDirective } from '../directives/expiration-date-format.directive';
import type { Card, CardCreate } from '../models/card.model';

@Component({
  selector: 'app-credit-card',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    CardNumberFormatDirective,
    ExpirationDateFormatDirective,
  ],
  templateUrl: './credit-card.html',
  styleUrl: './credit-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCard implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cardsService = inject(CardsService);

  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly User = User;
  readonly CardIcon = CardIcon;
  readonly Calendar = Calendar;
  readonly Key = Key;
  readonly Database = Database;
  readonly X = X;

  readonly cards = signal<Card[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly editingId = signal<number | null>(null);

  readonly form: FormGroup = this.fb.group({
    cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]],
    expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.cardsService.getAll().subscribe({
      next: (cards) => {
        this.cards.set(cards);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar las tarjetas.');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.toPayload(this.form);
    const id = this.editingId();

    const obs = id === null
      ? this.cardsService.create(payload)
      : this.cardsService.update(id, payload);

    const fallback = id === null
      ? 'No se pudo crear la tarjeta.'
      : 'No se pudo actualizar la tarjeta.';

    obs.subscribe({
      next: () => {
        this.editingId.set(null);
        this.form.reset();
        this.loadCards();
      },
      error: (err) => {
        this.errorMessage.set(this.extractError(err, fallback));
      },
    });
  }

  startEdit(card: Card): void {
    this.editingId.set(card.id);
    this.form.patchValue({
      cardHolderName: card.cardHolderName,
      cardNumber: this.formatCardNumber(card.cardNumber),
      expirationDate: this.formatExpirationFromIso(card.expirationDate),
      cvv: card.cvv,
    });
    this.form.markAsPristine();
    document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset();
  }

  deleteCard(id: number): void {
    if (this.editingId() === id) {
      this.cancelEdit();
    }
    this.cardsService.delete(id).subscribe({
      next: () => this.loadCards(),
      error: (err) => {
        this.errorMessage.set(this.extractError(err, 'No se pudo eliminar la tarjeta.'));
      },
    });
  }

  formatCardNumber(raw: string): string {
    return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }

  private toPayload(group: FormGroup): CardCreate {
    const raw = group.value;
    const [mm, yearRaw] = String(raw.expirationDate).split('/');
    const yearNum = yearRaw.length === 2 ? 2000 + Number(yearRaw) : Number(yearRaw);
    return {
      cardHolderName: raw.cardHolderName,
      cardNumber: String(raw.cardNumber).replace(/\s+/g, ''),
      expirationDate: new Date(yearNum, Number(mm) - 1, 1).toISOString(),
      cvv: raw.cvv,
    };
  }

  private formatExpirationFromIso(iso: string): string {
    const d = new Date(iso);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${yyyy}`;
  }

  fieldError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.touched || !control.errors) {
      return '';
    }
    const errors = control.errors;
    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['pattern']) {
      return field === 'cardHolderName'
        ? 'Mínimo 3 caracteres'
        : field === 'cardNumber'
          ? 'Debe tener 16 dígitos (XXXX XXXX XXXX XXXX)'
          : field === 'expirationDate'
            ? 'Formato MM/AA o MM/AAAA'
            : 'CVV debe tener 3 o 4 dígitos';
    }
    return 'Campo inválido';
  }

  private extractError(err: unknown, fallback: string): string {
    const e = err as { error?: { errors?: Record<string, string[]>; detail?: string; title?: string } };
    const errors = e?.error?.errors;
    if (errors) {
      const first = Object.values(errors)[0]?.[0];
      if (first) return first;
    }
    return e?.error?.detail ?? e?.error?.title ?? fallback;
  }
}
