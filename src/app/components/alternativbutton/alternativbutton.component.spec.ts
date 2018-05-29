import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativbuttonComponent } from './alternativbutton.component';

describe('AlternativbuttonComponent', () => {
  let component: AlternativbuttonComponent;
  let fixture: ComponentFixture<AlternativbuttonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlternativbuttonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternativbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
