import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import News from '../../models/News';

@Component({
  selector: 'app-preview-modal',
  templateUrl: './preview-modal.component.html',
  styleUrls: ['./preview-modal.component.css'],
  standalone: true,
})
export class PreviewModalComponent {
  @Input() news!: Partial<News>;
  @Output() close = new EventEmitter<void>();

  private sanitizer = inject(DomSanitizer);

  get formattedDate(): string {
    if (!this.news.date_event) return '';
    return new Date(this.news.date_event).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  get renderedContent(): SafeHtml {
    const raw = this.news.content || this.news.description || '';
    return this.sanitizer.bypassSecurityTrustHtml(this.parseMarkdown(raw));
  }

  getCoverBackground(): string {
    const cat = (this.news.category || '').toLowerCase();
    if (cat.includes('illu')) {
      return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
    }
    if (cat.includes('évén') || cat.includes('even') || cat.includes('éven')) {
      return 'linear-gradient(135deg, #1b2d1b 0%, #1f5c2e 50%, #1b2d1b 100%)';
    }
    return 'linear-gradient(135deg, #2d1010 0%, #5c1a1a 50%, #3d1212 100%)';
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('preview-overlay')) {
      this.close.emit();
    }
  }

  private parseMarkdown(text: string): string {
    if (!text.trim()) {
      return '<p class="news-preview-empty">Aucun contenu à afficher.</p>';
    }

    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    const blocks = html.split(/\n\n+/);
    html = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<h[1-6]/.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).filter(Boolean).join('\n');

    return html;
  }
}
