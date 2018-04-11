import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatimageComponent } from './chatimage.component';

describe('ChatimageComponent', () => {
  let component: ChatimageComponent;
  let fixture: ComponentFixture<ChatimageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatimageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
