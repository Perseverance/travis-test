import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChinaShareComponent } from './china-share.component';

describe('ChinaShareComponent', () => {
  let component: ChinaShareComponent;
  let fixture: ComponentFixture<ChinaShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChinaShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChinaShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
