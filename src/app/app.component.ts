import {Component, OnInit} from '@angular/core';
import {CreateFormComponent} from './components/create-form/create-form.component';
import {EditFormComponent} from './components/edit-form/edit-form.component';
import {ManageFormComponent} from './components/manage-form/manage-form.component';
import {MatTabsModule} from '@angular/material/tabs';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTabsModule, CreateFormComponent, EditFormComponent, ManageFormComponent, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  activeTab = 0;
}
