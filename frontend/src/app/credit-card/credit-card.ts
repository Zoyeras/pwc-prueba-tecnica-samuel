import { Component, inject } from '@angular/core';
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
} from 'lucide-angular';

@Component({
  selector: 'app-credit-card',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './credit-card.html',
  styleUrl: './credit-card.css',
})
export class CreditCard {
  private readonly fb = inject(FormBuilder);

  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly User = User;
  readonly CardIcon = CardIcon;
  readonly Calendar = Calendar;
  readonly Key = Key;
  readonly Database = Database;

  listCards: any[] = [
    { namePerson: 'Gonzales Prieto', numberCard: '1234 5678 9012 3456', expirationDate: '12/24' },
    { namePerson: 'Juan Perez', numberCard: '5478 4478 1234 5678', expirationDate: '12/24' },
    { namePerson: 'Maria Gonzalez', numberCard: '5869 2145 1234 5678', expirationDate: '12/24' },
  ];

  readonly form: FormGroup = this.fb.group({
    titular: ['', [Validators.required, Validators.minLength(3)]],
    numero: ['', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]],
    fecha: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.listCards.push({
      namePerson: this.form.value.titular,
      numberCard: this.form.value.numero,
      expirationDate: this.form.value.fecha,
      cvv: this.form.value.cvv,
    });
    console.log('Tarjeta:', this.form.value);
    this.form.reset();
  }
}
