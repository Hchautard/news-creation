import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DatabaseService } from '../../services/db.service';
import News from '../../models/News';
import { CategorySelectComponent } from '../category-select/category-select.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css'],
  standalone: true,
  imports: [FormsModule, CategorySelectComponent],
})
export class CreateFormComponent implements OnInit {
  toastr = inject(ToastrService);
  isSubmitting = false;

  @ViewChild('newsForm') newsForm!: NgForm;

  constructor(private database: DatabaseService) {}

  formData: Omit<News, 'id'> = this.emptyForm();
  existingCategories: string[] = [];

  ngOnInit() {
    this.loadCategories();
  }

  private emptyForm(): Omit<News, 'id'> {
    return {
      title: '',
      description: '',
      content: '',
      date_event: new Date().toISOString().substring(0, 10),
      category: '',
      location: '',
      image: null,
    };
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
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.database.createNews(this.formData).then(() => {
      this.toastr.success('La news a été créée avec succès', 'Succès !');
      this.loadCategories();
      this.formData = this.emptyForm();
      this.newsForm.resetForm({ date_event: this.formData.date_event });
    }).catch((error) => {
      this.toastr.error('La création a échoué', 'Erreur !');
      console.error('Error creating news:', error);
    }).finally(() => {
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
