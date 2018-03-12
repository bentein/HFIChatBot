import { Component, OnInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';

@Component({
  selector: 'chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
   
  constructor(private data:DataManagerService) { }

  ngOnInit() {
  }

}
