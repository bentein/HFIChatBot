import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DataManagerService } from '../../services/datamanager.service';

@Component({
  selector: 'titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.css']
})
export class TitlebarComponent implements OnInit {

  constructor(private data:DataManagerService) { }

  ngOnInit() {
  }

  toggleChatBox($event) { 
    this.data.toggleChatBox();
    if(this.data.alternativesHandler.alternatives.length !== 0) {
      this.data.alternativesHandler.toggleShow();
    }
  }

  closeChatBox($event) {
    event.stopPropagation();
    $(".bottom-right-fix").toggleClass("close");
  }

}
