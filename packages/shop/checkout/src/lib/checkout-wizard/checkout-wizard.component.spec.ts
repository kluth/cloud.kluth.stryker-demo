import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutWizardComponent } from './checkout-wizard.component';
import { CheckoutStore } from '../store/checkout.store';

describe('CheckoutWizardComponent', () => {
  let component: CheckoutWizardComponent;
  let fixture: ComponentFixture<CheckoutWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutWizardComponent],
      providers: [CheckoutStore],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create checkout wizard component', () => {
    expect(component).toBeTruthy();
  });
});
