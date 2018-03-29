import { Component, AfterViewInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager/datamanager.service';

import { Message, getDay } from '../../classes/message';

import * as $ from 'jquery';
import * as tippy from 'tippy.js';

@Component({
  selector: 'chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements AfterViewInit {

  constructor(private data: DataManagerService) {}

  ngAfterViewInit() {
    this.scrollToBottom(true);

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
    this.updateTooltip();
  }

  updateTooltip() {
    tippy('.sent', {
      arrow: 'small',
      placement: 'left',
      duration: 0,
      popperOptions: {
        modifiers: {
          preventOverflow: {
            enabled: false
          },
          hide: {
            enabled: false
          }
        }
      }
    });
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

}
