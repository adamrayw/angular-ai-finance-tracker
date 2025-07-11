import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Transactions } from './pages/transactions/transactions';
import { Analytics } from './pages/analytics/analytics';
import { Layout } from './layout/layout';
import { Advisor } from './pages/advisor/advisor';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Dashboard
      },
      {
        path: 'transactions',
        component: Transactions
      },
      {
        path: 'analytics',
        component: Analytics
      },
      {
        path: 'advisor',
        component: Advisor
      }
    ]
  }
];
