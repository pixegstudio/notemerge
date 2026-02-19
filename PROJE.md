# NoteMerge

**Öğrenciler için akıllı not birleştirme uygulaması**

## 🎯 Proje Amacı

NoteMerge, öğrencilerin ders notlarını, belgeleri ve kağıt dökümanları kolayca fotoğraflayarak tek bir PDF dosyasında birleştirmelerini sağlayan mobil bir uygulamadır. Amacımız, öğrencilerin not organizasyonunu basitleştirmek ve dijital arşivleme sürecini hızlandırmaktır.

## 💡 Sorun ve Çözüm

### Sorun
- Öğrenciler ders notlarını birçok farklı kağıtta tutuyor
- Notları dijitalleştirmek zaman alıcı ve karmaşık
- Mevcut PDF uygulamaları çok karmaşık veya pahalı
- Notları organize etmek ve paylaşmak zor
- **Dersler karışıyor, hangi not hangi derse ait bulmak zor**

### Çözüm
NoteMerge ile:
- ✅ Notları hızlıca fotoğrafla
- ✅ Otomatik sayfa tespiti ve düzeltme
- ✅ Tek PDF'te birleştir
- ✅ Her yerde paylaş (email, WhatsApp, Drive)
- ✅ **Ders bazlı organizasyon - her ders için ayrı klasör**

## 🎨 Tasarım Felsefesi

**Premium, Minimal, Modern**

