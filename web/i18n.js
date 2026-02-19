// Translations
const translations = {
    tr: {
        nav: {
            features: 'Özellikler',
            screenshots: 'Ekran Görüntüleri',
            pricing: 'Fiyatlandırma',
            about: 'Hakkında',
            legal: 'Yasal',
            download: 'İndir'
        },
        hero: {
            title: 'Ders Notlarını<br>Kolayca Organize Et',
            description: 'NoteMerge ile ders notlarınızı fotoğraflayın, organize edin ve tek bir PDF\'te birleştirin. Öğrenciler için tasarlanmış, akıllı not yönetim uygulaması.',
            users: 'Kullanıcı',
            notes: 'Not',
            rating: 'Puan',
            downloadFree: 'Ücretsiz İndir',
            exploreFeatures: 'Özellikleri Keşfet'
        },
        features: {
            title: 'Güçlü Özellikler',
            subtitle: 'Ders notlarınızı yönetmek için ihtiyacınız olan her şey',
            courseFolders: {
                title: 'Ders Klasörleri',
                description: 'Notlarınızı dersler halinde organize edin. Her ders için özel renk ve ikon seçin.'
            },
            quickScan: {
                title: 'Hızlı Tarama',
                description: 'Kamera ile notlarınızı anında fotoğraflayın ve uygulamaya ekleyin.'
            },
            pdfExport: {
                title: 'PDF Export',
                description: 'Notlarınızı yüksek kaliteli PDF formatında dışa aktarın ve paylaşın.'
            },
            tagSystem: {
                title: 'Etiket Sistemi',
                description: 'Özel etiketler oluşturun ve notlarınızı kolayca kategorize edin.'
            },
            smartSearch: {
                title: 'Akıllı Arama',
                description: 'Tüm dersler ve notlar arasında hızlı arama yapın.'
            },
            archiveSystem: {
                title: 'Arşiv Sistemi',
                description: 'Eski notlarınızı arşivleyin ve düzenli bir kütüphane oluşturun.'
            },
            easySharing: {
                title: 'Kolay Paylaşım',
                description: 'Notlarınızı arkadaşlarınızla kolayca paylaşın.'
            },
            pageManagement: {
                title: 'Sayfa Yönetimi',
                description: 'Sayfaları sıralayın, silin veya yeni sayfalar ekleyin.'
            },
            secureBackup: {
                title: 'Güvenli Yedekleme',
                description: 'Notlarınızı otomatik olarak yedekleyin ve kaybetmeyin.'
            }
        },
        screenshots: {
            title: 'Uygulama Görünümü',
            subtitle: 'Modern ve kullanıcı dostu arayüz',
            dashboard: 'Dashboard',
            tagManagement: 'Etiket Yönetimi',
            createCourse: 'Ders Oluşturma',
            settings: 'Ayarlar'
        },
        pricing: {
            title: 'Basit ve Şeffaf Fiyatlandırma',
            subtitle: 'İhtiyacınıza uygun planı seçin',
            free: {
                title: 'Ücretsiz',
                features: [
                    '✓ 3 Ders',
                    '✓ 10 Not/Ders',
                    '✓ 3 Özel Etiket',
                    '✓ PDF Export (Watermark)',
                    '✓ Temel Özellikler'
                ],
                cta: 'Başla'
            },
            monthly: {
                title: 'Premium Aylık',
                badge: 'Popüler',
                currency: '₺',
                price: '49',
                period: '/ay',
                features: [
                    '✓ Sınırsız Ders',
                    '✓ Sınırsız Not',
                    '✓ Sınırsız Etiket',
                    '✓ PDF Export (Watermark Yok)',
                    '✓ Yüksek Kalite PDF',
                    '✓ Öncelikli Destek'
                ],
                cta: 'Premium\'a Geç'
            },
            yearly: {
                title: 'Premium Yıllık',
                badge: '%40 İndirim',
                currency: '₺',
                price: '349',
                period: '/yıl',
                note: 'Aylık ₺29',
                features: [
                    '✓ Tüm Premium Özellikler',
                    '✓ %40 Tasarruf',
                    '✓ Yıllık Faturalandırma',
                    '✓ İstediğin Zaman İptal'
                ],
                cta: 'En İyi Fiyat'
            }
        },
        about: {
            title: 'NoteMerge Hakkında',
            description1: 'NoteMerge, öğrencilerin ders notlarını dijitalleştirmelerine, organize etmelerine ve PDF formatında birleştirmelerine olanak sağlayan modern bir mobil uygulamadır.',
            description2: 'Amacımız, öğrencilerin not organizasyonunu basitleştirmek ve dijital arşivleme sürecini hızlandırmaktır. Kullanıcı dostu arayüzümüz ve güçlü özelliklerimizle ders çalışmanızı daha verimli hale getiriyoruz.',
            stats: {
                users: 'Aktif Kullanıcı',
                notes: 'Oluşturulan Not',
                rating: 'Kullanıcı Puanı'
            }
        },
        legal: {
            title: 'Yasal Bilgiler',
            subtitle: 'Gizliliğiniz ve güvenliğiniz bizim için önemli',
            privacy: {
                title: '📄 Gizlilik Politikası',
                description: 'Verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında detaylı bilgi.',
                link: 'Detayları Görüntüle →'
            },
            terms: {
                title: '📋 Kullanım Koşulları',
                description: 'Uygulamayı kullanırken kabul ettiğiniz şartlar ve koşullar.',
                link: 'Detayları Görüntüle →'
            }
        },
        download: {
            title: 'Hemen İndirin',
            subtitle: 'NoteMerge\'i indirin ve ders notlarınızı organize etmeye başlayın',
            appStore: {
                label: 'Download on the',
                name: 'App Store'
            },
            googlePlay: {
                label: 'GET IT ON',
                name: 'Google Play'
            }
        },
        footer: {
            description: 'Öğrenciler için akıllı not birleştirme uygulaması',
            product: 'Ürün',
            company: 'Şirket',
            legal: 'Yasal',
            contact: 'İletişim',
            privacy: 'Gizlilik Politikası',
            terms: 'Kullanım Koşulları',
            copyright: '© 2026 NoteMerge. Tüm hakları saklıdır.',
            madeWith: 'Made with ❤️ in Istanbul'
        },
        privacyPage: {
            backLink: '← Ana Sayfaya Dön',
            title: 'Gizlilik Politikası',
            lastUpdated: 'Son Güncelleme: 19 Şubat 2026',
            intro: 'NoteMerge olarak gizliliğinize önem veriyoruz. Bu gizlilik politikası, uygulamamızı kullanırken toplanan, kullanılan ve korunan bilgiler hakkında sizi bilgilendirmek için hazırlanmıştır.',
            section1Title: '1. Toplanan Bilgiler',
            section1Intro: 'NoteMerge aşağıdaki bilgileri toplayabilir:',
            section1Item1: 'Ders ve not içerikleri (cihazınızda yerel olarak saklanır)',
            section1Item2: 'Uygulama kullanım istatistikleri (anonim)',
            section1Item3: 'Cihaz bilgileri (model, işletim sistemi versiyonu)',
            section1Item4: 'Satın alma bilgileri (App Store üzerinden)',
            section2Title: '2. Bilgilerin Kullanımı',
            section2Intro: 'Toplanan bilgiler şu amaçlarla kullanılır:',
            section2Item1: 'Uygulama işlevselliğini sağlamak',
            section2Item2: 'Kullanıcı deneyimini iyileştirmek',
            section2Item3: 'Teknik destek sağlamak',
            section2Item4: 'Premium abonelik hizmetlerini yönetmek',
            section3Title: '3. Veri Güvenliği',
            section3Content: 'Verileriniz cihazınızda yerel olarak saklanır. iCloud senkronizasyonu kullanıyorsanız, verileriniz Apple\'ın güvenlik standartlarına uygun olarak şifrelenir ve saklanır.',
            section4Title: '4. Üçüncü Taraf Hizmetler',
            section4Intro: 'NoteMerge aşağıdaki üçüncü taraf hizmetlerini kullanır:',
            section4Item1: 'Apple App Store (satın alma işlemleri)',
            section4Item2: 'iCloud (opsiyonel yedekleme)',
            section5Title: '5. Kullanıcı Hakları',
            section5Intro: 'Kullanıcılar olarak aşağıdaki haklara sahipsiniz:',
            section5Item1: 'Verilerinize erişim hakkı',
            section5Item2: 'Verilerinizi silme hakkı',
            section5Item3: 'Verilerinizi dışa aktarma hakkı',
            section5Item4: 'Veri işlemeye itiraz etme hakkı',
            section6Title: '6. Çocukların Gizliliği',
            section6Content: 'NoteMerge 13 yaş altı çocuklardan bilerek kişisel bilgi toplamaz. Ebeveynler, çocuklarının uygulamamızı kullanımını denetlemelidir.',
            section7Title: '7. Politika Değişiklikleri',
            section7Content: 'Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olduğunda uygulama içinde bilgilendirileceksiniz.',
            section8Title: '8. İletişim',
            section8Intro: 'Gizlilik politikamız hakkında sorularınız varsa, lütfen bizimle iletişime geçin:',
            emailLabel: 'E-posta:',
            webLabel: 'Web:'
        },
        termsPage: {
            backLink: '← Ana Sayfaya Dön',
            title: 'Kullanım Koşulları',
            lastUpdated: 'Son Güncelleme: 19 Şubat 2026',
            intro: 'NoteMerge uygulamasını kullanarak aşağıdaki kullanım koşullarını kabul etmiş olursunuz. Lütfen bu koşulları dikkatlice okuyun.',
            section1Title: '1. Hizmet Tanımı',
            section1Content: 'NoteMerge, öğrencilerin ders notlarını dijitalleştirmelerine, organize etmelerine ve PDF formatında birleştirmelerine olanak sağlayan bir mobil uygulamadır.',
            section2Title: '2. Kullanıcı Sorumlulukları',
            section2Intro: 'Kullanıcılar olarak aşağıdaki sorumluluklara sahipsiniz:',
            section2Item1: 'Uygulamayı yasal amaçlar için kullanmak',
            section2Item2: 'Telif hakkı korumalı içeriklere saygı göstermek',
            section2Item3: 'Hesap güvenliğinizi korumak',
            section2Item4: 'Diğer kullanıcıların haklarına saygı göstermek',
            section3Title: '3. Premium Abonelik',
            section3Intro: 'Premium abonelik, aylık veya yıllık olarak yenilenebilir bir hizmettir:',
            section3Item1: 'Abonelik otomatik olarak yenilenir',
            section3Item2: 'İptal işlemi App Store ayarlarından yapılır',
            section3Item3: 'İptal, mevcut dönemin sonunda geçerli olur',
            section3Item4: 'Ücret iadesi Apple\'ın politikalarına tabidir',
            section4Title: '4. İçerik Sahipliği',
            section4Content: 'Uygulamaya yüklediğiniz tüm içeriklerin (notlar, fotoğraflar, PDF\'ler) sahipliği size aittir. NoteMerge bu içerikleri kullanmaz, paylaşmaz veya üçüncü taraflarla paylaşmaz.',
            section5Title: '5. Hizmet Değişiklikleri',
            section5Intro: 'NoteMerge, önceden haber vermeksizin:',
            section5Item1: 'Uygulama özelliklerini değiştirebilir',
            section5Item2: 'Yeni özellikler ekleyebilir',
            section5Item3: 'Mevcut özellikleri kaldırabilir',
            section5Item4: 'Fiyatlandırmayı güncelleyebilir',
            section6Title: '6. Sorumluluk Reddi',
            section6Intro: 'NoteMerge "olduğu gibi" sunulmaktadır. Aşağıdaki durumlardan sorumlu değiliz:',
            section6Item1: 'Veri kaybı',
            section6Item2: 'Hizmet kesintileri',
            section6Item3: 'Üçüncü taraf hizmet sorunları',
            section6Item4: 'Kullanıcı hatalarından kaynaklanan sorunlar',
            section7Title: '7. Hesap Askıya Alma ve Sonlandırma',
            section7Intro: 'Aşağıdaki durumlarda hesabınızı askıya alabilir veya sonlandırabiliriz:',
            section7Item1: 'Kullanım koşullarının ihlali',
            section7Item2: 'Yasadışı faaliyetler',
            section7Item3: 'Diğer kullanıcılara zarar verme',
            section7Item4: 'Ödeme sorunları',
            section8Title: '8. Fikri Mülkiyet',
            section8Content: 'NoteMerge uygulaması, logosu, tasarımı ve tüm içeriği NoteMerge\'in fikri mülkiyetidir ve telif hakkı yasalarıyla korunmaktadır.',
            section9Title: '9. Uyuşmazlık Çözümü',
            section9Content: 'Bu kullanım koşullarından kaynaklanan uyuşmazlıklar Türkiye Cumhuriyeti yasalarına tabidir ve İstanbul mahkemeleri yetkilidir.',
            section10Title: '10. İletişim',
            section10Intro: 'Kullanım koşulları hakkında sorularınız varsa:',
            emailLabel: 'E-posta:',
            webLabel: 'Web:'
        }
    },
    en: {
        nav: {
            features: 'Features',
            screenshots: 'Screenshots',
            pricing: 'Pricing',
            about: 'About',
            legal: 'Legal',
            download: 'Download'
        },
        hero: {
            title: 'Organize Your<br>Study Notes Easily',
            description: 'With NoteMerge, photograph your study notes, organize them, and merge them into a single PDF. An intelligent note management app designed for students.',
            users: 'Users',
            notes: 'Notes',
            rating: 'Rating',
            downloadFree: 'Download Free',
            exploreFeatures: 'Explore Features'
        },
        features: {
            title: 'Powerful Features',
            subtitle: 'Everything you need to manage your study notes',
            courseFolders: {
                title: 'Course Folders',
                description: 'Organize your notes by courses. Choose custom colors and icons for each course.'
            },
            quickScan: {
                title: 'Quick Scan',
                description: 'Instantly photograph your notes with the camera and add them to the app.'
            },
            pdfExport: {
                title: 'PDF Export',
                description: 'Export your notes in high-quality PDF format and share them.'
            },
            tagSystem: {
                title: 'Tag System',
                description: 'Create custom tags and easily categorize your notes.'
            },
            smartSearch: {
                title: 'Smart Search',
                description: 'Quickly search across all courses and notes.'
            },
            archiveSystem: {
                title: 'Archive System',
                description: 'Archive your old notes and create an organized library.'
            },
            easySharing: {
                title: 'Easy Sharing',
                description: 'Easily share your notes with friends.'
            },
            pageManagement: {
                title: 'Page Management',
                description: 'Reorder, delete, or add new pages.'
            },
            secureBackup: {
                title: 'Secure Backup',
                description: 'Automatically backup your notes and never lose them.'
            }
        },
        screenshots: {
            title: 'App Preview',
            subtitle: 'Modern and user-friendly interface',
            dashboard: 'Dashboard',
            tagManagement: 'Tag Management',
            createCourse: 'Create Course',
            settings: 'Settings'
        },
        pricing: {
            title: 'Simple and Transparent Pricing',
            subtitle: 'Choose the plan that fits your needs',
            free: {
                title: 'Free',
                features: [
                    '✓ 3 Courses',
                    '✓ 10 Notes/Course',
                    '✓ 3 Custom Tags',
                    '✓ PDF Export (Watermarked)',
                    '✓ Basic Features'
                ],
                cta: 'Get Started'
            },
            monthly: {
                title: 'Premium Monthly',
                badge: 'Popular',
                currency: '$',
                price: '6.99',
                period: '/mo',
                features: [
                    '✓ Unlimited Courses',
                    '✓ Unlimited Notes',
                    '✓ Unlimited Tags',
                    '✓ PDF Export (No Watermark)',
                    '✓ High Quality PDF',
                    '✓ Priority Support'
                ],
                cta: 'Go Premium'
            },
            yearly: {
                title: 'Premium Yearly',
                badge: '40% Off',
                currency: '$',
                price: '49.90',
                period: '/yr',
                note: 'Monthly $4.16',
                features: [
                    '✓ All Premium Features',
                    '✓ 40% Savings',
                    '✓ Annual Billing',
                    '✓ Cancel Anytime'
                ],
                cta: 'Best Value'
            }
        },
        about: {
            title: 'About NoteMerge',
            description1: 'NoteMerge is a modern mobile application that enables students to digitize, organize, and merge their study notes in PDF format.',
            description2: 'Our goal is to simplify note organization for students and accelerate the digital archiving process. With our user-friendly interface and powerful features, we make studying more efficient.',
            stats: {
                users: 'Active Users',
                notes: 'Notes Created',
                rating: 'User Rating'
            }
        },
        legal: {
            title: 'Legal Information',
            subtitle: 'Your privacy and security are important to us',
            privacy: {
                title: '📄 Privacy Policy',
                description: 'Detailed information about how your data is collected, used, and protected.',
                link: 'View Details →'
            },
            terms: {
                title: '📋 Terms of Service',
                description: 'Terms and conditions you accept when using the app.',
                link: 'View Details →'
            }
        },
        download: {
            title: 'Download Now',
            subtitle: 'Download NoteMerge and start organizing your study notes',
            appStore: {
                label: 'Download on the',
                name: 'App Store'
            },
            googlePlay: {
                label: 'GET IT ON',
                name: 'Google Play'
            }
        },
        footer: {
            description: 'Smart note merging app for students',
            product: 'Product',
            company: 'Company',
            legal: 'Legal',
            contact: 'Contact',
            privacy: 'Privacy Policy',
            terms: 'Terms of Service',
            copyright: '© 2026 NoteMerge. All rights reserved.',
            madeWith: 'Made with ❤️ in Istanbul'
        },
        privacyPage: {
            backLink: '← Back to Home',
            title: 'Privacy Policy',
            lastUpdated: 'Last Updated: February 19, 2026',
            intro: 'At NoteMerge, we value your privacy. This privacy policy is prepared to inform you about the information collected, used, and protected while using our application.',
            section1Title: '1. Information Collected',
            section1Intro: 'NoteMerge may collect the following information:',
            section1Item1: 'Course and note contents (stored locally on your device)',
            section1Item2: 'Application usage statistics (anonymous)',
            section1Item3: 'Device information (model, operating system version)',
            section1Item4: 'Purchase information (through App Store)',
            section2Title: '2. Use of Information',
            section2Intro: 'The collected information is used for the following purposes:',
            section2Item1: 'To provide application functionality',
            section2Item2: 'To improve user experience',
            section2Item3: 'To provide technical support',
            section2Item4: 'To manage premium subscription services',
            section3Title: '3. Data Security',
            section3Content: 'Your data is stored locally on your device. If you use iCloud synchronization, your data is encrypted and stored in accordance with Apple\'s security standards.',
            section4Title: '4. Third-Party Services',
            section4Intro: 'NoteMerge uses the following third-party services:',
            section4Item1: 'Apple App Store (purchase transactions)',
            section4Item2: 'iCloud (optional backup)',
            section5Title: '5. User Rights',
            section5Intro: 'As users, you have the following rights:',
            section5Item1: 'Right to access your data',
            section5Item2: 'Right to delete your data',
            section5Item3: 'Right to export your data',
            section5Item4: 'Right to object to data processing',
            section6Title: '6. Children\'s Privacy',
            section6Content: 'NoteMerge does not knowingly collect personal information from children under 13. Parents should supervise their children\'s use of our application.',
            section7Title: '7. Policy Changes',
            section7Content: 'This privacy policy may be updated from time to time. You will be notified within the application when significant changes occur.',
            section8Title: '8. Contact',
            section8Intro: 'If you have any questions about our privacy policy, please contact us:',
            emailLabel: 'Email:',
            webLabel: 'Web:'
        },
        termsPage: {
            backLink: '← Back to Home',
            title: 'Terms of Service',
            lastUpdated: 'Last Updated: February 19, 2026',
            intro: 'By using the NoteMerge application, you agree to the following terms of service. Please read these terms carefully.',
            section1Title: '1. Service Definition',
            section1Content: 'NoteMerge is a mobile application that enables students to digitize, organize, and merge their study notes in PDF format.',
            section2Title: '2. User Responsibilities',
            section2Intro: 'As users, you have the following responsibilities:',
            section2Item1: 'Use the application for legal purposes',
            section2Item2: 'Respect copyrighted content',
            section2Item3: 'Protect your account security',
            section2Item4: 'Respect the rights of other users',
            section3Title: '3. Premium Subscription',
            section3Intro: 'Premium subscription is a service that can be renewed monthly or annually:',
            section3Item1: 'Subscription renews automatically',
            section3Item2: 'Cancellation is done through App Store settings',
            section3Item3: 'Cancellation takes effect at the end of the current period',
            section3Item4: 'Refunds are subject to Apple\'s policies',
            section4Title: '4. Content Ownership',
            section4Content: 'You own all content (notes, photos, PDFs) you upload to the application. NoteMerge does not use, share, or distribute this content with third parties.',
            section5Title: '5. Service Changes',
            section5Intro: 'NoteMerge may, without prior notice:',
            section5Item1: 'Change application features',
            section5Item2: 'Add new features',
            section5Item3: 'Remove existing features',
            section5Item4: 'Update pricing',
            section6Title: '6. Disclaimer',
            section6Intro: 'NoteMerge is provided "as is". We are not responsible for the following:',
            section6Item1: 'Data loss',
            section6Item2: 'Service interruptions',
            section6Item3: 'Third-party service issues',
            section6Item4: 'Problems caused by user errors',
            section7Title: '7. Account Suspension and Termination',
            section7Intro: 'We may suspend or terminate your account in the following cases:',
            section7Item1: 'Violation of terms of service',
            section7Item2: 'Illegal activities',
            section7Item3: 'Harming other users',
            section7Item4: 'Payment issues',
            section8Title: '8. Intellectual Property',
            section8Content: 'The NoteMerge application, logo, design, and all content are the intellectual property of NoteMerge and are protected by copyright laws.',
            section9Title: '9. Dispute Resolution',
            section9Content: 'Disputes arising from these terms of service are subject to the laws of the Republic of Turkey and Istanbul courts have jurisdiction.',
            section10Title: '10. Contact',
            section10Intro: 'If you have any questions about the terms of service:',
            emailLabel: 'Email:',
            webLabel: 'Web:'
        }
    }
};

// Get language from URL query parameter, localStorage, or default to Turkish
function getInitialLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    if (urlLang && (urlLang === 'tr' || urlLang === 'en')) {
        return urlLang;
    }
    
    return localStorage.getItem('notemerge_lang') || 'tr';
}

let currentLang = getInitialLanguage();

// Set language
function setLanguage(lang, updateUrl = false) {
    currentLang = lang;
    localStorage.setItem('notemerge_lang', lang);
    
    // Update URL if requested
    if (updateUrl) {
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.replaceState({}, '', url);
    }
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let translation = translations[lang];
        
        for (const key of keys) {
            translation = translation[key];
        }
        
        if (translation) {
            if (element.innerHTML.includes('<br>')) {
                element.innerHTML = translation;
            } else if (element.tagName === 'SPAN' || element.tagName === 'A' || element.tagName === 'BUTTON') {
                element.textContent = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    
    // Language toggle buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang, true); // Update URL when user clicks
        });
    });
});
