import { Component, AfterViewInit } from '@angular/core';

import { DataManagerService } from '../../services/datamanager/datamanager.service';
import { ConversationLogicService } from '../../services/conversationlogic/conversation-logic.service';

import * as _ from 'lodash';
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
    document.getElementById("inputDiv").addEventListener("keydown", (e) => {
      if (e.keyCode == 27) {
        this.data.toggleChatBox();
      }
      if (e.keyCode == 13) {
        document.getElementById("sendButton").click();
        if(!e.shiftKey) {
          e.preventDefault();
        }
      } 
    });
  }

  // Send input message
  sendQuery(query) {
    query = _.escape(query);
    query = query.trim();
    query = query.replace(/  /g," ");
    if(query !== "") {
      query = encodeURIComponent(query);
      document.querySelector("#inputDiv").innerHTML = "";
      this.data.addMessage(query);
      this.data.sendQuery(query);
      this.alternativHandler.deleteAllAlternatives();
    }

    
  }

}
