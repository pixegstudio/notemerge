# NoteMerge - Technical Handover

## Proje Amacı
Öğrencilerin ders notlarını fotoğraflayıp PDF'e dönüştürerek birleştirmesini sağlayan mobil uygulama.
**Hedef:** Aylık $1000 gelir (freemium model: $2.99/ay premium abonelik)

## Teknoloji Stack
- **Framework:** React Native + Expo SDK 52
- **Dil:** TypeScript (strict mode)
- **UI:** NativeWind (Tailwind CSS)
- **Navigation:** React Navigation v7
- **State:** React Context API
- **Storage:** AsyncStorage (local), Firebase Firestore (cloud sync)
- **Auth:** Firebase Anonymous Auth
- **Payments:** react-native-iap (iOS StoreKit, Android Billing)
- **PDF:** react-native-pdf, expo-print, pdf-lib
- **Image:** expo-image-picker, expo-image-manipulator, react-native-vision-camera

## Mimari Yapı
```
MVVM Pattern:
- Views: React Native screens
- ViewModels: Context providers (CourseContext, PremiumContext)
- Services: StorageService, PremiumService, FirestoreService
- Models: TypeScript interfaces (Course, Note, Page)
```

## Önemli Mimari Kararlar

### 1. React Native + Expo (Native yerine)
**Neden:** 2-3 günde MVP çıkarma hedefi, cross-platform kod paylaşımı
**Trade-off:** Native performans kaybı vs hızlı geliştirme

### 2. Freemium Model
**Free:** 3 ders, watermark'lı PDF export
**Premium ($2.99/ay):** Sınırsız ders, watermark yok, cloud sync, PDF birleştirme
**Karar:** Düşük fiyat + yüksek hacim stratejisi (öğrenci hedef kitle)

### 3. Firebase Integration
**Neden:** Backend yazmadan user management + cloud sync
**Trade-off:** Vendor lock-in vs hızlı kurulum
**Güvenlik:** Anonymous auth + Firestore security rules (user-scoped data)

### 4. Local-First Architecture
**Karar:** Tüm işlemler önce local (AsyncStorage), sonra Firebase'e sync
**Neden:** Offline çalışma + hızlı UX
**Implementation:** StorageService (local) + FirestoreService (cloud)

### 5. PDF Watermark Stratejisi
**Free users:** pdf-lib ile her sayfaya watermark
**Premium users:** Orijinal PDF'leri direkt birleştir (parçalamadan)
**Trade-off:** İşlem hızı vs monetization

### 6. iOS CocoaPods Sandboxing
**Sorun:** Xcode User Script Sandboxing build'i engelledi
**Çözüm:** `ENABLE_USER_SCRIPT_SANDBOXING = NO` (Debug + Release)
**Dosya:** `ios/NoteMerge.xcodeproj/project.pbxproj`

## Tamamlanan İşler

### UI/UX (Pastel + Sıcak Tonlar)
- ✅ Onboarding (3 sayfa)
- ✅ HomeScreen (stats carousel, ders listesi)
- ✅ CourseDetailScreen (header scroll, grid/list view)
- ✅ AddCourseModal (renk/ikon seçimi)
- ✅ PremiumScreen (pricing cards, restore purchases)
- ✅ Glassmorphism cards, gradient buttons

### Core Features
- ✅ Ders oluşturma (isim, renk, ikon)
- ✅ Not ekleme (kamera, galeri, PDF import)
- ✅ PDF export (watermark free users için)
- ✅ Not birleştirme (multi-select, bulk operations)
- ✅ Etiket sistemi (predefined + custom tags)
- ✅ Grid/List view toggle
- ✅ Arşiv sistemi

### Monetization
- ✅ IAP entegrasyonu (react-native-iap)
- ✅ Premium status check
- ✅ Restore purchases
- ✅ Freemium limits (3 ders, watermark)

