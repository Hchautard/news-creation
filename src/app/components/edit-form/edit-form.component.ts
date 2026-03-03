import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  imports: [FormsModule, MatFormField, MatInput, MatLabel],

  standalone: true
})
export class EditFormComponent {
  formData = {
    title: '',
    description: '',
    content: '',
    date_event: '',
    category: '',
    location: '',
    image: null,
  };

  updateNews() {
    console.log('News item created:', this);
  }

  cancelEdit() {
    console.log('Edit cancelled');
  }
}
