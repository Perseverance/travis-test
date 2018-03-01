import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWidgetComponent } from './share-widget.component';

describe('ShareWidgetComponent', () => {
  let component: ShareWidgetComponent;
  let fixture: ComponentFixture<ShareWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
