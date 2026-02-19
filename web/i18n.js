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
        }
    }
};

// Get current language from localStorage or default to Turkish
let currentLang = localStorage.getItem('notemerge_lang') || 'tr';

// Set language
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('notemerge_lang', lang);
    
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
            setLanguage(lang);
        });
    });
});
