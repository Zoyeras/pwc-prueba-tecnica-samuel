export interface Card {
  id: number;
  cardHolderName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CardCreate {
  cardHolderName: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}

export type CardUpdate = CardCreate;
