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
    console.log("open");
    $(".bottom-right-fix").toggleClass("show");
  }

  closeChatBox($event) {
    event.stopPropagation();
    console.log("close");
    //$(".bottom-right-fix").toggleClass("close");
    this.data.add({
      type: 'sent',
      content: 'test message'
    });
  }

}
