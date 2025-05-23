import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpContributionComponent } from './add-up-contribution.component';

describe('AddUpContributionComponent', () => {
  let component: AddUpContributionComponent;
  let fixture: ComponentFixture<AddUpContributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpContributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpContributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
