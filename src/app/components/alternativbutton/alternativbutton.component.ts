import { Component, OnInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager/datamanager.service';
import { AlternativButtonLogicService } from '../../services/alternativbuttonlogic/alternativ-button-logic.service';

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

  sendQuery(query) {
    console.log(query);
    query = query.trim();
    query = query.replace(/ /g, " ");
    if(query !== "") {
      this.data.addMessage(query);
      this.data.sendQuery(query);
      this.alternativesHandler.deleteAllAlternatives();
    }
  }

}
