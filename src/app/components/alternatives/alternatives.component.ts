import { Component, OnInit, Input } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';
import * as $ from 'jquery'
import { AlternativesService } from '../../services/alternatives.service';

@Component({
  selector: 'alternatives',
  templateUrl: './alternatives.component.html',
  styleUrls: ['./alternatives.component.css']
})
export class AlternativesComponent implements OnInit {

  query:any;
  constructor(private data:DataManagerService, private alternativesHandler:AlternativesService) {}

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
      setTimeout(() => {
        this.alternativesHandler.deleteAllAlternatives();
      }, 200);
    }
  }
}