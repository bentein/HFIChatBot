import { Component, AfterViewInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';
import * as $ from 'jquery';

@Component({
  selector: 'chatinput',
  templateUrl: './chatinput.component.html',
  styleUrls: ['../../../../node_modules/bootstrap/dist/css/bootstrap.css', './chatinput.component.css']
})
export class ChatinputComponent implements AfterViewInit {
  query:any;
  constructor(private data:DataManagerService) {
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
        this.data.show = false;
      }
    });
  }

  sendQuery(query) {
    query = query.trim();
    query = query.replace(/  /g," ");
    if(query !== "") {
      $("#inputDiv").text("");
      this.data.addMessage(query);

      if (this.data.conversationLogic.processMessage(this.data.activeContexts, query))
        this.data.triggerEvent(query);
      else
        this.data.sendQuery(query);
      console.log(query);
    }
  }

}
