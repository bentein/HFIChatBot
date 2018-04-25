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

  URL_REGEX = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi


  constructor(private data: DataManagerService, private alternativHandler: AlternativButtonLogicService) {}

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

    setTimeout(() => { 
      this.scrollToBottom(true); 
      this.detectURL();
    }, 100);


  }

  //Scroll chat-box to bootom.
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

  //Set new messages as false.  
  setMessagesRead() {
    this.data.newMessages = false;
  }

  //Set Modal Image Source and Displays Modal
  imgFullscreen(src) {
    document.getElementById('modalImg').setAttribute('src', src);
    document.getElementById('myModal').style.display = "block";
  }

  detectURL() {    
    let chatMessages = document.getElementsByClassName("chat-message");

    for(let i = 0; i < chatMessages.length; i++) {
      let tmp = chatMessages[i].innerHTML;
      tmp = this.detectURLInMessage(tmp);
      chatMessages[i].innerHTML = tmp;
    }
  }

  detectURLInMessage(message) {

    let fstSplitWord = /\[\[/gi;
    let sndSplitWord = /\]\]/gi;

    if(message.search(fstSplitWord) != -1 && message.search(sndSplitWord) != -1) {

     
      let split1 = message.split(fstSplitWord);
   
      let split2 = split1[1].split(sndSplitWord);
    
      let split3 = split2[0].split(",");

      console.log(split1[0]); //First
      console.log(split2[1]); //MORE
      console.log(split3[0].trim()); //LINK
      console.log(split3[1].trim()); //URL

      return split1[0] + "<a target=\"_blank\" href=" + split3[1].trim() + ">" + split3[0].trim() + "</a>" + split2[1];
    } else return message;
  }

}
