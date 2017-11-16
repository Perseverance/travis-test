import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyListedPropertiesComponent } from './my-listed-properties.component';

describe('MyListedPropertiesComponent', () => {
  let component: MyListedPropertiesComponent;
  let fixture: ComponentFixture<MyListedPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyListedPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyListedPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
