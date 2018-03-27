import { Component, AfterViewInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager/datamanager.service';

@Component({
  selector: 'chatcontainer',
  templateUrl: './chatcontainer.component.html',
  styleUrls: ['./chatcontainer.component.css']
})
export class ChatcontainerComponent implements AfterViewInit {

  constructor(private data:DataManagerService) { }

  ngAfterViewInit() {

  }
}

