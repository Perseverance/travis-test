import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPropertyComponentComponent } from './new-property-component.component';

describe('NewPropertyComponentComponent', () => {
  let component: NewPropertyComponentComponent;
  let fixture: ComponentFixture<NewPropertyComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPropertyComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPropertyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
