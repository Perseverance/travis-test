import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoWidgetComponent } from './crypto-widget.component';

describe('CryptoWidgetComponent', () => {
  let component: CryptoWidgetComponent;
  let fixture: ComponentFixture<CryptoWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CryptoWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
