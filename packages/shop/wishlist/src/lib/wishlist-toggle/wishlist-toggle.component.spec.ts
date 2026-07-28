import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WishlistToggleComponent } from './wishlist-toggle.component';
import { WishlistCompareStore } from '../store/wishlist.store';

describe('WishlistToggleComponent', () => {
  let component: WishlistToggleComponent;
  let fixture: ComponentFixture<WishlistToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistToggleComponent],
      providers: [WishlistCompareStore],
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create wishlist toggle component', () => {
    expect(component).toBeTruthy();
  });
});
