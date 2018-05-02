import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollJournalsComponent } from './payroll-journals.component';

describe('PayrollJournalsComponent', () => {
  let component: PayrollJournalsComponent;
  let fixture: ComponentFixture<PayrollJournalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollJournalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollJournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
