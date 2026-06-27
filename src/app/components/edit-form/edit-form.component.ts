import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import News from '../../models/News';
import { DatabaseService } from '../../services/db.service';
import { SelectComponent } from '../select/select.component';
import { CategorySelectComponent } from '../category-select/category-select.component';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  imports: [FormsModule, SelectComponent, CategorySelectComponent, PreviewModalComponent],
  standalone: true,
})
export class EditFormComponent implements OnInit {
  toastr = inject(ToastrService);
  isSubmitting = false;
  selectedNews: News | null = null;
  showPreview = false;

  constructor(private database: DatabaseService) {}

  formData = this.emptyForm();
  newsList: News[] = [];
  existingCategories: string[] = [];

  ngOnInit() {
    this.loadNews();
  }

  private emptyForm() {
    return {
      id: 0,
      title: '',
      description: '',
      content: '',
      date_event: new Date().toISOString().substring(0, 10),
      category: '',
      location: '',
      image: null as File | null,
    };
  }

  loadNews() {
    this.database.getNews().then((news) => {
      if (news) {
        this.newsList = news;
        this.existingCategories = this.extractUniqueCategories(news);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  onNewsSelected(news: News) {
    this.selectedNews = news;
    const dateEvent = new Date(news.date_event);
    this.formData = {
      id: news.id || 0,
      title: news.title,
      description: news.description,
      content: news.content,
      date_event: dateEvent.toISOString().substring(0, 10),
      category: news.category,
      location: news.location,
      image: null,
    };
  }

  onCategoryChange(category: string) {
    this.formData.category = category;
  }

  onCancel() {
    if (this.selectedNews) {
      this.onNewsSelected(this.selectedNews);
    }
  }

  onUpdate() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const payload: Partial<News> = {};
    for (const [key, value] of Object.entries(this.formData)) {
      if (value !== null) {
        (payload as any)[key] = value;
      }
    }

    this.database.patchNews(payload)
      .then((updatedNews) => {
        if (updatedNews) {
          this.toastr.success('La mise à jour a réussi', 'Succès !');
          this.selectedNews = updatedNews;
          this.loadNews();
          this.onNewsSelected(updatedNews);
        }
      })
      .catch((error) => {
        this.toastr.error('La mise à jour a échoué', 'Erreur !');
        console.error(error);
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  private extractUniqueCategories(newsList: News[]): string[] {
    const categories = newsList
      .map(n => n.category)
      .filter((cat): cat is string => !!cat && cat.trim() !== '');
    return [...new Set(categories)].sort();
  }
}
