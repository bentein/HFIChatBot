import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { DataManagerService } from '../../services/datamanager.service';

@Component({
  selector: 'titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['../../../../node_modules/bootstrap/dist/css/bootstrap.css', './titlebar.component.css']
})
export class TitlebarComponent implements OnInit {

  constructor(private data:DataManagerService) { }

  ngOnInit() {
  }

  toggleChatBox($event) {
    this.data.toggleChatBox();
  }

  closeChatBox($event) {
    event.stopPropagation();
    $(".bottom-right-fix").toggleClass("close");
  }

}
