// coupon-manager.js - Advanced Coupon Generation and Management System
console.log('✅ coupon_manager.js file is loading...');




class CouponManager {
    constructor() {
        this.coupons = JSON.parse(localStorage.getItem('coupons')) || {};
        this.usedCoupons = JSON.parse(localStorage.getItem('usedCoupons')) || [];
    }

    // Generate random coupon code
    generateCouponCode(prefix = '', length = 6) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = prefix;
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    // Create a new coupon
    createCoupon(options = {}) {
        const defaults = {
            code: this.generateCouponCode(),
            type: 'percentage', // 'percentage' or 'fixed'
            value: 10,
            minOrderAmount: 0,
            maxDiscount: null,
            expiryDate: null,
            usageLimit: null,
            usageCount: 0,
            isActive: true,
            description: 'Discount coupon',
            createdAt: new Date().toISOString()
        };

        const coupon = { ...defaults, ...options };
        
        // Ensure unique code
        while (this.coupons[coupon.code]) {
            coupon.code = this.generateCouponCode(options.prefix || '');
        }

        this.coupons[coupon.code] = coupon;
        this.saveCoupons();
        
        return coupon;
    }

    // Validate coupon before applying
    validateCoupon(code, orderAmount = 0) {
        const coupon = this.coupons[code.toUpperCase()];
        
        if (!coupon) {
            return { valid: false, message: 'Invalid coupon code' };
        }

        if (!coupon.isActive) {
            return { valid: false, message: 'This coupon is no longer active' };
        }

        if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
            return { valid: false, message: 'This coupon has expired' };
        }

        if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
            return { 
                valid: false, 
                message: `Minimum order amount is sh ${coupon.minOrderAmount.toLocaleString()}` 
            };
        }

        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return { valid: false, message: 'This coupon has reached its usage limit' };
        }

        if (this.usedCoupons.includes(code.toUpperCase())) {
            return { valid: false, message: 'You have already used this coupon' };
        }

        return { valid: true, coupon };
    }

    // Calculate discount amount
    calculateDiscount(coupon, orderAmount) {
        let discount = 0;

        if (coupon.type === 'percentage') {
            discount = Math.round(orderAmount * coupon.value / 100);
        } else if (coupon.type === 'fixed') {
            discount = coupon.value;
        }

        // Apply max discount limit if set
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }

        // Don't allow discount to exceed order amount
        if (discount > orderAmount) {
            discount = orderAmount;
        }

        return discount;
    }

    // Apply coupon (call this when coupon is successfully used)
    applyCoupon(code) {
        const coupon = this.coupons[code.toUpperCase()];
        if (coupon) {
            coupon.usageCount++;
            this.usedCoupons.push(code.toUpperCase());
            this.saveCoupons();
            this.saveUsedCoupons();
        }
    }

    // Save to localStorage
    saveCoupons() {
        localStorage.setItem('coupons', JSON.stringify(this.coupons));
    }

    saveUsedCoupons() {
        localStorage.setItem('usedCoupons', JSON.stringify(this.usedCoupons));
    }

    // Get all active coupons
    getActiveCoupons() {
        return Object.values(this.coupons).filter(coupon => 
            coupon.isActive && 
            (!coupon.expiryDate || new Date() <= new Date(coupon.expiryDate))
        );
    }

    // Deactivate coupon
    deactivateCoupon(code) {
        if (this.coupons[code]) {
            this.coupons[code].isActive = false;
            this.saveCoupons();
            return true;
        }
        return false;
    }

    // Delete coupon
    deleteCoupon(code) {
        if (this.coupons[code]) {
            delete this.coupons[code];
            this.saveCoupons();
            return true;
        }
        return false;
    }

    // Generate seasonal/campaign coupons
    generateCampaignCoupons(campaign) {
        const campaigns = {
            'new_year': {
                prefix: 'NY',
                type: 'percentage',
                value: 20,
                description: 'New Year Special',
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            },
            'welcome': {
                prefix: 'WELCOME',
                type: 'percentage',
                value: 15,
                description: 'Welcome New Customer',
                usageLimit: 1,
                minOrderAmount: 1000
            },
            'bulk_order': {
                prefix: 'BULK',
                type: 'fixed',
                value: 500,
                description: 'Bulk Order Discount',
                minOrderAmount: 5000
            },
            'flash_sale': {
                prefix: 'FLASH',
                type: 'percentage',
                value: 25,
                description: 'Flash Sale - Limited Time',
                expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                usageLimit: 100
            }
        };

        const campaignData = campaigns[campaign];
        if (campaignData) {
            return this.createCoupon(campaignData);
        }
        return null;
    }

    // Generate random promotional coupons
    generatePromoCoupons(count = 5) {
        const promos = [];
        const promoTypes = [
            { type: 'percentage', value: 10, description: '10% Off' },
            { type: 'percentage', value: 15, description: '15% Off' },
            { type: 'fixed', value: 200, description: 'Save sh 200' },
            { type: 'fixed', value: 500, description: 'Save sh 500' },
            { type: 'percentage', value: 20, description: '20% Off - Limited Time' }
        ];

        for (let i = 0; i < count; i++) {
            const promo = promoTypes[Math.floor(Math.random() * promoTypes.length)];
            const coupon = this.createCoupon({
                ...promo,
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                usageLimit: Math.floor(Math.random() * 50) + 10 // 10-60 uses
            });
            promos.push(coupon);
        }

        return promos;
    }

    // Get coupon statistics
    getCouponStats() {
        const allCoupons = Object.values(this.coupons);
        return {
            total: allCoupons.length,
            active: allCoupons.filter(c => c.isActive).length,
            expired: allCoupons.filter(c => c.expiryDate && new Date() > new Date(c.expiryDate)).length,
            used: allCoupons.filter(c => c.usageCount > 0).length,
            totalUsage: allCoupons.reduce((sum, c) => sum + c.usageCount, 0)
        };
    }
}

