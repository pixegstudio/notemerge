import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';
import { StorageService } from './StorageService';
import PremiumService from './PremiumService';

type Purchase = RNIap.Purchase;
type Subscription = RNIap.Subscription;

// Product IDs
const PRODUCT_IDS = Platform.select({
  ios: [
    'com.notemerge.app.premium.monthly',
    'com.notemerge.app.premium.yearly',
  ],
  android: [
    'notemerge_monthly',
    'notemerge_yearly',
  ],
}) || [];

export interface SubscriptionProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  localizedPrice: string;
  currency: string;
  type: 'monthly' | 'yearly';
}

class IAPServiceClass {
  private isInitialized = false;
  private products: Subscription[] = [];
  private isMockMode = false; // Set to false when using development build

  /**
   * Initialize IAP connection
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      if (this.isMockMode) {
        console.log('IAP Mock Mode: Using mock products');
        this.isInitialized = true;
        return;
      }

      const result = await RNIap.initConnection();
      console.log('IAP Connection initialized:', result);
      
      // Get available products
      await this.loadProducts();
      
      // Check for pending purchases
      await this.checkPendingPurchases();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing IAP:', error);
      throw error;
    }
  }

  /**
   * Load available subscription products
   */
  async loadProducts(): Promise<SubscriptionProduct[]> {
    try {
      if (this.isMockMode) {
        // Mock products for Expo Go testing
        return [
          {
            productId: 'com.notemerge.app.premium.monthly',
            title: 'NoteMerge Premium Monthly',
            description: 'Sınırsız ders, not ve özel etiket',
            price: '49',
            localizedPrice: '₺49',
            currency: 'TRY',
            type: 'monthly',
          },
          {
            productId: 'com.notemerge.app.premium.yearly',
            title: 'NoteMerge Premium Yearly',
            description: 'Yıllık abonelik - %40 indirim',
            price: '349.99',
            localizedPrice: '₺349,99',
            currency: 'TRY',
            type: 'yearly',
          },
        ];
      }

      const subscriptions = await RNIap.getSubscriptions({ skus: PRODUCT_IDS });
      this.products = subscriptions;
      
      return subscriptions.map(product => ({
        productId: product.productId,
        title: product.title,
        description: product.description,
        price: product.price,
        localizedPrice: product.localizedPrice,
        currency: product.currency,
        type: product.productId.includes('yearly') ? 'yearly' : 'monthly',
      }));
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }

  /**
   * Purchase a subscription
   */
  async purchaseSubscription(productId: string): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (this.isMockMode) {
        // Mock purchase for Expo Go testing
        console.log('Mock purchase:', productId);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
        
        // SECURITY FIX: Use Firebase PremiumService instead of local storage
        await PremiumService.updatePremiumStatus({
          isPremium: true,
          productId,
          purchaseDate: Date.now(),
          platform: Platform.OS as 'ios' | 'android',
        });
        
        return true;
      }

      const purchase = await RNIap.requestSubscription({ sku: productId });
      
      if (purchase) {
        // Update Firebase premium status
        await PremiumService.updatePremiumStatus({
          isPremium: true,
          productId,
          purchaseDate: Date.now(),
          platform: Platform.OS as 'ios' | 'android',
        });
        
        // Finish transaction
        await RNIap.finishTransaction({ purchase, isConsumable: false });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error purchasing subscription:', error);
      
      // Handle user cancellation
      if (error.code === 'E_USER_CANCELLED') {
        return false;
      }
      
      throw error;
    }
  }

  /**
   * Restore purchases
   */
  async restorePurchases(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (this.isMockMode) {
        // Mock restore for Expo Go testing
        console.log('Mock restore purchases');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        
        // SECURITY FIX: Check premium status from Firebase
        const currentStatus = await PremiumService.isPremium();
        return currentStatus;
      }

      const purchases = await RNIap.getAvailablePurchases();
      
      if (purchases && purchases.length > 0) {
        // User has active subscription
        const latestPurchase = purchases[0];
        await PremiumService.updatePremiumStatus({
          isPremium: true,
          productId: latestPurchase.productId,
          purchaseDate: Date.now(),
          platform: Platform.OS as 'ios' | 'android',
        });
        return true;
      } else {
        // No active subscription
        return false;
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }

  /**
   * Check for pending purchases (unfinished transactions)
   */
  private async checkPendingPurchases(): Promise<void> {
    try {
      if (this.isMockMode) return;

      const purchases = await RNIap.getAvailablePurchases();
      
      for (const purchase of purchases) {
        await PremiumService.updatePremiumStatus({
          isPremium: true,
          productId: purchase.productId,
          purchaseDate: Date.now(),
          platform: Platform.OS as 'ios' | 'android',
        });
        await RNIap.finishTransaction({ purchase, isConsumable: false });
      }
    } catch (error) {
      console.error('Error checking pending purchases:', error);
    }
  }

  /**
   * Verify purchase (basic client-side validation)
   * In production, verify with your backend server
   */
  private async verifyPurchase(purchase: Purchase): Promise<boolean> {
    try {
      if (this.isMockMode) return true;

      // Basic validation
      // if (!purchase || !purchase.transactionReceipt) {
      //   return false;
      // }

      // TODO: In production, send receipt to your backend for validation
      // const response = await fetch('YOUR_BACKEND_URL/verify-receipt', {
      //   method: 'POST',
      //   body: JSON.stringify({ receipt: purchase.transactionReceipt }),
      // });
      // return response.ok;

      // For now, accept all purchases (DEV ONLY)
      return true;
    } catch (error) {
      console.error('Error verifying purchase:', error);
      return false;
    }
  }

  /**
   * End IAP connection
   */
  async disconnect(): Promise<void> {
    try {
      if (this.isMockMode) {
        this.isInitialized = false;
        return;
      }

      await RNIap.endConnection();
      this.isInitialized = false;
    } catch (error) {
      console.error('Error disconnecting IAP:', error);
    }
  }

  /**
   * Get product by ID
   */
  getProduct(productId: string): Subscription | undefined {
    return this.products.find(p => p.productId === productId);
  }

  /**
   * Check if user has active subscription
   */
  async hasActiveSubscription(): Promise<boolean> {
    try {
      if (this.isMockMode) {
        return await PremiumService.isPremium();
      }

      const purchases = await RNIap.getAvailablePurchases();
      return purchases && purchases.length > 0;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }
}

export const IAPService = new IAPServiceClass();
