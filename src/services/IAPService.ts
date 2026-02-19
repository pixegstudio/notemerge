// import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';
import { StorageService } from './StorageService';

// Mock types for development (Expo Go doesn't support react-native-iap)
type Purchase = any;
type Subscription = any;

// Product IDs
const PRODUCT_IDS = Platform.select({
  ios: [
    'notemerge_monthly',
    'notemerge_yearly',
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
  private isMockMode = true; // Set to false when using development build

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

      // const result = await RNIap.initConnection();
      // console.log('IAP Connection initialized:', result);
      
      // Get available products
      await this.loadProducts();
      
      // Check for pending purchases
      // await this.checkPendingPurchases();
      
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
            productId: 'notemerge_monthly',
            title: 'NoteMerge Premium Monthly',
            description: 'Sınırsız ders, not ve özel etiket',
            price: '49',
            localizedPrice: '₺49',
            currency: 'TRY',
            type: 'monthly',
          },
          {
            productId: 'notemerge_yearly',
            title: 'NoteMerge Premium Yearly',
            description: 'Yıllık abonelik - %40 indirim',
            price: '349',
            localizedPrice: '₺349',
            currency: 'TRY',
            type: 'yearly',
          },
        ];
      }

      // const subscriptions = await RNIap.getSubscriptions({ skus: PRODUCT_IDS });
      // this.products = subscriptions;
      
      // return subscriptions.map(product => ({
      //   productId: product.productId,
      //   title: product.title,
      //   description: product.description,
      //   price: product.price,
      //   localizedPrice: product.localizedPrice,
      //   currency: product.currency,
      //   type: product.productId.includes('yearly') ? 'yearly' : 'monthly',
      // }));
      
      return [];
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
        await StorageService.setPremiumStatus(true);
        return true;
      }

      // const purchase = await RNIap.requestSubscription({ sku: productId });
      
      // if (purchase) {
      //   // Verify purchase (in production, verify with your backend)
      //   const isValid = await this.verifyPurchase(purchase);
        
      //   if (isValid) {
      //     // Grant premium access
      //     await StorageService.setPremiumStatus(true);
          
      //     // Finish transaction
      //     await RNIap.finishTransaction({ purchase, isConsumable: false });
          
      //     return true;
      //   }
      // }
      
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
        const currentStatus = await StorageService.getPremiumStatus();
        return currentStatus; // Return current premium status
      }

      // const purchases = await RNIap.getAvailablePurchases();
      
      // if (purchases && purchases.length > 0) {
      //   // User has active subscription
      //   await StorageService.setPremiumStatus(true);
      //   return true;
      // } else {
      //   // No active subscription
      //   await StorageService.setPremiumStatus(false);
      //   return false;
      // }
      
      return false;
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

      // const purchases = await RNIap.getAvailablePurchases();
      
      // for (const purchase of purchases) {
      //   const isValid = await this.verifyPurchase(purchase);
        
      //   if (isValid) {
      //     await StorageService.setPremiumStatus(true);
      //     await RNIap.finishTransaction({ purchase, isConsumable: false });
      //   }
      // }
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

      // await RNIap.endConnection();
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
        return await StorageService.getPremiumStatus();
      }

      // const purchases = await RNIap.getAvailablePurchases();
      // return purchases && purchases.length > 0;
      return false;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }
}

export const IAPService = new IAPServiceClass();