// Initialize the coupon manager
const couponManager = new CouponManager();

// Enhanced applyCoupon function for cart integration
function applyCouponToCart(couponCode, cartTotal) {
    const validation = couponManager.validateCoupon(couponCode, cartTotal);
    
    if (!validation.valid) {
        return { success: false, message: validation.message };
    }

    const discount = couponManager.calculateDiscount(validation.coupon, cartTotal);
    
    // Apply the coupon
    couponManager.applyCoupon(couponCode);

    return {
        success: true,
        discount: discount,
        message: `Coupon applied! You saved sh ${discount.toLocaleString()}`,
        coupon: validation.coupon
    };
}

// Create sample coupons for testing
function createSampleCoupons() {
    // Create some sample coupons
    couponManager.createCoupon({
        code: 'SAVE10',
        type: 'percentage',
        value: 10,
        description: '10% discount on all orders'
    });

    couponManager.createCoupon({
        code: 'WELCOME15',
        type: 'percentage',
        value: 15,
        description: 'Welcome discount for new customers',
        usageLimit: 1,
        minOrderAmount: 1000
    });

    couponManager.createCoupon({
        code: 'BULK500',
        type: 'fixed',
        value: 500,
        description: 'Save sh 500 on bulk orders',
        minOrderAmount: 5000
    });

    console.log('Sample coupons created!');
}

// Generate coupons for different scenarios
function generateWelcomeCoupon() {
    return couponManager.generateCampaignCoupons('welcome');
}

function generateBulkOrderCoupon() {
    return couponManager.generateCampaignCoupons('bulk_order');
}

function generateFlashSaleCoupons() {
    return couponManager.generateCampaignCoupons('flash_sale');
}

// Admin functions
function getAllCoupons() {
    return couponManager.getActiveCoupons();
}

function getCouponStats() {
    return couponManager.getCouponStats();
}

// Make available globally
window.couponManager = couponManager;
window.applyCouponToCart = applyCouponToCart;
window.createSampleCoupons = createSampleCoupons;
window.generateWelcomeCoupon = generateWelcomeCoupon;
window.generateBulkOrderCoupon = generateBulkOrderCoupon;
window.generateFlashSaleCoupons = generateFlashSaleCoupons;
window.getAllCoupons = getAllCoupons;
window.getCouponStats = getCouponStats;

// Auto-create sample coupons if none exist
if (Object.keys(couponManager.coupons).length === 0) {
    createSampleCoupons();
    console.log('Initial sample coupons created automatically!');
}

console.log('✅ coupon_manager.js file finished loading!');
console.log('✅ couponManager available:', typeof window.couponManager);