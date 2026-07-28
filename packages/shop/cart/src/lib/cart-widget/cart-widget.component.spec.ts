import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartWidgetComponent } from './cart-widget.component';
import { CartStore } from '../store/cart.store';
import { Product } from '@org/models';

describe('CartWidgetComponent', () => {
  let component: CartWidgetComponent;
  let fixture: ComponentFixture<CartWidgetComponent>;
  let cartStore: InstanceType<typeof CartStore>;

  const mockProduct: Product = {
    id: 'p1',
    name: 'Test Headphones',
    description: 'Test sound',
    price: 100.0,
    category: 'Electronics',
    imageUrl: 'https://example.com/p1.jpg',
    inStock: true,
    rating: 4.5,
    reviewCount: 10,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartWidgetComponent],
      providers: [CartStore],
    }).compileComponents();

    fixture = TestBed.createComponent(CartWidgetComponent);
    component = fixture.componentInstance;
    cartStore = TestBed.inject(CartStore);
    fixture.detectChanges();
  });

  it('should create cart widget component', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty cart message when no items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Dein Warenkorb ist leer.');
  });

  it('should render items and handle quantity increment and removal buttons', () => {
    cartStore.addItem(mockProduct, 2);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Headphones');
    expect(compiled.textContent).toContain('100 € x 2');

    // Click increment (+)
    let buttons = Array.from(compiled.querySelectorAll('button'));
    const plusBtn = buttons.find(b => b.textContent?.trim() === '+');
    plusBtn?.click();
    fixture.detectChanges();
    expect(cartStore.items()[0].quantity).toBe(3);

    // Click decrement (-)
    buttons = Array.from(compiled.querySelectorAll('button'));
    const minusBtn = buttons.find(b => b.textContent?.trim() === '-');
    minusBtn?.click();
    fixture.detectChanges();
    expect(cartStore.items()[0].quantity).toBe(2);

    // Click remove (x)
    buttons = Array.from(compiled.querySelectorAll('button'));
    const removeBtn = buttons.find(b => b.textContent?.trim() === '×');
    removeBtn?.click();
    fixture.detectChanges();
    expect(cartStore.isEmpty()).toBe(true);
  });
});
