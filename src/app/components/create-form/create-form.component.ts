import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { DatabaseService } from '../../services/db.service';
import News from "../../models/News";

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css'],
  standalone: true,

  imports: [FormsModule]
})
export class CreateFormComponent {

  constructor(
    private database: DatabaseService
  ) {}

  formData: Omit<News, 'id'> = {
    title: '',
    description: '',
    content: '',
    date_event: new Date().toISOString().substring(0, 10),
    category: '',
    location: '',
    image: null,
  };

  onCreate() {
    this.database.createNews(this.formData).then((news) => {
      console.log('Created news:', news);
    }).catch((error) => {
      console.error('Error creating news:', error);
    });
  }
}
