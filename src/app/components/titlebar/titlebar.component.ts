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

  // Toogle chatbox, show variable in DataManagerService false | true.
  toggleChatBox($event) {
    this.data.toggleChatBox();
  }


  // Clear chat history. Delete all messages and alternativ-buttons.
  clearHistory($event) {
    $event.stopPropagation();
    this.data.clearMessages();
    this.altHandler.deleteAllAlternatives();
  }

  // Close. Hide the application.
  closeChatBox($event) {
    event.stopPropagation();
    this.data.hideApplication = true;
  }

  feedback($event) {
    event.stopPropagation();
    this.data.sendEvent("feedback");
  }

}
