import { Component, OnInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';
import * as $ from 'jquery'
import { AlternativesService } from '../../services/alternatives.service';

@Component({
  selector: 'alternativ',
  templateUrl: './alternativ.component.html',
  styleUrls: ['./alternativ.component.css']
})
export class AlternativComponent implements OnInit {

  query:any;
  constructor(private data:DataManagerService, private alternativesHandler:AlternativesService) { }

  ngOnInit() {
  }

  sendQuery(query) {
    console.log(query);
    query = query.trim();
    query = query.replace(/ /g, " ");
    if(query !== "") {
      this.data.addMessage(query);
      this.data.sendQuery(query);
      this.alternativesHandler.toggleShow();
      this.alternativesHandler.deleteAllAlternatives();
    }
  }
  

  
    
}
