import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DataManagerService } from '../../services/datamanager/datamanager.service';

@Component({
  selector: 'titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitlebarComponent implements OnInit {

  constructor(private data:DataManagerService) { }

  ngOnInit() {}

  // Toogle chatbox 
  toggleChatBox($event) {
    this.data.toggleChatBox();
  }

  clearHistory($event) {
    $event.stopPropagation();
    this.data.clearMessages();
  }

  // Close 
  closeChatBox($event) {
    $event.stopPropagation();
    this.data.hideApplication = true;
  }

}
