import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Transaction } from '../../services/transaction';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-transactions',
  imports: [DecimalPipe, ReactiveFormsModule, NgClass],
  standalone: true,
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions implements OnInit {
  transactions: Transaction[] = [];
  form: FormGroup;
  editMode: boolean = false;
  editingId: number | null = null;
x: any;

  constructor(
    private txService: Transaction,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      type: ['INCOME', Validators.required] // 'income' or 'expense'
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.txService.getAll().subscribe(data => {
      this.transactions = data;
      this.cdr.markForCheck(); // Ensure the view is updated
    });
  }

  addTransaction(tx: Transaction): void {
    console.log('Adding transaction:', tx);
    this.txService.create(tx).subscribe(newTx => {
      this.transactions.push(newTx);
      this.form.reset();
    });
  }

  startEditTransaction(tx: Transaction): void {
    this.form.patchValue(tx); // Populate the form with the transaction data
    this.editMode = true;
    this.editingId = tx.id; // Set the ID of the transaction being edited
    // console.log('Editing transaction:', tx);
    // console.log('Editing ID:', this.editingId);
    // console.log('Form value before edit:', this.form.value);
    // console.log('Form value after edit:', this.form.value);
    // console.log('Edit mode:', this.editMode);
  }


  submitTransaction(): void {
    if (this.form.invalid) return;

    const tx: Transaction = this.form.value;

    if (this.editMode && this.editingId !== null) {
      this.txService.update(this.editingId, tx).subscribe({
        next: updatedTx => {
          const index = this.transactions.findIndex(t => t.id === this.editingId);
          this.transactions[index] = updatedTx;
          this.editMode = false;
          this.form.reset();
          this.editingId = null;
          this.cdr.markForCheck();
        },
        error: err => console.error('Error updating transaction:', err)
      });
    } else {
      this.addTransaction(tx);
      this.cdr.markForCheck();
    }
  }

  editTransaction(id: number, updatedTx: Transaction): void {
    this.txService.update(id, updatedTx).subscribe({
      next: () => {
        this.form.patchValue({
          date: updatedTx.date,
          description: updatedTx.description,
          amount: updatedTx.amount,
          type: updatedTx.type
        });
        this.cdr.markForCheck();
      },
      error: err => console.error(`Error updating transaction with id ${id}:`, err)
    })
  }

  deleteTransaction(id: number): void {
    this.txService.delete(id).subscribe({
      next: () => {
        this.transactions = this.transactions.filter(tx => tx.id !== id);
        this.cdr.markForCheck();
      },
      error: err => console.error(`Error deleting transaction with id ${id}:`, err)
    });
  }

}
