import { Component, OnInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager/datamanager.service';
import { AlternativButtonLogicService } from '../../services/alternativbuttonlogic/alternativ-button-logic.service';
import * as $ from 'jquery';

@Component({
  selector: 'alternativbuttons',
  templateUrl: './alternativbutton.component.html',
  styleUrls: ['./alternativbutton.component.css']
})
export class AlternativbuttonComponent implements OnInit {

  query:any;

  constructor(private data:DataManagerService, private alternativesHandler:AlternativButtonLogicService) { }

  ngOnInit() {
  }

  //Send alternativ btn message to Dialogflow
  sendQuery(query) {
    query = query.trim();
    query = query.replace(/ /g, " ");
    if(query !== "") {
      this.data.addMessage(query);
      this.data.sendQuery(query);

      $(".alternativ-btn").toggleClass("alt-btn-out");
      $(".alternativ-btn").toggleClass("alt-btn-in");
    }

    setTimeout(() => {
      this.alternativesHandler.deleteAllAlternatives();
      console.log("Alt Slettet");
    }, 100);
  }

}
