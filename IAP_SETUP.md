# 💰 In-App Purchase Kurulum Rehberi

## 🚨 ÖNEMLI: Expo Go Sınırlaması

`react-native-iap` native module gerektirdiği için **Expo Go'da çalışmaz**. Şu anda `IAPService.ts` dosyası **mock mode**'da çalışıyor:

- ✅ Expo Go'da test edilebilir (mock satın alma)
- ✅ UI/UX test edilebilir
- ❌ Gerçek satın alma yapılamaz

### Development Build için:

```bash
# EAS Build ile development build oluştur
eas build --profile development --platform ios
# veya
eas build --profile development --platform android
```

Development build'de `IAPService.ts` içindeki `isMockMode = false` yapın.

---

## 📱 iOS (App Store Connect)

### 1. App Store Connect'e Giriş
1. [App Store Connect](https://appstoreconnect.apple.com) adresine git
2. Apple Developer hesabınla giriş yap
3. "My Apps" > NoteMerge uygulamanı seç

### 2. Subscription Group Oluştur
1. Sol menüden **"Subscriptions"** sekmesine tıkla
2. **"+"** butonuna tıkla
3. **Subscription Group** oluştur:
   - **Reference Name**: `NoteMerge Premium`
   - **App Name**: `NoteMerge Premium`

### 3. Subscription Products Ekle

#### Aylık Abonelik
1. Subscription Group içinde **"+"** > **"Add Subscription"**
2. **Product ID**: `notemerge_monthly`
3. **Reference Name**: `NoteMerge Premium Monthly`
4. **Subscription Duration**: `1 Month`
5. **Price**: `₺29` (veya istediğin fiyat)
6. **Localization** (Türkçe):
   - **Display Name**: `Aylık Premium`
   - **Description**: `NoteMerge Premium - Sınırsız ders, not ve özel etiket`

#### Yıllık Abonelik
1. Subscription Group içinde **"+"** > **"Add Subscription"**
2. **Product ID**: `notemerge_yearly`
3. **Reference Name**: `NoteMerge Premium Yearly`
4. **Subscription Duration**: `1 Year`
5. **Price**: `₺199` (veya istediğin fiyat)
6. **Localization** (Türkçe):
   - **Display Name**: `Yıllık Premium`
   - **Description**: `NoteMerge Premium - Yıllık abonelik (%40 indirim)`

### 4. Sandbox Test Kullanıcısı Oluştur
1. **Users and Access** > **Sandbox Testers**
2. **"+"** butonuna tıkla
3. Test email ve şifre oluştur
4. **Country/Region**: `Turkey`

### 5. iOS Cihazda Test
1. **Settings** > **App Store** > **Sandbox Account**
2. Test kullanıcısı ile giriş yap
3. Uygulamayı çalıştır ve satın alma yap
4. Sandbox ortamında gerçek para çekilmez! ✅

---

## 🤖 Android (Google Play Console)

### 1. Google Play Console'a Giriş
1. [Google Play Console](https://play.google.com/console) adresine git
2. Google hesabınla giriş yap
3. NoteMerge uygulamanı seç

### 2. Subscription Products Oluştur
1. Sol menüden **"Monetization"** > **"Products"** > **"Subscriptions"**
2. **"Create subscription"** butonuna tıkla

#### Aylık Abonelik
1. **Product ID**: `notemerge_monthly`
2. **Name**: `NoteMerge Premium Monthly`
3. **Description**: `Sınırsız ders, not ve özel etiket`
4. **Billing period**: `1 Month`
5. **Price**: `₺29` (veya istediğin fiyat)
6. **Free trial**: İsteğe bağlı (örn: 7 gün)

#### Yıllık Abonelik
1. **Product ID**: `notemerge_yearly`
2. **Name**: `NoteMerge Premium Yearly`
3. **Description**: `Yıllık abonelik - %40 indirim`
4. **Billing period**: `1 Year`
5. **Price**: `₺199` (veya istediğin fiyat)

### 3. Test Lisansı Oluştur
1. **Settings** > **License Testing**
2. Test email adreslerini ekle
3. **License response**: `RESPOND_NORMALLY`

### 4. Android Cihazda Test
1. Test email ile Play Store'a giriş yap
2. Uygulamayı çalıştır ve satın alma yap
3. Test lisansı ile gerçek para çekilmez! ✅

---

## 🧪 Test Senaryoları

### ✅ Yapılması Gerekenler:

1. **Satın Alma Flow**
   - [ ] Aylık plan seçimi
   - [ ] Yıllık plan seçimi
   - [ ] Satın alma butonu çalışıyor
   - [ ] Başarılı satın alma sonrası premium aktif

2. **Restore Purchases**
   - [ ] Uygulamayı sil ve yeniden yükle
   - [ ] "Geri Yükle" butonuna tıkla
   - [ ] Premium durumu geri yükleniyor

3. **Limit Kontrolleri**
   - [ ] Freemium: 3 ders limiti çalışıyor
   - [ ] Freemium: 10 not/ders limiti çalışıyor
   - [ ] Freemium: 3 özel etiket limiti çalışıyor
   - [ ] Premium: Tüm limitler kaldırılıyor

4. **PDF Export**
   - [ ] Freemium: Watermark var
   - [ ] Freemium: Sıkıştırılmış kalite
   - [ ] Premium: Watermark yok
   - [ ] Premium: Tam kalite

5. **Hata Durumları**
   - [ ] İnternet bağlantısı yok
   - [ ] Kullanıcı satın almayı iptal etti
   - [ ] Ödeme başarısız oldu

---

## 🚀 Production'a Geçiş

### iOS
1. App Store Connect'te subscription'ları **"Ready to Submit"** yap
2. App Review için submit et
3. Onay sonrası canlıya geç

### Android
1. Google Play Console'da subscription'ları **"Activate"** et
2. App Review için submit et
3. Onay sonrası canlıya geç

---

## 💡 Önemli Notlar

### Backend Validation (Önerilen)
Şu anda client-side validation kullanılıyor. Production'da **backend validation** eklemen önerilir:

```typescript
// src/services/IAPService.ts içinde
private async verifyPurchase(purchase: RNIap.Purchase): Promise<boolean> {
  // Backend'e receipt gönder
  const response = await fetch('YOUR_BACKEND_URL/verify-receipt', {
    method: 'POST',
    body: JSON.stringify({ 
      receipt: purchase.transactionReceipt,
      platform: Platform.OS,
    }),
  });
  
  return response.ok;
}
```

### Fiyatlandırma Stratejisi
- **Aylık**: ₺29 (test fiyatı)
- **Yıllık**: ₺199 (%40 indirim)
- Gerçek fiyatları pazar araştırması sonrası belirle

### App Store Review
- Sandbox test kullanıcısı bilgilerini App Review Notes'a ekle
- Demo video hazırla (satın alma flow'u göster)
- Restore purchases'ın çalıştığını göster

---

## 📞 Sorun Giderme

### "Cannot connect to iTunes Store"
- Sandbox test kullanıcısı ile giriş yaptığından emin ol
- Gerçek Apple ID ile değil, sandbox kullanıcısı ile test et

### "Product not found"
- Product ID'lerin App Store Connect ile eşleştiğinden emin ol
- Subscription'ların "Ready to Submit" durumunda olduğundan emin ol

### "Receipt validation failed"
- Backend validation ekle (production için zorunlu)
- Apple/Google'ın receipt validation API'lerini kullan

---

## 🎯 Sonraki Adımlar

1. ✅ IAP entegrasyonu tamamlandı
2. ⏳ App Store Connect'te subscription'ları oluştur
3. ⏳ Google Play Console'da subscription'ları oluştur
4. ⏳ Sandbox ortamında test et
5. ⏳ Backend validation ekle (production için)
6. ⏳ App Review için submit et

**Başarılar! 🚀**
