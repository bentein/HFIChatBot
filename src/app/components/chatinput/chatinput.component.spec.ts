import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatinputComponent } from './chatinput.component';

describe('ChatinputComponent', () => {
  let component: ChatinputComponent;
  let fixture: ComponentFixture<ChatinputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatinputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
