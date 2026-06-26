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
  Save,
  X,
} from 'lucide-angular';

import { CardsService } from '../services/cards.service';
import type { Card, CardCreate } from '../models/card.model';

@Component({
  selector: 'app-credit-card',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
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
  readonly Save = Save;
  readonly X = X;

  readonly cards = signal<Card[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly editingId = signal<number | null>(null);

  readonly form: FormGroup = this.fb.group({
    cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{13,19}$/)]],
    expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/(20)\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  readonly editForm: FormGroup = this.fb.group({
    cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{13,19}$/)]],
    expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/(20)\d{2}$/)]],
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
    this.cardsService.create(payload).subscribe({
      next: () => {
        this.form.reset();
        this.loadCards();
      },
      error: (err) => {
        this.errorMessage.set(this.extractError(err, 'No se pudo crear la tarjeta.'));
      },
    });
  }

  startEdit(card: Card): void {
    this.editingId.set(card.id);
    const exp = this.formatExpirationFromIso(card.expirationDate);
    this.editForm.patchValue({
      cardHolderName: card.cardHolderName,
      cardNumber: card.cardNumber.replace(/\s+/g, ''),
      expirationDate: exp,
      cvv: card.cvv,
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editForm.reset();
  }

  saveEdit(id: number): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const payload = this.toPayload(this.editForm);
    this.cardsService.update(id, payload).subscribe({
      next: () => {
        this.editingId.set(null);
        this.editForm.reset();
        this.loadCards();
      },
      error: (err) => {
        this.errorMessage.set(this.extractError(err, 'No se pudo actualizar la tarjeta.'));
      },
    });
  }

  deleteCard(id: number): void {
    this.cardsService.delete(id).subscribe({
      next: () => this.loadCards(),
      error: (err) => {
        this.errorMessage.set(this.extractError(err, 'No se pudo eliminar la tarjeta.'));
      },
    });
  }

  private toPayload(group: FormGroup): CardCreate {
    const raw = group.value;
    const [mm, yyyy] = String(raw.expirationDate).split('/');
    return {
      cardHolderName: raw.cardHolderName,
      cardNumber: String(raw.cardNumber).replace(/\s+/g, ''),
      expirationDate: new Date(Number(yyyy), Number(mm) - 1, 1).toISOString(),
      cvv: raw.cvv,
    };
  }

  private formatExpirationFromIso(iso: string): string {
    const d = new Date(iso);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${yyyy}`;
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
