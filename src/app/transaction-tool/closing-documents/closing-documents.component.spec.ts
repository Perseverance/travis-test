import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosingDocumentsComponent } from './closing-documents.component';

describe('ClosingDocumentsComponent', () => {
  let component: ClosingDocumentsComponent;
  let fixture: ComponentFixture<ClosingDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosingDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
