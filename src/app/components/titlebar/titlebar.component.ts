import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DataManagerService } from '../../services/datamanager.service';
import { AlternativesService } from '../../services/alternatives.service';

@Component({
  selector: 'titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitlebarComponent implements OnInit {

  constructor(private data:DataManagerService, private alternativesHandler:AlternativesService) { }

  ngOnInit() {
  }

  toggleChatBox($event) { 
    this.data.toggleChatBox();
    if(this.alternativesHandler.alternatives.length !== 0) {
      this.alternativesHandler.toggleShow();
    }
  }

  closeChatBox($event) {
    event.stopPropagation();
    $(".bottom-right-fix").toggleClass("close");
  }

}
