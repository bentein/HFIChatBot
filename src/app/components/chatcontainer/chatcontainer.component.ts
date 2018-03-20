import { Component, AfterViewInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';
import { AlternativesService } from '../../services/alternatives.service';

@Component({
  selector: 'chatcontainer',
  templateUrl: './chatcontainer.component.html',
  styleUrls: ['./chatcontainer.component.css']
})
export class ChatcontainerComponent implements AfterViewInit {

  constructor(private data:DataManagerService, private alternativesHandler:AlternativesService) { }

  ngAfterViewInit() {

  }
}

