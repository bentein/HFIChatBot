import { Component, AfterViewInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';
import * as $ from 'jquery';

@Component({
  selector: 'chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements AfterViewInit {

  constructor(private data: DataManagerService) {}

  ngAfterViewInit() {
    this.scrollToBottom(true);
  }

  determineRowContainerClass(index, last) {
    let messages = this.data.messages;
    let ret = messages[index].type;

    // for comments that are not first or last in box
    if (index > 0 && index < messages.length -1) {
      if (messages[index - 1].type === messages[index].type) {
        if (messages[index + 1].type === messages[index].type) {
          ret += '-row-mid';
        } else {
          ret += '-row-last';
        }
      } else if (messages[index - 1].type !== messages[index].type) {
        if (messages[index + 1].type === messages[index].type) {
          ret += '-row-first'
        }
      }
    }

    // if comment is first of a chain and first in box
    if (index === 0 && index < messages.length-1 && messages[index + 1].type === messages[index].type) {
      ret += '-row-first';
    }

    // if comment is last of a chain and last in box
    if (index > 0 && last && messages[index - 1].type === messages[index].type) {
      ret += '-row-last';
    }

    if (ret === messages[index].type) {
      ret = '';
    }

    if (last) {
      if (ret === '') {
        ret = 'last-row';
      } else {
        ret = [ret, 'last-row'];
      }
    } 
    if (index === 0) {
      if (ret === '') {
        ret = 'first-row';
      } else {
        ret = [ret, 'first-row'];
      }
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
