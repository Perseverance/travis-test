import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedPropertiesComponent } from './featured-properties.component';

describe('FeaturedPropertiesComponent', () => {
  let component: FeaturedPropertiesComponent;
  let fixture: ComponentFixture<FeaturedPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
