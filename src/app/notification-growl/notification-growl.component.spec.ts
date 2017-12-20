import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationGrowlComponent } from './notification-growl.component';

describe('NotificationGrowlComponent', () => {
  let component: NotificationGrowlComponent;
  let fixture: ComponentFixture<NotificationGrowlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationGrowlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationGrowlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
