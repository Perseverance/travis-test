import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteLocationsComponent } from './favourite-locations.component';

describe('FavouriteLocationsComponent', () => {
  let component: FavouriteLocationsComponent;
  let fixture: ComponentFixture<FavouriteLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
