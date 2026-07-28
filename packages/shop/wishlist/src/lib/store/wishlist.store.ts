import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { Product } from '@org/models';

export interface WishlistCompareState {
  wishlist: Product[];
  compareList: Product[];
  maxCompareLimit: number;
}

const initialState: WishlistCompareState = {
  wishlist: [],
  compareList: [],
  maxCompareLimit: 4,
};

export const WishlistCompareStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => {
    const wishlistCount = () => store.wishlist().length;
    const compareCount = () => store.compareList().length;

    const canAddToCompare = () =>
      store.compareList().length < store.maxCompareLimit();

    const wishlistTotalValue = () =>
      store.wishlist().reduce((sum, p) => sum + p.price, 0);

    const comparisonMatrix = () => {
      const list = store.compareList();
      if (list.length === 0) {
        return {
          cheapestProduct: null,
          highestRatedProduct: null,
          inStockCount: 0,
          categories: [],
        };
      }

      const cheapestProduct = list.reduce((prev, curr) =>
        curr.price < prev.price ? curr : prev
      );
      const highestRatedProduct = list.reduce((prev, curr) =>
        curr.rating > prev.rating ? curr : prev
      );
      const inStockCount = list.filter((p) => p.inStock).length;
      const categories = Array.from(new Set(list.map((p) => p.category)));

      return {
        cheapestProduct,
        highestRatedProduct,
        inStockCount,
        categories,
      };
    };

    return {
      wishlistCount,
      compareCount,
      canAddToCompare,
      wishlistTotalValue,
      comparisonMatrix,
    };
  }),
  withMethods((store) => ({
    isWishlisted(productId: string): boolean {
      return store.wishlist().some((p) => p.id === productId);
    },

    isCompared(productId: string): boolean {
      return store.compareList().some((p) => p.id === productId);
    },

    toggleWishlist(product: Product) {
      const exists = this.isWishlisted(product.id);
      if (exists) {
        patchState(store, {
          wishlist: store.wishlist().filter((p) => p.id !== product.id),
        });
      } else {
        patchState(store, { wishlist: [...store.wishlist(), product] });
      }
    },

    addToCompare(product: Product): { success: boolean; message?: string } {
      if (this.isCompared(product.id)) {
        return { success: true };
      }
      if (store.compareList().length >= store.maxCompareLimit()) {
        return {
          success: false,
          message: `Maximum ${store.maxCompareLimit()} items allowed in comparison`,
        };
      }
      patchState(store, { compareList: [...store.compareList(), product] });
      return { success: true };
    },

    removeFromCompare(productId: string) {
      patchState(store, {
        compareList: store.compareList().filter((p) => p.id !== productId),
      });
    },

    clearCompare() {
      patchState(store, { compareList: [] });
    },

    clearWishlist() {
      patchState(store, { wishlist: [] });
    },
  }))
);
