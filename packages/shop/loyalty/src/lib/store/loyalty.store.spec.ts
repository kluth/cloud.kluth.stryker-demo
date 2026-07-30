import { TestBed } from '@angular/core/testing';
import { LoyaltyStore } from './loyalty.store';

describe('LoyaltyStore', () => {
  let store: InstanceType<typeof LoyaltyStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoyaltyStore],
    });
    store = TestBed.inject(LoyaltyStore);
  });

  it('should initialize with default BRONZE tier and 0 points balance', () => {
    expect(store.pointsBalance()).toBe(0);
    expect(store.lifetimePoints()).toBe(0);
    expect(store.currentTier()).toBe('BRONZE');
    expect(store.tierMultiplier()).toBe(1.0);
    expect(store.pointsToNextTier()).toBe(1000);
    expect(store.tierProgressPercentage()).toBe(0);
    expect(store.transactions()).toEqual([]);
  });

  it('should earn points for purchase using Bronze tier 1.0x multiplier', () => {
    store.earnPointsForPurchase(150); // $150 -> 150 points
    expect(store.pointsBalance()).toBe(150);
    expect(store.lifetimePoints()).toBe(150);
    expect(store.transactions().length).toBe(1);
    expect(store.transactions()[0].type).toBe('EARNED');
  });

  it('should automatically upgrade to SILVER tier at 1000 lifetime points and apply 1.25x multiplier', () => {
    store.addBonusPoints(1000, 'Welcome bonus');

    expect(store.currentTier()).toBe('SILVER');
    expect(store.tierMultiplier()).toBe(1.25);
    expect(store.pointsToNextTier()).toBe(2000); // 3000 - 1000 = 2000 needed for Gold

    // Next purchase at Silver tier: $200 * 1.25 multiplier = 250 points
    store.earnPointsForPurchase(200);
    expect(store.pointsBalance()).toBe(1250);
    expect(store.lifetimePoints()).toBe(1250);
  });

  it('should upgrade through GOLD (3000 pts) and PLATINUM (7000 pts) tiers with exact boundaries', () => {
    store.addBonusPoints(3000, 'Gold promo');
    expect(store.currentTier()).toBe('GOLD');
    expect(store.tierMultiplier()).toBe(1.5);
    expect(store.pointsToNextTier()).toBe(4000); // 7000 - 3000

    store.addBonusPoints(4000, 'Platinum promo'); // Total 7000 lifetime
    expect(store.currentTier()).toBe('PLATINUM');
    expect(store.tierMultiplier()).toBe(2.0);
    expect(store.pointsToNextTier()).toBe(0);
    expect(store.tierProgressPercentage()).toBe(100);
  });

  it('should list redeemable vouchers user has enough balance to redeem', () => {
    store.addBonusPoints(600, 'Promo bonus');
    // Available catalog has vouchers costing 300, 500, 1000 points
    const redeemable = store.redeemableVouchers();
    expect(redeemable.length).toBe(2); // 300 and 500 cost vouchers
  });

  it('should redeem voucher, deduct points, record REDEEMED transaction, and return coupon voucher', () => {
    store.addBonusPoints(600, 'Promo bonus');

    // Redeem $5 off voucher (costs 500 points)
    const result = store.redeemVoucher('v-5usd');
    expect(result.success).toBe(true);
    expect(result.voucher?.code).toBeDefined();

    expect(store.pointsBalance()).toBe(100); // 600 - 500
    expect(store.lifetimePoints()).toBe(600); // lifetime stays unchanged!
    expect(store.claimedVouchers().length).toBe(1);

    const redeemTx = store.transactions().find((t) => t.type === 'REDEEMED');
    expect(redeemTx?.points).toBe(500);
  });

  it('should return error when attempting to redeem invalid voucherId', () => {
    store.addBonusPoints(1000, 'Big bonus');
    const result = store.redeemVoucher('invalid-id');
    expect(result.success).toBe(false);
    expect(result.message).toBe('Voucher not found');
    expect(store.pointsBalance()).toBe(1000);
  });

  it('should fail voucher redemption if points balance is insufficient', () => {
    store.addBonusPoints(200, 'Small bonus');

    // Attempt redeeming voucher costing 500 points
    const result = store.redeemVoucher('v-5usd');
    expect(result.success).toBe(false);
    expect(result.message).toContain('Insufficient points');
    expect(store.pointsBalance()).toBe(200);
  });

  it('should mark voucher as used when markVoucherAsUsed is called', () => {
    store.addBonusPoints(600, 'Promo bonus');
    const result = store.redeemVoucher('v-5usd');
    const code = result.voucher?.code ?? '';

    store.markVoucherAsUsed(code);
    expect(store.claimedVouchers()[0].isRedeemed).toBe(true);
  });

  it('should verify hasSufficientPoints correctly for existing and missing vouchers', () => {
    store.addBonusPoints(400, 'Test bonus');
    expect(store.hasSufficientPoints('v-3usd')).toBe(true); // costs 300
    expect(store.hasSufficientPoints('v-5usd')).toBe(false); // costs 500
    expect(store.hasSufficientPoints('non-existent')).toBe(false);
  });
});
