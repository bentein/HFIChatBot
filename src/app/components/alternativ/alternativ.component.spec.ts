import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativComponent } from './alternativ.component';

describe('AlternativComponent', () => {
  let component: AlternativComponent;
  let fixture: ComponentFixture<AlternativComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlternativComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternativComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
