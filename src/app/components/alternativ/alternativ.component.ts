import { Component, OnInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';
import * as $ from 'jquery'

@Component({
  selector: 'alternativ',
  templateUrl: './alternativ.component.html',
  styleUrls: ['./alternativ.component.css']
})
export class AlternativComponent implements OnInit {

  query:any;
  constructor(private data:DataManagerService) { }

  ngOnInit() {
  }

  sendQuery(query) {
    console.log(query);
    query = query.trim();
    query = query.replace(/ /g, " ");
    if(query !== "") {
      this.data.addMessage(query);
      this.data.sendQuery(query);
      this.data.alternativesHandler.toggleShow();
      this.data.alternativesHandler.deleteAllAlternatives();
    }
  }
  

  
    
}
