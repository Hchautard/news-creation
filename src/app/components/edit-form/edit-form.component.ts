import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import News from "../../models/News";
import {DatabaseService} from "../../services/db.service";
import {SelectComponent} from "../select/select.component";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  imports: [FormsModule, SelectComponent],

  standalone: true
})
export class EditFormComponent implements OnInit {

  toastr = inject(ToastrService);

  constructor(
    private database: DatabaseService
  ) {
  }

  formData = {
    id: 0,
    title: '',
    description: '',
    content: '',
    date_event: Date.now().toString(),
    category: '',
    location: '',
    image: null,
  };

  newsList: News[] = [];

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.database.getNews().then((news) => {
      if (news) {
        this.newsList = news;
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  onNewsSelected(news: News) {
    let dateEvent: Date;
    dateEvent = new Date(news.date_event);

    this.formData = {
      id: news.id || 0,
      title: news.title,
      description: news.description,
      content: news.content,
      date_event: dateEvent.toISOString().substring(0, 10), // Format as YYYY-MM-DD for input[type="date"]
      category: news.category,
      location: news.location,
      image: null,
    };
  }

  onUpdate() {
    const payload: any = {};
    for (const [key, value] of Object.entries(this.formData)) {
      if (value !== null) {
        payload[key] = value;
      }
    }

    this.database.patchNews(payload)
      .then((updatedNews) => {
        if (updatedNews) {
          this.toastr.success('La mise à jour a réussi', 'Succès !');
          this.loadNews();
          this.onNewsSelected(updatedNews);
        }
      })
      .catch((error) => {
        this.toastr.error('La mise à jour a échoué', 'Erreur !');
        console.error(error);
      });
  }
}
