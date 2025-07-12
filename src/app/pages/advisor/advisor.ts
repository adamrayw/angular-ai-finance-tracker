import { ChangeDetectorRef, Component } from '@angular/core';
import { Transaction } from '../../services/transaction';
import { CommonModule } from '@angular/common';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-advisor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advisor.html',
  styleUrl: './advisor.css'
})
export class Advisor {
  advice: SafeHtml = '';
  fullAdvice: string = '';
  loading: boolean = false;
  typingIndex: number = 0;
  typingSpeed: number = 20;

  constructor(
    private txService: Transaction,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  fetchAdvice(): void {
    this.loading = true;
    this.advice = '';
    this.fullAdvice = '';
    this.typingIndex = 0;

    this.txService.getAdviceFromGemini().subscribe({
      next: (response: string) => {
        this.fullAdvice = response;
        this.startTyping();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching advice:', error);
        this.advice = this.sanitizer.bypassSecurityTrustHtml('Gagal mengambil saran.');
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private async processMarkdownChunk(text: string): Promise<string> {
    // Convert markdown to HTML
    let html = await marked.parse(text);

    // Clean up and format
    html = html.replace(/<p>/g, '<p class="paragraph">')
      .replace(/<ul>/g, '<ul class="list">');

    return html;
  }

  startTyping(): void {
    const interval = setInterval(async () => {
      if (this.typingIndex < this.fullAdvice.length) {
        const chunk = this.fullAdvice.substring(0, ++this.typingIndex);
        this.advice = this.sanitizer.bypassSecurityTrustHtml(
          await this.processMarkdownChunk(chunk)
        );
        this.cdr.markForCheck();
        this.scrollToBottom();
      } else {
        clearInterval(interval);
      }
    }, this.typingSpeed);
  }

  // Tambahkan method untuk auto-scroll
  private scrollToBottom(): void {
    setTimeout(() => {
      const element = document.querySelector('.markdown-content');
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, 0);
  }
}
