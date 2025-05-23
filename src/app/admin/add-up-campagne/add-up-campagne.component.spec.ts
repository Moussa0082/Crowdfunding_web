import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpCampagneComponent } from './add-up-campagne.component';

describe('AddUpCampagneComponent', () => {
  let component: AddUpCampagneComponent;
  let fixture: ComponentFixture<AddUpCampagneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpCampagneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
