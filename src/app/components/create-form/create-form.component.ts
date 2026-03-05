import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import { DatabaseService } from '../../services/db.service';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css'],
  standalone: true,

  imports: [FormsModule, MatFormField, MatInput, MatLabel]
})
export class CreateFormComponent {

  constructor(
    private database: DatabaseService
  ) {}

  formData = {
    title: '',
    description: '',
    content: '',
    date_event: '',
    category: '',
    location: '',
    image: null,
  };

  createNews() {
    this.database.createNews(this.formData).then((news) => {
      console.log(news)
    }).catch((error) => {
      console.error(error)
    })
  }
}
