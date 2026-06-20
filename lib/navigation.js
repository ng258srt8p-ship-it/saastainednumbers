// Navigation configuration with updated links for E-E-A-T compliance
const navigationConfig = {
  en: {
    main: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Calculators', href: '/calculators' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Blog', href: '/blog' }
    ],
    mobile: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Calculators', href: '/categories' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Blog', href: '/blog' },
      { label: 'Log In', href: '/auth/signin' }
    ]
  },
  es: {
    main: [
      { label: 'Inicio', href: '/es' },
      { label: 'Sobre Nosotros', href: '/es/about' },
      { label: 'Contáctenos', href: '/es/contact' },
      { label: 'Calculadoras', href: '/es/calculators' },
      { label: 'Dashboard', href: '/es/dashboard' },
      { label: 'Precios', href: '/es/pricing' },
      { label: 'Blog', href: '/es/blog' }
    ],
    mobile: [
      { label: 'Inicio', href: '/es' },
      { label: 'Sobre Nosotros', href: '/es/about' },
      { label: 'Contáctenos', href: '/es/contact' },
      { label: 'Calculadoras', href: '/es/categories' },
      { label: 'Dashboard', href: '/es/dashboard' },
      { label: 'Precios', href: '/es/pricing' },
      { label: 'Blog', href: '/es/blog' },
      { label: 'Iniciar Sesión', href: '/es/auth/signin' }
    ]
  },
  de: {
    main: [
      { label: 'Startseite', href: '/de' },
      { label: 'Über Uns', href: '/de/about' },
      { label: 'Kontakt', href: '/de/contact' },
      { label: 'Rechner', href: '/de/calculators' },
      { label: 'Dashboard', href: '/de/dashboard' },
      { label: 'Preise', href: '/de/pricing' },
      { label: 'Blog', href: '/de/blog' }
    ],
    mobile: [
      { label: 'Startseite', href: '/de' },
      { label: 'Über Uns', href: '/de/about' },
      { label: 'Kontakt', href: '/de/contact' },
      { label: 'Rechner', href: '/de/categories' },
      { label: 'Dashboard', href: '/de/dashboard' },
      { label: 'Preise', href: '/de/pricing' },
      { label: 'Blog', href: '/de/blog' },
      { label: 'Anmelden', href: '/de/auth/signin' }
    ]
  },
  pt: {
    main: [
      { label: 'Início', href: '/pt' },
      { label: 'Sobre Nós', href: '/pt/about' },
      { label: 'Contate-nos', href: '/pt/contact' },
      { label: 'Calculadoras', href: '/pt/calculators' },
      { label: 'Dashboard', href: '/pt/dashboard' },
      { label: 'Preços', href: '/pt/pricing' },
      { label: 'Blog', href: '/pt/blog' }
    ],
    mobile: [
      { label: 'Início', href: '/pt' },
      { label: 'Sobre Nós', href: '/pt/about' },
      { label: 'Contate-nos', href: '/pt/contact' },
      { label: 'Calculadoras', href: '/pt/categories' },
      { label: 'Dashboard', href: '/pt/dashboard' },
      { label: 'Preços', href: '/pt/pricing' },
      { label: 'Blog', href: '/pt/blog' },
      { label: 'Entrar', href: '/pt/auth/signin' }
    ]
  },
  fr: {
    main: [
      { label: 'Accueil', href: '/fr' },
      { label: 'À propos', href: '/fr/about' },
      { label: 'Nous contacter', href: '/fr/contact' },
      { label: 'Calculatrices', href: '/fr/calculators' },
      { label: 'Tableau de bord', href: '/fr/dashboard' },
      { label: 'Tarifs', href: '/fr/pricing' },
      { label: 'Blog', href: '/fr/blog' }
    ],
    mobile: [
      { label: 'Accueil', href: '/fr' },
      { label: 'À propos', href: '/fr/about' },
      { label: 'Nous contacter', href: '/fr/contact' },
      { label: 'Calculatrices', href: '/fr/categories' },
      { label: 'Tableau de bord', href: '/fr/dashboard' },
      { label: 'Tarifs', href: '/fr/pricing' },
      { label: 'Blog', href: '/fr/blog' },
      { label: 'Se connecter', href: '/fr/auth/signin' }
    ]
  },
  ja: {
    main: [
      { label: 'ホーム', href: '/ja' },
      { label: '私たちについて', href: '/ja/about' },
      { label: 'お問い合わせ', href: '/ja/contact' },
      { label: '電卓', href: '/ja/calculators' },
      { label: 'ダッシュボード', href: '/ja/dashboard' },
      { label: '価格', href: '/ja/pricing' },
      { label: 'ブログ', href: '/ja/blog' }
    ],
    mobile: [
      { label: 'ホーム', href: '/ja' },
      { label: '私たちについて', href: '/ja/about' },
      { label: 'お問い合わせ', href: '/ja/contact' },
      { label: '電卓', href: '/ja/categories' },
      { label: 'ダッシュボード', href: '/ja/dashboard' },
      { label: '価格', href: '/ja/pricing' },
      { label: 'ブログ', href: '/ja/blog' },
      { label: 'ログイン', href: '/ja/auth/signin' }
    ]
  }
};

// Function to get navigation for current locale
function getNavigation(locale = 'en', type = 'main') {
  const config = navigationConfig[locale] || navigationConfig.en;
  return config[type] || config.main;
}

module.exports = { navigationConfig, getNavigation };