import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-typewriter',
  standalone: true,
  templateUrl: './typewriter.html',
  styleUrl: './typewriter.css'
})
export class Typewriter implements OnChanges {
  @Input() text: string = '';
  @Input() speed: number = 25; // typing speed (ms per character)

  displayedText: string = '';
  private index = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.startTyping();
    }
  }

  startTyping() {
    this.displayedText = '';
    this.index = 0;
    const interval = setInterval(() => {
      if (this.index < this.text.length) {
        this.displayedText += this.text[this.index];
        this.index++;
      } else {
        clearInterval(interval);
      }
    }, this.speed);
  }
}
