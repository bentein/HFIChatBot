import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatcontainerComponent } from './chatcontainer.component';

describe('ChatcontainerComponent', () => {
  let component: ChatcontainerComponent;
  let fixture: ComponentFixture<ChatcontainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatcontainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatcontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
