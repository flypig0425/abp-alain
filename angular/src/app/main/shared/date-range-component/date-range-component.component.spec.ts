import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeComponentComponent } from './date-range-component.component';

describe('DateRangeComponentComponent', () => {
  let component: DateRangeComponentComponent;
  let fixture: ComponentFixture<DateRangeComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRangeComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
