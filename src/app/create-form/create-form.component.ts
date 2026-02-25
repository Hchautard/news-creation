import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css'],
  standalone: true,

  imports: [FormsModule, MatFormField, MatInput, MatLabel]
})
export class CreateFormComponent {
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
    console.log('News item created:', this);
  }
}