- **Pastel Renk Paleti**: Gözü yormayan, sıcak tonlar
  - Primary: Soft Coral → Peach (#FFB5A7 → #FCD5CE)
  - Secondary: Soft Mint (#B8E6E1 → #9FD9D3)
  - Accent: Soft Lavender (#D4C5F9 → #C8B9F3)
  - Background: Cream White (#FFF8F3)

- **Apple-Style UI**: Glassmorphism, soft gradients, clean spacing
- **Genç ve Dinamik**: Öğrencilere hitap eden modern arayüz
- **Sezgisel UX**: 3 adımda not birleştirme

## 🚀 Özellikler

### 🎯 Asıl Fark Yaratan Özellik: Ders Klasörü Sistemi

**Scanner app değil, "Ders Organizasyon App"!**

NoteMerge sadece PDF birleştirmiyor - **derslerinizi organize ediyor:**

#### 📚 Ders Klasörleri
- **Matematik** 📐 - Mavi tonlar
- **Fizik** ⚡ - Turuncu tonlar  
- **Hukuk** ⚖️ - Bordo tonlar
- **Tarih** 📜 - Yeşil tonlar
- **Kimya** 🧪 - Mor tonlar
- **Edebiyat** 📖 - Pembe tonlar
- **+ Özel Ders Ekle** - Kendi rengini seç

#### ✨ Her Ders İçin
- 🎨 **Özel Kapak Tasarımı**: Dersin karakterini yansıtan görsel
- 🖼️ **PDF Thumbnail Preview**: İlk sayfayı göster
- 🌈 **Renkli Klasörler**: Görsel olarak ayırt et
- 📊 **İstatistikler**: Kaç sayfa, son güncelleme, toplam not
- 🏷️ **Etiketler**: Vize, Final, Lab, Ödev
- 📅 **Tarih Bazlı Gruplandırma**: Bu hafta, bu ay, geçen dönem

#### 💭 Psikolojik Bağ
- "Matematik klasörümü açıyorum" → Zihinsel organizasyon
- Renkli klasörler → Görsel hafıza
- Ders bazlı düşünme → Doğal iş akışı
- Her ders bir hikaye → Duygusal bağ

### Mevcut Özellikler (v1.0)
- ✅ **Onboarding**: 3 adımlı akıllı onboarding (Value Proposition, Segmentation, Permission)
- ✅ **Ana Ekran**: Ders listesi ve yönetimi (Grid/Liste görünümü)
- ✅ **Premium UI Bileşenleri**:
  - Gradient butonlar
  - Glass card'lar
  - Section header'lar
  - Icon butonlar
  - Badge'ler
- ✅ **Tema Sistemi**: 
  - Night Light (Dark Mode) - Default
  - Day Light (Light Mode)
  - Global tema değiştirme
  - AsyncStorage ile tema tercihi kaydetme
- ✅ **Tipografi**: Inter Font Family (Light 300, Regular 400, SemiBold 600, Bold 700)
- ✅ **Splash Screen**: Mor-mavi gradient arka plan + app ikonu
- ✅ **Navigation**: React Navigation Stack (5 ekran)
- ✅ **Responsive Layout**: %5 üst margin, optimal spacing

### Geliştirilecek Özellikler (Roadmap)

#### Faz 1: Ders Klasörü Sistemi (ÖNCELİK!)
- [x] **Ders Oluşturma Ekranı** ✅
  - [x] Ders adı input
  - [x] Renk seçici (8 preset renk + gradient preview)
  - [x] İkon seçici (Ionicons entegrasyonu)
  - [x] Kapak tasarımı preview (canlı önizleme)
  
- [x] **Ana Ekran Yeniden Tasarım** ✅
  - [x] "Yeni Proje" → "Yeni Ders Ekle"
  - [x] Grid layout (3 sütun) + Liste görünümü
  - [x] Her ders kartı:
    - [x] Renkli gradient arka plan
    - [x] Ders ikonu (büyük)
    - [x] Ders adı
    - [x] Not sayısı badge
    - [x] Son güncelleme tarihi
  - [x] Default liste görünümü
  - [x] Grid/Liste toggle butonu
  
- [x] **Ders Detay Ekranı** ✅
  - [x] Hero section (ders rengi + blur background)
  - [x] İstatistikler kartı (PDF sayısı, toplam sayfa, boyut)
  - [x] Not listesi (grid/list görünüm)
  - [x] Thumbnail preview placeholder
  - [x] "Yeni PDF Oluştur" FAB (Floating Action Button)
  - [x] Bottom sheet (Kamera/Galeri/Dosya seçimi)
  - [x] Empty state (ilk PDF oluşturma teşviki)
  - [x] Premium banner (subtle, watermark hatırlatması)
  - [x] Dinamik tarih formatı
  - [x] Grid/List görünüm toggle
  - [x] Ders yönetimi modal (Düzenle, Renk değiştir, Paylaş, Sil)
  - [x] Not yönetimi modal (Paylaş, Arşivle, Sil)

#### 🎨 Son Geliştirmeler (Şubat 2026)
- [x] **Global Tema Sistemi** ✅
  - Night Light (Dark Mode) - Koyu mavi tonları (#1E1E2E)
  - Day Light (Light Mode) - Açık tonlar
  - Settings ekranında tema değiştirme
  - AsyncStorage ile kalıcı tema tercihi
  - Tüm ekranlarda dinamik tema desteği

- [x] **Inter Font Family** ✅
  - Google Fonts Inter entegrasyonu
  - Light 300 (alt başlık, caption)
  - Regular 400 (body, content)
  - SemiBold 600 (başlıklar)
  - Bold 700 (büyük başlıklar)

- [x] **Splash Screen & App Icon** ✅
  - Mor-mavi-pembe gradient ikon (PDF + kalem + hesap makinesi)
  - Koyu gradient arka plan (#2A2A3E)
  - 2 saniye loading animasyonu
  - iOS, Android, Web desteği

- [x] **UI/UX İyileştirmeleri** ✅
  - Tüm ekranlarda %5 üst margin
  - Modal arka planları koyu ve opak (iç içe görüntü sorunu çözüldü)
  - Liste görünümü default (dashboard ve ders detay)
  - Responsive spacing ve layout

- [x] **Navigation & Routing** ✅
  - React Navigation Stack
  - 11 ekran: Onboarding, Home, CreateCourse, CourseDetail, Settings, PDFPreview, Premium, Archive, Search, TagManagement, TagStats
  - Type-safe navigation (RootStackParamList)
  - Smooth transitions (fade, slide_from_right, slide_from_bottom)

- [x] **Premium/Paywall Sayfası** ✅
  - Ücretsiz vs Premium karşılaştırması
  - 5 ücretsiz özellik (3 ders, 10 PDF/ders, watermark, 5 renk, temel kalite)
  - 10 premium özellik (sınırsız ders/PDF, watermark yok, tüm renkler, yüksek kalite, iCloud, OCR, arşiv, grup paylaşım, öncelikli destek)
  - Fiyatlandırma planları (Aylık ₺29, Yıllık ₺199 - %40 indirim)
  - Plan seçimi (yearly/monthly toggle)
  - Satın alma butonu (gradient, dinamik fiyat)
  - Restore purchases butonu
  - Footer faydaları (güvenli ödeme, iptal, 7 gün deneme)
  - Modal presentation (slide from bottom)

- [x] **Dashboard Header Yenileme** ✅
  - "Merhaba" yazısı kaldırıldı
  - "NoteMerge" yazısı küçültüldü ve bold yapıldı (22px, 800 weight)
  - İkon etiketleri eklendi (GRID/LIST, PREMIUM, AYARLAR)
  - Bej ton etiketler (#C8B8A8, uppercase, 9px)
  - Premium butonu gradient yıldız ikonu
  - Settings ve Premium'a hızlı erişim

- [ ] **Önceden Tanımlı Dersler**
  - İlk açılışta popüler dersler öner
  - Tek tıkla ders ekle
  - Matematik, Fizik, Kimya, Biyoloji, Tarih, Coğrafya, Edebiyat, İngilizce

#### Faz 2: Temel İşlevsellik ✅ (95% Tamamlandı)
- [x] **Veri Persistence** ✅
  - AsyncStorage entegrasyonu
  - Ders kaydetme/yükleme/silme
  - Not kaydetme/yükleme/silme
  - Onboarding durumu kaydetme
  - Premium durumu kaydetme
  - Otomatik veri yükleme (useEffect)
  - Focus event ile refresh

- [x] **Kamera Entegrasyonu** ✅
  - expo-image-picker kullanımı
  - Kamera izni yönetimi
  - Fotoğraf çekme
  - Gerçek zamanlı not oluşturma

- [x] **Galeri Entegrasyonu** ✅
  - Galeri izni yönetimi
  - Tekli/çoklu fotoğraf seçimi
  - Batch not oluşturma

- [x] **PDF Önizleme** ✅
  - Not sayfalarını görüntüleme
  - Scroll ile tüm sayfalar
  - Image preview
  - Sayfa sayısı gösterimi

- [x] **Paylaşım Özellikleri** ✅
  - Not paylaşma (Share API)
  - Ders paylaşma (Share API)
  - Long press ile hızlı paylaşım
  - Güzel formatlanmış mesajlar

- [x] **Sayfa Yönetimi** ✅
  - [x] Sayfa sırası değiştirme (yukarı/aşağı)
  - [x] Sayfa silme
  - [x] Yeni sayfa ekleme (galeri)
  - [x] Edit mode (düzenleme modu)
  - [x] Long press ile hızlı menü
  - [x] Sayfa numaralandırma
- [ ] Otomatik belge tarama (Vision Framework)
- [ ] Perspektif düzeltme
- [x] **PDF Export** ✅
  - [x] expo-print entegrasyonu
  - [x] HTML to PDF conversion
  - [x] A4 formatında tam sayfa görüntü
  - [x] Base64 görüntü dönüşümü (kırık link sorunu çözüldü)
  - [x] Freemium watermark sistemi (pdf-watermark.png, 280x280px, opacity %25)
  - [x] Premium kullanıcılar için watermark/header/footer kaldırma
  - [x] expo-file-system legacy API kullanımı
  - [x] expo-image-manipulator ile görüntü sıkıştırma
  - [x] Premium: Tam kalite (orijinal boyut)
  - [x] Freemium: Sıkıştırılmış (1200px max, %60 kalite)
  - [x] Görüntüleri PDF'e dönüştürme
  - [x] PDF paylaşım (expo-sharing)
  - [x] CourseDetail'de PDF export butonu
  - [x] PDFPreview'da PDF export butonu
  - [x] Loading states ve error handling

#### Faz 3: Ders Organizasyon Özellikleri & Monetizasyon
- [x] **Freemium Limitleri** ✅
  - [x] 3 ders limiti (ücretsiz kullanıcılar)
  - [x] 10 not/ders limiti (ücretsiz kullanıcılar)
  - [x] 3 özel etiket limiti (ücretsiz kullanıcılar)
  - [x] Premium upgrade prompt'ları (Alert dialog)
  - [x] Limit bilgisi gösterimi (Dashboard: "3/3 ders", CourseDetail: "10/10 not", TagManagement: "3/3 etiket")
  - [x] Limit dolduğunda uyarı banner'ı
  - [x] Premium kullanıcılar için sınırsız erişim
  - [x] StorageService limit kontrol fonksiyonları (`canCreateCourse`, `canAddNote`, `canCreateCustomTag`)

- [x] **Etiketleme Sistemi** ✅
  - [x] Predefined tags (Vize, Final, Quiz, Lab, Ödev, Proje, Ders Notu, Özet)
  - [x] Özel etiket oluşturma (renk + ikon seçici)
  - [x] Etiket yönetim sayfası (düzenleme/silme)
  - [x] Etiket bazlı filtreleme (Dashboard + CourseDetail)
  - [x] Etiket istatistikleri (özet + detaylı görünüm)
  - [x] Tag filter chips (horizontal scroll)
  - [x] Custom tag storage (AsyncStorage)
  
- [x] **Arama ve Filtreleme** ✅
  - [x] Ders adına göre ara
  - [x] Not adına göre ara
  - [x] Etiket bazlı arama
  - [x] Global arama (tüm içerik)
  - [x] Filtre seçenekleri (Tümü/Dersler/Notlar)
  - [x] Highlight ile arama sonuçları vurgulama
  - [x] Real-time arama
  
- [x] **İstatistikler ve Analiz** ✅
  - [x] Dashboard istatistik kartları (Toplam ders/not/sayfa)
  - [x] En aktif ders kartı (En çok notlu ders)
  - [x] Bu hafta eklenen notlar
  - [x] Gradient stat cards (3 adet)
  - [x] Tıklanabilir en aktif ders kartı
  
- [x] **Ders Arşivi** ✅
  - [x] Geçmiş dönem dersleri arşivle
  - [x] Aktif/Pasif ders ayrımı
  - [x] Dönem bazlı organizasyon
  - [x] Arşiv sayfası (header'dan erişim)
  - [x] Kategorize görünüm (dönem bazlı)
  - [x] Arşivden geri getirme
  - [x] Kalıcı silme (arşivden)
  - [x] Dashboard'da arşivlenmiş dersler gizlenir

#### Faz 4: Gelişmiş Özellikler
- [ ] OCR (metin tanıma)
- [ ] Sayfa numaralandırma
- [ ] Watermark ekleme
- [ ] PDF sıkıştırma
- [ ] iCloud senkronizasyon
- [x] Dark/Light mode ✅ (Tamamlandı - Night Light & Day Light)
- [ ] Ders arkadaşlarıyla paylaşım
- [ ] Grup çalışması özellikleri

#### Faz 5: Premium Özellikler & Monetizasyon
- [x] Premium/Paywall sayfası tasarımı ✅
- [x] Fiyatlandırma planları (Aylık/Yıllık) ✅
- [x] Ücretsiz vs Premium karşılaştırması ✅
- [x] Dashboard'a Premium butonu ✅
- [x] In-app purchase entegrasyonu (StoreKit/Google Play Billing) ✅
- [x] Restore purchases fonksiyonu ✅
- [x] Subscription status tracking ✅
- [ ] Toplu işleme (premium özellik)
- [ ] Özel şablonlar (ders notları, lab raporu, ödev)
- [ ] Otomatik yedekleme (iCloud/Google Drive)
- [ ] Özel kapak tasarımları (premium)

## 💰 İş Modeli

### Freemium Model

**Ücretsiz Versiyon:**
- 3 ders
- 10 not/ders
- Temel renkler (5 renk)
- Temel kalite
- Küçük watermark
- Banner reklamlar

**Premium ($2.99/ay veya $19.99/yıl):**
- Sınırsız ders
- Sınırsız not
- Tüm renkler ve ikonlar
- Özel kapak tasarımları
- Yüksek kalite
- Watermark yok
- Reklamsız
- iCloud sync
- OCR özelliği
- Ders arşivi ✅
- Grup paylaşım
- Öncelikli destek

### Gelir Hedefi

**Aylık $1,000 Hedefi:**
- 500 premium kullanıcı × $2.99 = $1,495/ay
- Veya 100 yıllık abonelik × $19.99 ÷ 12 = $166/ay
- Toplam: ~$1,660/ay

**Yıllık Projeksiyon:**
- İlk ay: 50 kullanıcı ($150)
- 3. ay: 200 kullanıcı ($600)
- 6. ay: 500 kullanıcı ($1,500)
- 12. ay: 1,000 kullanıcı ($3,000)

## 🎯 Hedef Kitle

### Birincil Hedef
- **Üniversite Öğrencileri** (18-25 yaş)
- Aktif not alan öğrenciler
- Dijital organizasyon arayan kişiler
- Türkiye'deki 8+ milyon üniversite öğrencisi

### İkincil Hedef
- Lise öğrencileri
- Öğretmenler
- Freelancer'lar
- Küçük işletme sahipleri

## 🛠️ Teknoloji Stack

### Frontend
- **React Native** (Expo 54.0.33)
- **TypeScript** (Strict mode)
- **NativeWind** (Tailwind CSS for React Native)

### UI/UX
- **expo-blur**: Glassmorphism efektleri (hero sections)
- **expo-linear-gradient**: Gradient arka planlar ve butonlar
- **expo-haptics**: Dokunsal geri bildirim (tüm interaksiyonlarda)
- **@expo/vector-icons**: İkonlar (Ionicons - 100+ ikon)
- **@expo-google-fonts/inter**: Inter Font Family (Light, Regular, SemiBold, Bold)
- **expo-splash-screen**: Custom splash screen yönetimi

### Theme System
- **Context API**: Global tema yönetimi (ThemeContext)
- **AsyncStorage**: Tema tercihi kalıcı saklama
- **Dynamic Styling**: Runtime'da tema değişimi
- **Night Light Theme**: Koyu mavi tonları (#1E1E2E, #2A2A3E, #363650)
- **Day Light Theme**: Açık tonlar (gelecekte genişletilecek)

### Navigation
- **@react-navigation/native**: Ana navigation
- **@react-navigation/native-stack**: Stack navigation (6 ekran)
- **Type-safe routing**: RootStackParamList ile tip güvenliği

### Görüntü İşleme (Planlanan)
- **expo-image-picker**: Kamera ve galeri erişimi
- **expo-file-system**: Dosya yönetimi
- **Vision Framework** (iOS): Belge tarama
- **ML Kit** (Android): Belge tarama

### PDF İşleme (Planlanan)
- **PDFKit** (iOS): PDF oluşturma
- **react-native-pdf**: PDF önizleme

### Veri Yönetimi
- **AsyncStorage**: Yerel veri saklama (tema tercihi - ✅ Aktif)
- **SQLite**: Veritabanı (planlanan - ders ve not verileri için)
- **iCloud**: Bulut senkronizasyon (premium - planlanan)

### Monetizasyon
- **StoreKit** (iOS): In-app purchases
- **Google Play Billing** (Android): Abonelik yönetimi

## 📊 Teknik Mimari

### MVVM Benzeri Yapı

```
App
├── View Layer (UI)
│   ├── Screens
│   └── Components
├── ViewModel Layer
│   └── Business Logic
├── Service Layer
│   ├── ImageProcessingService
│   ├── PDFGenerationService
│   └── StorageService
└── Data Layer
    ├── AsyncStorage
    └── FileSystem
```

### Veri Akışı

```
Kullanıcı → Kamera → Görüntü İşleme → Sayfa Yönetimi → PDF Oluşturma → Paylaşım
```

## 🎨 Tasarım Sistemi

### Tipografi Hiyerarşisi (Inter Font Family)
- **Display**: 48px / 700 / Inter Bold - Ana başlıklar
- **Title Large**: 34px / 700 / Inter Bold - Ekran başlıkları
- **Title**: 28px / 600 / Inter SemiBold - Bölüm başlıkları
- **Headline**: 22px / 600 / Inter SemiBold - Alt başlıklar
- **Body**: 17px / 400 / Inter Regular - Ana metin
- **Callout**: 16px / 400 / Inter Regular - Vurgulu metin
- **Subhead**: 15px / 300 / Inter Light - Alt başlıklar
- **Footnote**: 13px / 300 / Inter Light - Küçük metin
- **Caption**: 12px / 300 / Inter Light - Yardımcı metin

### Renk Sistemi

#### Night Light Theme (Dark Mode - Default)
- **Background**: #1E1E2E (Ana arka plan)
- **Background Secondary**: #2A2A3E (İkincil arka plan)
- **Background Tertiary**: #363650 (Üçüncül arka plan)
- **Text Primary**: #FFFFFF (Ana metin)
- **Text Secondary**: #B4B4C8 (İkincil metin)
- **Text Tertiary**: #8C8CA0 (Üçüncül metin)
- **Card Background**: #2A2A3E (Kart arka planı)
- **Primary Gradient**: #5A7FE8 → #7B9BF0 (Mavi)
- **Accent Gradient**: #4ECDC4 → #6FE0D8 (Turkuaz)

#### Day Light Theme (Light Mode)
- **Background**: #FFFFFF
- **Text Primary**: #1A1A1A
- (Diğer renkler tema objesi içinde tanımlı)

#### Ders Renkleri (8 Preset)
- Mavi (#5A7FE8 → #7B9BF0) - Matematik
- Turkuaz (#4ECDC4 → #6FE0D8) - Fizik
- Yeşil (#7DC88F → #9FDAA8) - Biyoloji
- Turuncu (#E8A87C → #F0BA8E) - Kimya
- Mor (#A88BE8 → #BA9DF0) - Sanat
- Pembe (#E88BA8 → #F09DBA) - Edebiyat
- Deniz Mavisi (#4DB8A8 → #6FCABA) - Coğrafya
- Mercan (#E87D7D → #F08F8F) - Müzik

### Spacing Sistemi
- **xs**: 4px, **sm**: 8px, **base**: 16px, **md**: 12px
- **lg**: 20px, **xl**: 24px, **2xl**: 32px, **3xl**: 40px
- **4xl**: 48px, **5xl**: 64px

### Border Radius
- **sm**: 8px, **md**: 12px, **lg**: 16px, **xl**: 20px
- **2xl**: 24px, **full**: 9999px (circular)

## 📱 Platform Desteği

### Şu Anda
- ✅ **iOS**: iPhone, iPad
- ✅ **Web**: Test ve geliştirme için

### Gelecekte
- 🔜 **Android**: Google Play Store
- 🔜 **iPad**: Optimize edilmiş arayüz

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 25.5.0+
- npm 11.8.0+
- Expo CLI
- iOS Simulator (Mac) veya Android Emulator

### Kurulum

```bash
# Bağımlılıkları yükle
cd NoteMerge
npm install

# Geliştirme sunucusunu başlat
npx expo start

# iOS'ta çalıştır
npx expo start --ios

# Android'de çalıştır
npx expo start --android

# Web'de çalıştır (Önerilen)
./start-notemerge.sh

# Veya manuel
CI=false node node_modules/@expo/cli/build/bin/cli start --web
```

### Web'de Test

```bash
# Web bağımlılıklarını kontrol et
npm list react-dom react-native-web

# Eğer eksikse kur
npm install react-dom@19.1.0 "react-native-web@^0.21.0"

# Başlat
node node_modules/@expo/cli/build/bin/cli start --web
```

Tarayıcıda: `http://localhost:8081`

## 📂 Proje Yapısı

```
NoteMerge/
├── src/
│   ├── components/          # Yeniden kullanılabilir UI bileşenleri
│   │   ├── GradientButton.tsx    # Gradient buton component
│   │   ├── GlassCard.tsx         # Glassmorphism kart
│   │   ├── SectionHeader.tsx     # Bölüm başlığı
│   │   ├── IconButton.tsx        # İkon butonu
│   │   ├── Badge.tsx             # Badge component
│   │   ├── SplashScreen.tsx      # Custom splash screen ✅
│   │   └── index.ts              # Component exports
│   │
│   ├── screens/             # Uygulama ekranları
│   │   ├── OnboardingScreen.tsx      # 3 adımlı onboarding ✅
│   │   ├── HomeScreen.tsx            # Ana ekran (ders listesi, premium butonu) ✅
│   │   ├── CreateCourseScreen.tsx    # Ders oluşturma ✅
│   │   ├── CourseDetailScreen.tsx    # Ders detay (not listesi) ✅
│   │   ├── SettingsScreen.tsx        # Ayarlar (tema değiştirme) ✅
│   │   ├── PDFPreviewScreen.tsx      # PDF önizleme (placeholder) ✅
│   │   ├── PremiumScreen.tsx         # Premium/Paywall sayfası ✅
│   │   ├── index.ts                  # Screen exports
│   │   └── CameraCaptureScreen.tsx   # (TODO - Faz 2)
│   │
│   ├── navigation/          # Navigation yapısı
│   │   └── RootNavigator.tsx         # Stack navigator (11 ekran) ✅
│   │
│   ├── constants/           # Sabit değerler
│   │   ├── colors.ts             # Ders renkleri, tag renkleri
│   │   ├── spacing.ts            # Spacing ve border radius sistemi ✅
│   │   ├── typography.ts         # Inter font tipografi hiyerarşisi ✅
│   │   └── theme.ts              # Night/Day Light tema tanımları ✅
│   │
│   ├── context/             # React Context
│   │   └── ThemeContext.tsx      # Global tema yönetimi ✅
│   │
│   ├── navigation/          # Navigation yapısı
│   │   └── RootNavigator.tsx     # Stack navigator (6 ekran) ✅
│   │
│   ├── types/               # TypeScript tipleri
│   │   └── index.ts              # Course, Note, RootStackParamList ✅
│   │
│   ├── services/            # İş mantığı servisleri (TODO)
│   │   ├── ImageProcessingService.ts
│   │   ├── PDFGenerationService.ts
│   │   └── StorageService.ts
│   │
│   └── utils/               # Yardımcı fonksiyonlar (TODO)
│       └── helpers.ts
│
├── assets/                  # Statik dosyalar
│   ├── icon.png                  # App ikonu (512x512) ✅
│   ├── splash.png                # Splash screen ✅
│   ├── adaptive-icon.png         # Android adaptive icon ✅
│   └── favicon.png               # Web favicon ✅
│
├── App.tsx                  # Ana uygulama (font loading, splash) ✅
├── app.json                 # Expo konfigürasyonu ✅
├── package.json             # Bağımlılıklar ✅
├── start-notemerge.sh       # Başlatma script'i ✅
├── tailwind.config.js       # Tailwind CSS
└── tsconfig.json            # TypeScript
```

## 🎯 Başarı Metrikleri

### Kullanıcı Metrikleri
- **Hedef**: 10,000 indirme (ilk 3 ay)
- **Retention**: %40 (7 gün)
- **Premium Dönüşüm**: %1-2

### Gelir Metrikleri
- **MRR**: $1,000 (6. ay)
- **ARR**: $20,000 (12. ay)
- **LTV**: $50/kullanıcı

### Kullanım Metrikleri
- **Ortalama Proje/Kullanıcı**: 5
- **Ortalama Sayfa/Proje**: 8
- **Günlük Aktif Kullanıcı**: 1,000

## 🏆 Rekabet Avantajları

### NoteMerge vs Rakipler

**CamScanner, Adobe Scan:**
- ❌ Karmaşık arayüz
- ❌ Pahalı abonelik ($10-15/ay)
- ❌ Fazla özellik
- ❌ **Ders bazlı organizasyon YOK**
- ✅ NoteMerge: Basit, ucuz, öğrenci dostu, **ders klasörleri**

**Microsoft Lens, Google Drive:**
- ❌ Genel amaçlı, öğrenciye özel değil
- ❌ Soğuk, kurumsal tasarım
- ❌ **Sadece dosya yönetimi**
- ✅ NoteMerge: Genç, sıcak, pastel renkler, **ders organizasyonu**

**Genius Scan, Scanner Pro:**
- ❌ Tek seferlik pahalı ($10-20)
- ❌ Eski tasarım
- ❌ **Klasör sistemi yok**
- ✅ NoteMerge: Modern UI, freemium, **renkli ders klasörleri**

**Notion, Evernote:**
- ❌ Çok karmaşık
- ❌ Öğrenme eğrisi yüksek
- ❌ Not tarama zayıf
- ✅ NoteMerge: Özel amaçlı, **sadece ders notları için optimize**

### 🎯 Benzersiz Değer Önerisi

**"Dersleriniz için dijital klasör sistemi"**

NoteMerge sadece PDF scanner değil:
- 📚 Her ders bir hikaye
- 🎨 Görsel organizasyon
- 🧠 Zihinsel düzen
- ❤️ Duygusal bağ

**Rakipler dosya yönetimi yapıyor, biz ders yönetimi yapıyoruz.**

## 📈 Pazarlama Stratejisi

### Organik Büyüme
- App Store Optimization (ASO)
- Sosyal medya (Instagram, TikTok)
- Üniversite kampüsleri
- Öğrenci toplulukları

### Viral Özellikler
- Referral programı (arkadaşını davet et, 1 ay premium kazan)
- Sosyal paylaşım (Instagram story'e paylaş)
- Kampüs elçileri

### İçerik Pazarlama
- Blog: "Ders Notlarını Organize Etmenin 10 Yolu"
- YouTube: "NoteMerge Nasıl Kullanılır?"
- TikTok: Kısa kullanım videoları

## 🔐 Gizlilik ve Güvenlik

- ✅ Tüm işlemler cihazda (offline)
- ✅ Sunucuya veri gönderilmez
- ✅ iCloud opsiyonel (kullanıcı seçimi)
- ✅ GDPR ve KVKK uyumlu
- ✅ Şifreleme (premium özellik)

## 📞 İletişim ve Destek

- **Email**: support@notemerge.app
- **Website**: notemerge.app (gelecek)
- **Instagram**: @notemergeapp
- **Twitter**: @notemergeapp

## 📝 Geliştirme Notları

### Tamamlanan Sprint (Şubat 19, 2026)

#### ✅ Tema Sistemi Entegrasyonu
- Global ThemeContext ile tüm ekranlarda dinamik tema
- Night Light (Dark) ve Day Light (Light) modları
- AsyncStorage ile tema tercihi kalıcı saklama
- `createStyles` pattern ile dinamik stil oluşturma
- Tüm ekranlarda `theme.colors` yapısı kullanımı

#### ✅ Tipografi ve Font Sistemi
- Inter Font Family entegrasyonu (@expo-google-fonts/inter)
- 4 font variant: Light 300, Regular 400, SemiBold 600, Bold 700
- Typography constant'ına fontFamily eklendi
- Global default font ayarı (Text.defaultProps)

#### ✅ UI/UX İyileştirmeleri
- Tüm ekranlarda %5 üst margin (status bar için)
- Modal arka planları koyu ve opak (rgba(0, 0, 0, 0.85))
- BlurView → Solid View (modal içeriğinde)
- Liste görünümü default (dashboard ve ders detay)
- Grid/Liste toggle butonu

#### ✅ Navigation ve Routing
- PDFPreviewScreen placeholder eklendi
- PremiumScreen (paywall) tam tasarımı
- Type-safe navigation (RootStackParamList)
- 7 ekran tam entegre
- Smooth transitions ve animations (fade, slide_from_right, slide_from_bottom)
- Modal presentation (CreateCourse, Premium)

#### ✅ Splash Screen ve Branding
- Custom app icon (mor-mavi-pembe gradient)
- Splash screen (2 saniye loading)
- Koyu gradient arka plan (#2A2A3E)
- iOS, Android, Web desteği

#### ✅ Premium/Paywall Sistemi
- PremiumScreen tam tasarımı (hero, features, pricing, CTA)
- Ücretsiz vs Premium karşılaştırması (5 vs 10 özellik)
- Fiyatlandırma planları (₺29/ay, ₺199/yıl - %40 indirim)
- Plan seçimi UI (border highlight, checkmark)
- Dashboard'a Premium butonu (gradient yıldız ikonu)
- Settings'ten Premium'a erişim
- Restore purchases butonu
- Footer faydaları (güvenli ödeme, iptal, deneme)

#### ✅ Dashboard Header Yenileme
- "Merhaba" yazısı kaldırıldı
- "NoteMerge" yazısı küçültüldü (22px) ve bold yapıldı (800)
- İkon etiketleri eklendi (GRID/LIST, PREMIUM, AYARLAR)
- Bej ton uppercase label'lar (#C8B8A8, 9px, letter-spacing 0.5)
- Dinamik label (GRID/LIST görünüme göre değişir)
- İkonlar arası spacing artırıldı (16px)

#### 🐛 Çözülen Hatalar
- `Colors is not defined` hatası (theme.colors yapısı düzeltildi)
- Metro bundler cache sorunları (watchman, .expo, node_modules/.cache)
- `createStyles` scope hatası (fonksiyon component üstüne taşındı)
- Duplicate `createStyles` tanımları kaldırıldı
- Navigation payload error (PDFPreview ekranı eklendi)
- Modal overlay transparency (iç içe görüntü sorunu)

#### 🚀 Performans İyileştirmeleri
- Font loading ile splash screen senkronizasyonu
- Haptic feedback tüm interaksiyonlarda
- Smooth animations (fade, slide_from_right, slide_from_bottom)

### ✅ Yeni Tamamlanan Özellikler (19 Şubat 2026 - Sprint 2)

#### 💾 Veri Persistence Sistemi
- [x] **StorageService** oluşturuldu (AsyncStorage wrapper)
- [x] Ders kaydetme/yükleme/güncelleme/silme
- [x] Not kaydetme/yükleme/güncelleme/silme
- [x] Onboarding durumu persistence
- [x] Premium durumu persistence
- [x] Otomatik veri yükleme (useEffect + focus event)
- [x] Demo data initialization (ilk açılışta)

#### 📸 Kamera & Galeri Entegrasyonu
- [x] **expo-image-picker** entegrasyonu
- [x] Kamera izni yönetimi (requestCameraPermissionsAsync)
- [x] Galeri izni yönetimi (requestMediaLibraryPermissionsAsync)
- [x] Kameradan fotoğraf çekme
- [x] Galeriden tekli fotoğraf seçme
- [x] Galeriden çoklu fotoğraf seçme (max 10)
- [x] Gerçek zamanlı not oluşturma (image → note)
- [x] Batch not oluşturma (multiple images)

#### 🔄 Gerçek Veri Akışı
- [x] HomeScreen gerçek veri yüklüyor
- [x] CourseDetailScreen gerçek veri yüklüyor
- [x] CreateCourseScreen ders kaydediyor
- [x] Otomatik refresh (navigation focus event)
- [x] Loading states (isLoading)
- [x] Empty states handling

#### 🗑️ Ders & Not Yönetimi
- [x] Ders oluşturma (tam çalışıyor)
- [x] Ders silme (Alert confirmation)
- [x] Not oluşturma (kamera/galeri)
- [x] Not silme (Alert confirmation)
- [x] Cascade delete (ders silinince notlar da silinir)

#### 📄 PDF Önizleme Ekranı
- [x] Gerçek not verilerini gösteriyor
- [x] Tüm sayfaları scroll ile gösteriyor
- [x] Image preview (full width, aspect ratio)
- [x] Sayfa sayısı gösterimi
- [x] Header (back, title, menu)

### ✅ Tamamlanan Özellikler
- [x] **PDF Export**: expo-print ile gerçek PDF oluşturma (A4, watermark, premium kontrol)
- [x] **Paylaşım**: expo-sharing ile PDF paylaşımı
- [x] **In-App Purchase**: react-native-iap ile iOS & Android subscription sistemi (Mock mode)
- [x] **Freemium Limitleri**: 3 ders, 10 not/ders, 3 özel etiket
- [x] **Premium Upgrade Prompts**: Otomatik yönlendirme
- [x] **Ayarlar Sayfaları**: Bildirimler, Yedekleme, Yardım, Gizlilik, Kullanım Koşulları, Uygulama Bilgisi
- [x] **Arşiv Sistemi**: Ders ve not arşivleme
- [x] **Arama Sistemi**: Ders ve not arama
- [x] **Etiket Sistemi**: Özel etiketler, filtreleme, istatistikler
- [x] **Sayfa Yönetimi**: Sayfa sıralama, silme, ekleme

### 🚧 Gelecek Özellikler (Roadmap)
- [ ] **OCR (Metin Tanıma)**: ML Kit / Vision Framework entegrasyonu
- [ ] **Document Scanning**: Perspektif düzeltme, kenar tespiti, otomatik tarama
- [ ] **iCloud Sync**: Premium özellik (cihazlar arası senkronizasyon)
- [ ] **Gerçek IAP**: Development build ile production IAP testi
- [ ] **Backend Validation**: Receipt validation için backend servisi
- [ ] **Push Notifications**: Gerçek push notification entegrasyonu
- [ ] **Grup Çalışması**: Ders arkadaşlarıyla paylaşım ve işbirliği

## 📄 Lisans

Tüm hakları saklıdır © 2026 NoteMerge

---

**Versiyon**: 1.7.0  
**Son Güncelleme**: 19 Şubat 2026 - 18:00  
**Durum**: 🚀 Production Ready  
**Sprint**: Ayarlar Sayfaları Tamamlandı (%100)  
**Toplam Ekran**: 17 (Onboarding, Home, CreateCourse, CourseDetail, Settings, PDFPreview, Premium, Archive, Search, TagManagement, TagStats, Notifications, HelpSupport, PrivacyPolicy, TermsOfService, AppInfo, Backup)  
**Toplam Component**: 9 (GradientButton, GlassCard, SectionHeader, IconButton, Badge, SplashScreen, StyledText, RenameNoteModal, CreateTagModal)  
**Toplam Service**: 2 (StorageService - AsyncStorage wrapper, IAPService - In-App Purchase)  
**Toplam Utility**: 1 (pdfUtils - PDF generation & sharing)

### 🎉 Yeni Özellikler (v1.7.0 - Production Ready!)

#### Ayarlar Sayfaları (v1.7.0)
- ✅ **Bildirimler Sayfası**: Push bildirimleri, çalışma hatırlatıcıları, haftalık rapor ayarları
- ✅ **Yedekleme Sayfası**: iCloud senkronizasyonu, otomatik yedekleme, manuel yedekleme/geri yükleme
- ✅ **Önbellek Yönetimi**: Önbellek boyutu gösterimi, tek tıkla temizleme
- ✅ **Yardım ve Destek**: SSS, e-posta desteği, sosyal medya linkleri
- ✅ **Gizlilik Politikası**: Detaylı gizlilik politikası metni
- ✅ **Kullanım Koşulları**: Yasal kullanım koşulları ve abonelik detayları
- ✅ **Uygulama Bilgisi**: Versiyon bilgisi, istatistikler, sosyal medya linkleri, teknik detaylar

#### Monetizasyon ve Premium (v1.6.0)
- ✅ **In-App Purchase**: react-native-iap ile iOS & Android subscription sistemi (Mock mode - Expo Go uyumlu)
- ✅ **Subscription Plans**: Aylık (₺29) ve Yıllık (₺199 - %40 indirim)
- ✅ **Purchase Flow**: Satın alma, geri yükleme, hata yönetimi (Development build gerekli)
- ✅ **Dynamic Pricing**: App Store/Play Store'dan otomatik fiyat çekme (Development build gerekli)
- ✅ **Freemium Limitleri**: 3 ders, 10 not/ders, 3 özel etiket limiti
- ✅ **Premium Upgrade Prompts**: Limit dolduğunda otomatik Premium'a yönlendirme
- ✅ **Limit Gösterimi**: Dashboard, CourseDetail ve TagManagement'de dinamik limit bilgisi
- ✅ **PDF Export**: expo-print ile gerçek PDF oluşturma (A4, watermark, premium kontrol)
- ✅ **PDF Paylaşım**: expo-sharing ile dosya paylaşımı (legacy API)
- ✅ **Görüntü Sıkıştırma**: expo-image-manipulator ile freemium kalite kontrolü
- ✅ **Premium Watermark**: pdf-watermark.png (280x280px, opacity %25)
- ✅ **Kalite Farkı**: Premium (tam kalite ~10MB), Freemium (sıkıştırılmış ~2-3MB)
- ✅ **Dashboard İstatistikleri**: Toplam ders/not/sayfa kartları
- ✅ **En Aktif Ders**: Otomatik tespit ve gösterim
- ✅ **Haftalık Aktivite**: Bu hafta eklenen notlar
- ✅ **Sticky Header**: Scroll sırasında header sabit kalıyor
