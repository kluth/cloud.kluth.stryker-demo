import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFilterBarComponent } from './search-filter-bar.component';
import { SearchFilterStore } from '../store/search-filter.store';

describe('SearchFilterBarComponent', () => {
  let component: SearchFilterBarComponent;
  let fixture: ComponentFixture<SearchFilterBarComponent>;
  let store: InstanceType<typeof SearchFilterStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFilterBarComponent],
      providers: [SearchFilterStore],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFilterBarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(SearchFilterStore);
    fixture.detectChanges();
  });

  it('should create search filter bar component', () => {
    expect(component).toBeTruthy();
  });

  it('should update search term when input value changes', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'Headphones';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(store.filterState().searchTerm).toBe('Headphones');
  });
});
