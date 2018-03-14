import { Component, OnInit } from '@angular/core';
import { DataManagerService } from '../../services/datamanager.service';

@Component({
  selector: 'alternativ',
  templateUrl: './alternativ.component.html',
  styleUrls: ['./alternativ.component.css']
})
export class AlternativComponent implements OnInit {

  constructor(private data:DataManagerService) { }

  ngOnInit() {
  }

  toggeAlternativBox($event) {
    this.data.toggleAlternativBox();
  }

  
    
}
