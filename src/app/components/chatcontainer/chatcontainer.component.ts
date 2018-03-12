import { Component, OnInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';

@Component({
  selector: 'chatcontainer',
  templateUrl: './chatcontainer.component.html',
  styleUrls: ['./chatcontainer.component.css']
})
export class ChatcontainerComponent implements OnInit {

  constructor(private data:DataManagerService) { }

  ngOnInit() {
  }
}

