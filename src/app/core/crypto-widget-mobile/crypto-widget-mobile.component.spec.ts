import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoWidgetMobileComponent } from './crypto-widget-mobile.component';

describe('CryptoWidgetMobileComponent', () => {
  let component: CryptoWidgetMobileComponent;
  let fixture: ComponentFixture<CryptoWidgetMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoWidgetMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoWidgetMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
