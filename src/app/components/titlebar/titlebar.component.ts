import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DataManagerService } from '../../services/datamanager/datamanager.service';
import { AlternativButtonLogicService } from '../../services/alternativbuttonlogic/alternativ-button-logic.service';

@Component({
  selector: 'titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitlebarComponent implements OnInit {

  constructor(private data:DataManagerService, private altHandler:AlternativButtonLogicService) { }

  ngOnInit() {}

  // Toogle chatbox 
  toggleChatBox($event) {
    this.data.toggleChatBox();
  }


  clearHistory($event) {
    $event.stopPropagation();
    this.data.clearMessages();
    this.altHandler.deleteAllAlternatives();
  }

  // Close 
  closeChatBox($event) {
    event.stopPropagation();
    this.data.hideApplication = true;
  }

}
