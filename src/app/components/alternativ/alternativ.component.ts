import { Component, OnInit } from '@angular/core';
import { AlternativesService } from '../../services/alternatives.service';
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

  

  
    
}
