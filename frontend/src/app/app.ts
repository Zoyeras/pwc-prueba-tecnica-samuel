import { Component } from '@angular/core';
import { CreditCard } from './credit-card/credit-card';

@Component({
  selector: 'app-root',
  imports: [CreditCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
