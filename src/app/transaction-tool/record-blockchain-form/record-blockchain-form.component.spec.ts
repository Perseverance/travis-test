import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordBlockchainFormComponent } from './record-blockchain-form.component';

describe('RecordBlockchainFormComponent', () => {
  let component: RecordBlockchainFormComponent;
  let fixture: ComponentFixture<RecordBlockchainFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordBlockchainFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordBlockchainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
