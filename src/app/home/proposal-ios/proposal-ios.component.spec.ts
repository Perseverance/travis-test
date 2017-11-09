import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalIosComponent } from './proposal-ios.component';

describe('ProposalIosComponent', () => {
  let component: ProposalIosComponent;
  let fixture: ComponentFixture<ProposalIosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalIosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalIosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
