import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreditCard} from './credit-card/credit-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreditCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('app');
}
