import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [BaseChartDirective, FormsModule],
  templateUrl: './chart.html',
  styleUrl: './chart.css'
})
export class Chart {
  selectedPeriod = '30'; // Default to last 30 days

  // Chart data
  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Income',
        data: [],
        borderColor: '#10B981', // green-500
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Expenses',
        data: [],
        borderColor: '#EF4444', // red-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0
            }).format(Number(value));
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  chartPlugins = [];

  constructor() {
    this.loadChartData();
  }

  loadChartData() {
    // Replace this with your actual data fetching logic
    const days = this.selectedPeriod === '7' ? 7 : this.selectedPeriod === '30' ? 30 : 90;

    // Generate sample data - replace with your API call
    this.chartData.labels = this.generateDateLabels(days);
    this.chartData.datasets[0].data = this.generateRandomData(days, 500000, 5000000);
    this.chartData.datasets[1].data = this.generateRandomData(days, 200000, 3000000);

    // Trigger change detection
    this.chartData = { ...this.chartData };
  }

  updateChart() {
    this.loadChartData();
  }

  // Helper functions - replace with your actual data
  private generateDateLabels(days: number): string[] {
    const labels = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }));
    }
    return labels;
  }

  private generateRandomData(count: number, min: number, max: number): number[] {
    return Array.from({ length: count }, () =>
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  }
}
