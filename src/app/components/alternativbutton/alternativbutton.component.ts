import { Component, OnInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager/datamanager.service';
import { AlternativButtonLogicService } from '../../services/alternativbuttonlogic/alternativ-button-logic.service';
import { UtilService } from '../../services/util/util.service';

@Component({
  selector: 'alternativbuttons',
  templateUrl: './alternativbutton.component.html',
  styleUrls: ['./alternativbutton.component.css']
})
export class AlternativbuttonComponent implements OnInit {

  query:any;

  constructor(private data:DataManagerService, private alternativesHandler:AlternativButtonLogicService, private util: UtilService) { }

  ngOnInit() {
  }

  //Send alternativ btn message to Dialogflow
  sendQuery(query) {
    query = query.trim();
    query = query.replace(/ /g, " ");
    this.data.prependToNextQuery("");
    if(query !== "") {
      this.data.addMessage(query);
      this.data.sendQuery(query);

      this.util.toggleClass(".alternativ-btn", "alt-btn-in");
    }

    setTimeout(() => {
      this.alternativesHandler.deleteAllAlternatives();
    }, 100);
  }

}
