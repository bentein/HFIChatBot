import { Component, OnInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';
import * as $ from 'jquery';

@Component({
  selector: 'chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  constructor(private data: DataManagerService) {}

  ngOnInit() {}

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
    }
    
    return ret;
  }

  scrollToBottom() {
    $('.chat-box').scrollTop($('.chat-box')[0].scrollHeight);
  }

}
