import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type { Card, CardCreate, CardUpdate } from '../models/card.model';

@Injectable({ providedIn: 'root' })
export class CardsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/cards';

  getAll(): Observable<Card[]> {
    return this.http.get<Card[]>(this.baseUrl);
  }

  getById(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.baseUrl}/${id}`);
  }

  create(payload: CardCreate): Observable<Card> {
    return this.http.post<Card>(this.baseUrl, payload);
  }

  update(id: number, payload: CardUpdate): Observable<Card> {
    return this.http.put<Card>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
