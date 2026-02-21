# TestFlight Sandbox Test Rehberi

## 1. Sandbox Test Hesabı Oluşturma

### App Store Connect'te:
1. **Users and Access** → **Sandbox Testers** git
2. **"+"** tıkla (Create Sandbox Tester)
3. Bilgileri doldur:
   - **Email:** Gerçek olmayan bir email (örn: `test@notemerge.test`)
   - **Password:** Güçlü şifre
   - **First Name / Last Name:** Test User
   - **Country/Region:** Turkey
   - **App Store Territory:** Turkey
4. **Create** tıkla

⚠️ **ÖNEMLİ:** Bu email gerçek olmamalı, sadece test için!

---

## 2. Build Oluşturma ve Yükleme

### Xcode'da:
1. **Product** → **Archive** (veya Cmd+B sonra Archive)
2. Organizer açılır
3. **Distribute App** tıkla
4. **App Store Connect** seç → **Next**
5. **Upload** seç → **Next**
6. Tüm seçenekleri kontrol et → **Next**
7. **Automatically manage signing** seç → **Upload**

⏱️ **Bekleme süresi:** 5-15 dakika (Apple'ın işlemesi için)

---

## 3. TestFlight'ta Build'i Yayınlama

### App Store Connect'te:
1. **TestFlight** sekmesine git
2. **iOS** altında yeni build'i gör
3. Build'e tıkla
4. **Export Compliance** sorusunu yanıtla:
   - "Does your app use encryption?" → **NO** (veya YES ise detayları doldur)
5. **Internal Testing** → **"+"** → Grup oluştur
6. Build'i gruba ekle

---

## 4. iPhone'da Sandbox Test

### Hazırlık:
1. **TestFlight** uygulamasını indir (App Store'dan)
2. **Settings** → **App Store** → **Sandbox Account** → Sandbox hesabını ekle
   - Email: `test@notemerge.test`
   - Password: (oluşturduğun şifre)

### Test:
1. **TestFlight** uygulamasını aç
2. **NoteMerge** uygulamasını gör ve **Install** tıkla
3. Uygulamayı aç
4. **Premium** ekranına git
5. **Monthly** veya **Yearly** seç
6. **Satın Al** tıkla
7. Sandbox hesabı ile oturum aç (sorulursa)
8. **Confirm** tıkla (ücret alınmaz, test modu)

### Kontrol:
- ✅ Premium özelliklere erişim sağlandı mı?
- ✅ Firebase'de premium status güncellendi mi?
- ✅ Restore Purchases çalışıyor mu?

---

## 5. Test Senaryoları

### Senaryo 1: Satın Alma
1. Premium ekranına git
2. Monthly plan seç
3. Satın al
4. Premium badge görünmeli
5. Tüm premium özelliklere erişim olmalı

### Senaryo 2: Restore Purchases
1. Uygulamayı sil
2. Tekrar yükle
3. Premium ekranına git
4. **Restore Purchases** tıkla
5. Premium status geri gelmeli

### Senaryo 3: Plan Değiştirme
1. Monthly satın al
2. Yearly'e geç
3. Upgrade işlemi tamamlanmalı

---

## 6. Sandbox Test Hesabı Yönetimi

### Satın Almaları Sıfırlama:
- App Store Connect → **Sandbox Testers** → Hesabı seç → **Clear Purchase History**

### Yeni Test:
- Purchase history temizle
- Uygulamayı sil ve tekrar yükle
- Test et

---

## 7. Sık Karşılaşılan Sorunlar

### "Cannot connect to iTunes Store"
- **Çözüm:** Sandbox hesabından çıkış yap, tekrar giriş yap

### "Product not found"
- **Çözüm:** 
  - App Store Connect'te subscription'lar "Ready to Submit" durumunda mı?
  - Product ID'ler kodda doğru mu?
  - Build yüklendikten sonra 1-2 saat bekle

### "This is not a test user account"
- **Çözüm:** iPhone Settings → App Store → Sandbox Account kontrol et

---

## 8. Production'a Geçiş

### Test tamamlandıktan sonra:
1. ✅ Tüm IAP senaryoları çalışıyor
2. ✅ Firebase premium validation çalışıyor
3. ✅ Restore purchases çalışıyor
4. **App Store Connect** → **App Information** → **In-App Purchases**
5. Subscription'ları version'a ekle
6. **Submit for Review** tıkla

---

## Notlar

- Sandbox ortamında **gerçek ücret alınmaz**
- Test satın almaları **24 saat sonra otomatik yenilenir** (hızlandırılmış)
- Production'da bu süre gerçek (aylık = 1 ay, yıllık = 1 yıl)
- Sandbox hesapları sadece test için, production'da çalışmaz

---

**Hazırlayan:** NoteMerge Team  
**Tarih:** 21 Şubat 2026
