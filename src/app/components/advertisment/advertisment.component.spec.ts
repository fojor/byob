import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertismentComponent } from './advertisment.component';

describe('AdvertismentComponent', () => {
  let component: AdvertismentComponent;
  let fixture: ComponentFixture<AdvertismentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertismentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertismentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
