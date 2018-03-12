import { Component, AfterViewInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';
import * as $ from 'jquery';

@Component({
  selector: 'chatinput',
  templateUrl: './chatinput.component.html',
  styleUrls: ['./chatinput.component.css']
})
export class ChatinputComponent implements AfterViewInit {
  query:any;
  constructor(private data:DataManagerService) {
  }

  ngAfterViewInit() {
    $("#inputDiv").keypress(function(e){
      if (e.which == 13) {
        $(".btn").click();
      }
      return e.which != 13;
    });
  }

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
