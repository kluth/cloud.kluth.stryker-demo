import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { LoyaltyTier, LoyaltyTransaction, LoyaltyVoucher } from '@org/models';

export interface LoyaltyState {
  pointsBalance: number;
  lifetimePoints: number;
  transactions: LoyaltyTransaction[];
  claimedVouchers: LoyaltyVoucher[];
}

const initialState: LoyaltyState = {
  pointsBalance: 0,
  lifetimePoints: 0,
  transactions: [],
  claimedVouchers: [],
};

const VOUCHER_CATALOG: LoyaltyVoucher[] = [
  {
    id: 'v-3usd',
    code: 'LOYAL3',
    title: '$3 Off Voucher',
    pointsCost: 300,
    discountValue: 3,
    discountType: 'FIXED',
    minOrderAmount: 25,
  },
  {
    id: 'v-5usd',
    code: 'LOYAL5',
    title: '$5 Off Voucher',
    pointsCost: 500,
    discountValue: 5,
    discountType: 'FIXED',
    minOrderAmount: 40,
  },
  {
    id: 'v-10usd',
    code: 'LOYAL10',
    title: '$10 Off Voucher',
    pointsCost: 1000,
    discountValue: 10,
    discountType: 'FIXED',
    minOrderAmount: 75,
  },
  {
    id: 'v-15pct',
    code: 'VIP15',
    title: '15% Off VIP Voucher',
    pointsCost: 1500,
    discountValue: 15,
    discountType: 'PERCENTAGE',
    minOrderAmount: 100,
  },
];

export const LoyaltyStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => {
    const currentTier = (): LoyaltyTier => {
      const pts = store.lifetimePoints();
      if (pts >= 7000) return 'PLATINUM';
      if (pts >= 3000) return 'GOLD';
      if (pts >= 1000) return 'SILVER';
      return 'BRONZE';
    };

    const tierMultiplier = () => {
      const tier = currentTier();
      switch (tier) {
        case 'PLATINUM':
          return 2.0;
        case 'GOLD':
          return 1.5;
        case 'SILVER':
          return 1.25;
        case 'BRONZE':
        default:
          return 1.0;
      }
    };

    const pointsToNextTier = () => {
      const pts = store.lifetimePoints();
      if (pts >= 7000) return 0;
      if (pts >= 3000) return 7000 - pts;
      if (pts >= 1000) return 3000 - pts;
      return 1000 - pts;
    };

    const tierProgressPercentage = () => {
      const pts = store.lifetimePoints();
      if (pts >= 7000) return 100;
      let prevThreshold = 0;
      let nextThreshold = 1000;

      if (pts >= 3000) {
        prevThreshold = 3000;
        nextThreshold = 7000;
      } else if (pts >= 1000) {
        prevThreshold = 1000;
        nextThreshold = 3000;
      }

      const progress = ((pts - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
      return +Math.min(100, Math.max(0, progress)).toFixed(1);
    };

    const redeemableVouchers = () =>
      VOUCHER_CATALOG.filter((v) => v.pointsCost <= store.pointsBalance());

    return {
      currentTier,
      tierMultiplier,
      pointsToNextTier,
      tierProgressPercentage,
      redeemableVouchers,
    };
  }),
  withMethods((store) => ({
    earnPointsForPurchase(amountSpent: number) {
      const multiplier = store.tierMultiplier();
      const earned = Math.floor(amountSpent * multiplier);
      const newTx: LoyaltyTransaction = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'EARNED',
        points: earned,
        description: `Earned ${earned} points for $${amountSpent} purchase`,
        date: new Date().toISOString(),
      };

      patchState(store, {
        pointsBalance: store.pointsBalance() + earned,
        lifetimePoints: store.lifetimePoints() + earned,
        transactions: [newTx, ...store.transactions()],
      });
    },

    addBonusPoints(points: number, reason: string) {
      const newTx: LoyaltyTransaction = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'BONUS',
        points,
        description: reason,
        date: new Date().toISOString(),
      };

      patchState(store, {
        pointsBalance: store.pointsBalance() + points,
        lifetimePoints: store.lifetimePoints() + points,
        transactions: [newTx, ...store.transactions()],
      });
    },

    redeemVoucher(voucherId: string): { success: boolean; message?: string; voucher?: LoyaltyVoucher } {
      const voucher = VOUCHER_CATALOG.find((v) => v.id === voucherId);
      if (!voucher) {
        return { success: false, message: 'Voucher not found' };
      }
      if (store.pointsBalance() < voucher.pointsCost) {
        return { success: false, message: 'Insufficient points balance' };
      }

      const uniqueCode = `${voucher.code}-${Math.floor(Math.random() * 10000)}`;
      const claimed: LoyaltyVoucher = {
        ...voucher,
        code: uniqueCode,
        isRedeemed: false,
      };

      const newTx: LoyaltyTransaction = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'REDEEMED',
        points: voucher.pointsCost,
        description: `Redeemed ${voucher.title}`,
        date: new Date().toISOString(),
      };

      patchState(store, {
        pointsBalance: store.pointsBalance() - voucher.pointsCost,
        claimedVouchers: [...store.claimedVouchers(), claimed],
        transactions: [newTx, ...store.transactions()],
      });

      return { success: true, voucher: claimed };
    },

    markVoucherAsUsed(code: string) {
      const updated = store.claimedVouchers().map((v) => {
        if (v.code === code) {
          return { ...v, isRedeemed: true };
        }
        return v;
      });
      patchState(store, { claimedVouchers: updated });
    },

    hasSufficientPoints(voucherId: string): boolean {
      const voucher = VOUCHER_CATALOG.find((v) => v.id === voucherId);
      if (!voucher) return false;
      return store.pointsBalance() >= voucher.pointsCost;
    },
  }))
);
