import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloSignComponent } from './hello-sign.component';

describe('HelloSignComponent', () => {
  let component: HelloSignComponent;
  let fixture: ComponentFixture<HelloSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelloSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
