import { Component, AfterViewInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager/datamanager.service';

import { Message, getDay } from '../../classes/message';

import * as $ from 'jquery';
import * as tippy from 'tippy.js';
import { AlternativButtonLogicService } from '../../services/alternativbuttonlogic/alternativ-button-logic.service';

@Component({
  selector: 'chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements AfterViewInit {

  constructor(private data: DataManagerService, private alternativHandler: AlternativButtonLogicService) {}

  ngAfterViewInit() {
    setTimeout(() => this.scrollToBottom(true), 100);
    //this.scrollToBottom(true);

    $(".chat-box").on('scroll', () => {
      const elems:any = document.querySelectorAll('.tippy-popper');
      for (let i = 0; i < elems.length; i++ ) {
        const instance = elems[i]._tippy;
        if (instance.state.visible) {
          instance.popperInstance.disableEventListeners();
          instance.hide();
        }
      }
    });

    setTimeout(()=>this.data.updateTooltips(),200);
  }

  scrollToBottom(force?) {
    if (force) {
      $('.chat-box').scrollTop($('.chat-box')[0].scrollHeight);
    } else if (this.data.newMessages) {
      setTimeout(() => {
        $('.chat-box').scrollTop($('.chat-box')[0].scrollHeight);
        this.setMessagesRead();
      },0);
    }
    this.data.updateTooltips();
  }
  
  getTitle(message:Message) {
    let ret = "";

    if (getDay() === message.day) {
      ret = message.time;
    } else {
      ret = message.day + " " + message.time;
    }

    if (message.type === "sent") return ret;
  }

  setMessagesRead() {
    this.data.newMessages = false;
  }

  //Set Modal Image Source and Displays Modal
  imgFullscreen(src) {
    document.getElementById('modalImg').setAttribute('src', src);
    document.getElementById('myModal').style.display = "block";
  }

}