### Firebase
- ✅ Anonymous authentication
- ✅ Firestore data sync
- ✅ Security rules (user-scoped)
- ✅ Premium status backend validation

## Açık Kalan İşler

### Kritik (MVP için gerekli)
1. **iOS Build Test:** Fiziksel cihazda test edilmedi
2. **Android Build:** Henüz başlanmadı
3. **App Store Assets:** Icon, screenshots, description
4. **Privacy Policy:** App Store requirement

### Önemli (Launch sonrası)
1. **OCR:** Taranmış PDF'lerden metin çıkarma
2. **Cloud Backup:** iCloud/Google Drive entegrasyonu
3. **Paylaşım:** Ders/not paylaşma özelliği
4. **Analytics:** Firebase Analytics event tracking
5. **Push Notifications:** Hatırlatmalar

### Nice-to-Have
1. **Dark Mode:** Şu an sadece light theme
2. **Localization:** Şu an sadece Türkçe
3. **Tablet Optimization:** iPad/Android tablet layout
4. **Web Version:** Progressive Web App

## Bilinen Problemler

### 1. PDF Import - Sayfa Sayısı
**Sorun:** PDF import edildiğinde tek sayfa olarak kaydediliyor
**Geçici Çözüm:** PDF'ler orijinal haliyle paylaşılıyor (tüm sayfalar korunuyor)
**Kalıcı Çözüm:** PDF'i sayfalara ayırıp her sayfayı ayrı image olarak kaydetmek gerekiyor

### 2. iOS Simulator - Metro Bundler
**Sorun:** Terminal'de `npx expo start` donuyor
**Çözüm:** Xcode'dan direkt run (Cmd+R) veya Mac Terminal kullan
**Neden:** CI environment variable veya Cursor terminal uyumsuzluğu

### 3. CocoaPods Build Failure
**Sorun:** `pod install` sonrası build hatası
**Çözüm:** 
```bash
cd ios && pod install --repo-update
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

### 4. Firebase Config
**Sorun:** GoogleService-Info.plist eksik olabilir
**Çözüm:** Firebase Console'dan indir, `ios/` klasörüne kopyala

## Kritik Dosyalar

### Configuration
- `app.json` - Expo config, bundle ID, version
- `eas.json` - EAS Build profiles
- `firebase.config.ts` - Firebase credentials
- `ios/NoteMerge.xcodeproj/project.pbxproj` - Xcode settings

### Core Services
- `src/services/StorageService.ts` - Local data (AsyncStorage)
- `src/services/PremiumService.ts` - IAP + premium logic
- `src/services/FirestoreService.ts` - Cloud sync
- `src/services/AuthService.ts` - Firebase auth

### Context Providers
- `src/contexts/CourseContext.tsx` - Ders/not state management
- `src/contexts/PremiumContext.tsx` - Premium status

### Key Screens
- `src/screens/HomeScreen.tsx` - Ana ekran (stats + ders listesi)
- `src/screens/CourseDetailScreen.tsx` - Not listesi + birleştirme
- `src/screens/PremiumScreen.tsx` - Satın alma ekranı

### Constants
- `src/constants/Colors.ts` - Pastel color palette
- `src/constants/PredefinedData.ts` - Dersler, ikonlar, etiketler

## Sonraki Adım
1. **Xcode'da build al:** `NoteMerge.xcworkspace` aç, simulator seç, Cmd+R
2. **CocoaPods hatasını çöz:** Terminal çıktısını kontrol et
3. **Firebase test:** Console'da user auth + premium status kontrol et
4. **Android setup:** `npx expo run:android` ile başla

## Notlar
- Firebase kurulumu tamamlandı ama production'da test edilmedi
- Premium satın alma flow'u simulator'da test edilemez (gerçek cihaz gerekli)
- PDF watermark free users için çalışıyor, premium users için bypass edildi
- Tüm UI pastel tonlar + glassmorphism ile tasarlandı (öğrenci dostu)
