import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/db.service';
import News from '../../models/News';
import { CategorySelectComponent } from '../category-select/category-select.component';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css'],
  standalone: true,
  imports: [FormsModule, CategorySelectComponent],
})
export class CreateFormComponent implements OnInit {

  constructor(private database: DatabaseService) {}

  formData: Omit<News, 'id'> = {
    title: '',
    description: '',
    content: '',
    date_event: new Date().toISOString().substring(0, 10),
    category: '',
    location: '',
    image: null,
  };

  existingCategories: string[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.database.getNews().then((news) => {
      if (news) {
        this.existingCategories = this.extractUniqueCategories(news);
      }
    }).catch((error) => {
      console.error('Error loading categories:', error);
    });
  }

  onCategoryChange(category: string) {
    this.formData.category = category;
  }

  onCreate() {
    this.database.createNews(this.formData).then((news) => {
      console.log('Created news:', news);
      // Recharger les catégories après création (la nouvelle catégorie sera disponible)
      this.loadCategories();
    }).catch((error) => {
      console.error('Error creating news:', error);
    });
  }

  private extractUniqueCategories(newsList: News[]): string[] {
    const categories = newsList
      .map(n => n.category)
      .filter((cat): cat is string => !!cat && cat.trim() !== '');
    return [...new Set(categories)].sort();
  }
}
