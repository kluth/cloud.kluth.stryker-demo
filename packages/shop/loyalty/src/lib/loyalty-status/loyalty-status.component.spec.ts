import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoyaltyStatusComponent } from './loyalty-status.component';
import { LoyaltyStore } from '../store/loyalty.store';

describe('LoyaltyStatusComponent', () => {
  let component: LoyaltyStatusComponent;
  let fixture: ComponentFixture<LoyaltyStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyaltyStatusComponent],
      providers: [LoyaltyStore],
    }).compileComponents();

    fixture = TestBed.createComponent(LoyaltyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create loyalty status component', () => {
    expect(component).toBeTruthy();
  });
});
