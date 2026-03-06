import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import News from "../../models/News";
import {DatabaseService} from "../../services/db.service";
import {SelectComponent} from "../select/select.component";

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  imports: [FormsModule, MatFormField, MatInput, MatLabel, SelectComponent],

  standalone: true
})
export class EditFormComponent implements OnInit {

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

  updateNews() {
    console.log('News item created:', this);
  }

}
