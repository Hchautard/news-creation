import {Component, OnInit} from '@angular/core';
import { CreateFormComponent } from './components/create-form/create-form.component';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import {RouterOutlet} from "@angular/router";

// Call db service to test connection
import { DatabaseService } from './services/db.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTabsModule, CreateFormComponent, EditFormComponent, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(
    private database: DatabaseService
  ) {}
  ngOnInit() {
    this.database.getNews().then((news) => {
      console.log(news)
    }).catch((error) => {
      console.error(error)
    })
  }
}
