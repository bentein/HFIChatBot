import { Component } from '@angular/core';
import { DataManagerService } from './services/datamanager/datamanager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private data:DataManagerService) {

  }
}
