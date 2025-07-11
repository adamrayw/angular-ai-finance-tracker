import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: string; // 'income' or 'expense'
}

@Injectable({
  providedIn: 'root'
})
export class Transaction {
  private apiUrl = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Transaction[]> {
    let req = this.http.get<Transaction[]>(this.apiUrl);
    return req;
  }

  create(tx: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, tx);
  }

  update(id: number, tx: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, tx);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAdvice(param: string): Observable<string> {
    return this.http.get<string>(`http://localhost:8080/api/advisor?param=${param}`, {
      params: { param },
      responseType: 'text' as 'json' // Ensure the response is treated as text
    });
  }

  getAdviceFromGemini(): Observable<string> {
    return this.http.get('http://localhost:8080/api/advisor/ai', { responseType: 'text' });
  }

}
