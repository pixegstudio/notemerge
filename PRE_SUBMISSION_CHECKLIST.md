# App Store Submission Checklist

## ✅ Teknik Kontroller (Tamamlandı)
- [x] Bundle ID: `com.notemerge.app`
- [x] Version: `1.0.0`
- [x] Firebase entegrasyonu
- [x] In-App Purchase entegrasyonu
- [x] Privacy permissions
- [x] App icon & splash screen

## 📱 Test Edilmesi Gerekenler
- [ ] Tüm ekranlar açılıyor mu?
- [ ] Not oluşturma çalışıyor mu?
- [ ] PDF export çalışıyor mu?
- [ ] Arşivleme çalışıyor mu?
- [ ] Etiket sistemi çalışıyor mu?
- [ ] Dark/Light mode geçişi çalışıyor mu?

## 📝 App Store Connect Gereksinimleri
- [ ] App Store Connect'te app oluşturuldu
- [ ] Privacy Policy URL eklendi
- [ ] App açıklaması yazıldı (Türkçe + İngilizce)
- [ ] Keywords belirlendi
- [ ] Screenshots hazırlandı (6.7", 6.5", 5.5")
- [ ] App kategori seçildi (Education veya Productivity)
- [ ] Age rating belirlendi (4+)

## 🔐 IAP Gereksinimleri
- [ ] App Store Connect'te IAP ürünü oluşturuldu
- [ ] Product ID: `com.notemerge.app.premium.monthly`
- [ ] Fiyat belirlendi
- [ ] IAP açıklaması yazıldı

## 🚀 Build Komutları

### 1. Production Build
```bash
cd /Users/gurowe/proje/NoteMerge
npx eas build --platform ios --profile production
```

### 2. Submit to App Store
```bash
npx eas submit --platform ios --profile production
```

## 🐛 Hata Durumunda
- Build başarısız → hatayı düzelt → `npx eas build` tekrar çalıştır
- Submit başarısız → hatayı düzelt → `npx eas submit` tekrar çalıştır
- Version değiştirmeye gerek yok!

## 📞 Destek
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- EAS Submit Docs: https://docs.expo.dev/submit/introduction/
- App Store Connect: https://appstoreconnect.apple.com/
