import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeypayconfigComponent } from './keypayconfig.component';

describe('KeypayconfigComponent', () => {
  let component: KeypayconfigComponent;
  let fixture: ComponentFixture<KeypayconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeypayconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeypayconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
