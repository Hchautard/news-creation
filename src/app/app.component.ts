import { Component } from '@angular/core';
import { CreateFormComponent } from './create-form/create-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTabsModule, CreateFormComponent, EditFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
