import { Component, AfterViewInit, Input, ChangeDetectionStrategy} from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

import * as $ from 'jquery';

@Component({
  selector: 'chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class ChatboxComponent implements AfterViewInit {

  constructor(private data: DataManagerService) {}

  ngAfterViewInit() {
    this.scrollToBottom(true);
  }

  determineAnimationSlide() {
    if(this.data.show === true) {
      console.log("UP")
      return 'slideUp';
    } else {
      console.log("DOWN")
      return 'sludeDown';
    }
  }
  
  determineRowContainerClass(index, last) {
    let messages = this.data.messages;
    let ret = messages[index].type;

    if (index > 0 && index < messages.length) {
      if (messages[index - 1].type === messages[index].type) {
        if (index < messages.length - 1 && messages[index + 1].type === messages[index].type) {
          ret += '-row-mid';
        } else {
          ret += '-row-last';
        }
      } else if (index < messages.length - 1 && messages[index - 1].type !== messages[index].type) {
        if (messages[index + 1].type === messages[index].type) {
          ret += '-row-first'
        }
      }  
    }

    if (ret === messages[index].type) {
      ret = '';
    }

    if (last) {
      ret = [ret, 'last-row'];
    } else if (index === 0) {
      ret = [ret, 'first-row'];
    }
    
    return ret;
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
  }

  setMessagesRead() {
    this.data.newMessages = false;
  }

}

type BoxState = 'up' | 'down';
