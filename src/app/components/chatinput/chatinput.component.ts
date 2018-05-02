import { Component, AfterViewInit } from '@angular/core';

import { DataManagerService } from '../../services/datamanager/datamanager.service';
import { ConversationLogicService } from '../../services/conversationlogic/conversation-logic.service';

import * as $ from 'jquery';
import { AlternativButtonLogicService } from '../../services/alternativbuttonlogic/alternativ-button-logic.service';

@Component({
  selector: 'chatinput',
  templateUrl: './chatinput.component.html',
  styleUrls: ['./chatinput.component.css']
})
export class ChatinputComponent implements AfterViewInit {
  query:any;
  constructor(private data:DataManagerService, private alternativHandler:AlternativButtonLogicService) {
  }

  ngAfterViewInit() {
    $("#inputDiv").keypress((e) => {
      if (e.keyCode == 13) {
        $(".btn").click();
      } 
      return e.which != 13;
    });
    $("#inputDiv").keydown((e) => {
      if (e.keyCode == 27) {
        this.data.toggleChatBox();
      }
    });
  }

  // Send input message to dialogflow
  sendQuery(query) {
    query = query.trim();
    query = query.replace(/  /g," ");
    if(query !== "") {
      $("#inputDiv").text("");
      this.data.addMessage(query);
      this.data.sendQuery(query);
      console.log(query);
    }
  }

}
