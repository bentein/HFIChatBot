import { Component, AfterViewInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';

@Component({
  selector: 'chatcontainer',
  templateUrl: './chatcontainer.component.html',
  styleUrls: ['../../../../node_modules/bootstrap/dist/css/bootstrap.css', './chatcontainer.component.css']
})
export class ChatcontainerComponent implements AfterViewInit {

  constructor(private data:DataManagerService) { }

  ngAfterViewInit() {

  }
}

