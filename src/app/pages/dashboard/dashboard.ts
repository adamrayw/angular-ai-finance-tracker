import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Transaction } from '../../services/transaction';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Chart } from '../../components/chart/chart';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, NgClass, DatePipe, RouterLink, Chart],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  recentTransactions: Transaction[] = [];
  lastUpdated: Date = new Date();

  summary: {
    totalIncome: number,
    totalExpenses: number,
    balance: number
  } | null = null;

  private routerSub!: Subscription;

  constructor(
    private txService: Transaction,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to router events to detect navigation changes
    this.loadTransactions();
    this.getRecentTransactions();

    // 👇 Tambahkan ini
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url === '/dashboard') {
        this.loadTransactions();
        this.getRecentTransactions();
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the router events to prevent memory leaks
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  loadTransactions(): void {
    this.txService.getAll().subscribe(data => {
      console.log("Fetched transactions:", data); // ⬅️ Tambahkan ini
      this.transactions = data;
      this.calculateSummary();
      // 🚨 Perbaikan untuk ng-lifecycle update
      setTimeout(() => {
        this.cdr.detectChanges();
      });
    });
  }

  calculateSummary() {
    console.log('Calculating summary for transactions:', this.transactions);

    const income = this.transactions
      .filter(tx => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenses = this.transactions
      .filter(tx => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + tx.amount, 0);

    this.summary = {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    };

    console.log('Summary calculated:', this.summary);

  }

  getRecentTransactions(): void {
    this.txService.getRecentTransactions().subscribe(data => {
      this.recentTransactions = data;
      this.cdr.detectChanges();
    });
  }
}
