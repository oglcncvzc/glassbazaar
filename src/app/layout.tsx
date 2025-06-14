'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, createContext, useContext, useRef } from 'react';
import { Button, Layout, Input, Badge } from 'antd';
import { ProductProvider } from '../data/ProductContext';
import { CartProvider, useCart } from '../data/CartContext';
import { ShoppingCartOutlined, SearchOutlined, LogoutOutlined, SunOutlined, MoonOutlined, DownOutlined, CheckOutlined } from '@ant-design/icons';
import Link from 'next/link';
import MiniCartDrawer from './MiniCartDrawer';
import en from '../locales/en.json';
import tr from '../locales/tr.json';

const { Header, Content } = Layout;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Search context
export const SearchContext = createContext({ search: '', setSearch: (_: string) => {} });

// Dil context'i
export const LanguageContext = createContext({ lang: 'tr', setLang: (_: string) => {} });

function CartButtonWithBadge({
  windowWidth,
  iconBg,
  iconColor,
  cartButtonRef,
  setIsCartOpen,
  isCartOpen,
  MiniCartDrawer
}: {
  windowWidth: number,
  iconBg: string,
  iconColor: string,
  cartButtonRef: React.RefObject<HTMLDivElement | null>,
  setIsCartOpen: (open: boolean) => void,
  isCartOpen: boolean,
  MiniCartDrawer: any
}) {
  const { cart } = useCart();
  const cartCount = cart && Array.isArray(cart) ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  return (
    <>
      <div ref={cartButtonRef}>
        <Badge count={cartCount} overflowCount={99} showZero style={{ backgroundColor: 'transparent', color: 'purple', border: 'none' }} offset={[0, 8]}>
          <Button 
          type="text"
            shape="circle" 
            icon={<ShoppingCartOutlined style={{ fontSize: windowWidth < 600 ? 12 : windowWidth < 768 ? 16 : 20, color: iconColor }} />} 
            size={windowWidth < 600 ? 'small' : windowWidth < 768 ? 'middle' : 'large'} 
            style={{  height: windowWidth < 600 ? 22 : windowWidth < 768 ? 32 : 40, width: windowWidth < 600 ? 22 : windowWidth < 768 ? 32 : 40, minWidth: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setIsCartOpen(true)}
          />
        </Badge>
      </div>
      <MiniCartDrawer 
        open={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        anchorRef={cartButtonRef}
        windowWidth={windowWidth}
        cartCount={cartCount}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  // Route guard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      // Sadece korumalı sayfalara erişimde login kontrolü yap
      const protectedRoutes = ['/products', '/products/', '/products/[id]'];
      if (!isLoggedIn && (pathname.startsWith('/products'))) {
        router.replace('/login');
      }
      // Kullanıcı login olduysa ana sayfada kalabilir, otomatik yönlendirme yok
    }
  }, [pathname, router]);

  // Çıkış fonksiyonu
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      router.replace('/login');
    }
  };

  const [theme, setTheme] = useState('system');
  const [clientTheme, setClientTheme] = useState('system');
  const [clientIsLoggedIn, setClientIsLoggedIn] = useState(false);
  const [search, setSearch] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartButtonRef = useRef<HTMLDivElement | null>(null);
  const [lang, setLang] = useState('tr');

  // Tema değiştirici fonksiyon
  const toggleTheme = () => {
    let nextTheme = clientTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setClientTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', nextTheme);
      document.body.classList.remove('theme-dark', 'theme-light');
      document.body.classList.add(`theme-${nextTheme}`);
    }
  };

  // İlk yüklemede ve route değiştikçe, ayrıca localStorage değiştikçe login kontrolü yap
  useEffect(() => {
    function syncLoginState() {
      setClientIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }
    syncLoginState();
    window.addEventListener('storage', syncLoginState);
    return () => window.removeEventListener('storage', syncLoginState);
  }, [pathname]);

  // İlk yüklemede body class'ını ve theme state'ini ayarla
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) {
        setTheme(saved);
        setClientTheme(saved);
        document.body.classList.remove('theme-dark', 'theme-light');
        document.body.classList.add(`theme-${saved}`);
      }
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dil seçimi localStorage ile kalıcı olsun
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (stored) setLang(stored);
  }, []);
  const handleLangChange = (lng: string) => {
    setLang(lng);
    if (typeof window !== 'undefined') localStorage.setItem('lang', lng);
  };

  // Tema renkleri
  const isDark = typeof window !== 'undefined' && document.body.classList.contains('theme-dark');
  const headerBg = isDark ? '#181818' : '#fff';
  const headerColor = isDark ? '#ededed' : '#171717';
  const iconBg = isDark ? '#222' : '#eee';
  const iconColor = isDark ? '#ededed' : '#171717';
  const searchBg = isDark ? '#111' : '#f5f5f5';
  const searchColor = isDark ? '#ededed' : '#171717';

  const { t } = useTranslation();

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageContext.Provider value={{ lang, setLang: handleLangChange }}>
        <SearchContext.Provider value={{ search, setSearch }}>
        <ProductProvider>
          <CartProvider>
            <Layout style={{ minHeight: '100vh' }}>
              {pathname !== '/login' && (
                <Header style={{
                  width: '100vw',
                  minWidth: 0,
                  left: 0,
                  right: 0,
                  background: headerBg,
                  color: headerColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: windowWidth < 600 ? 2 : windowWidth < 768 ? 6 : 16,
                  height: windowWidth < 600 ? 38 : windowWidth < 768 ? 48 : 64,
                  padding: windowWidth < 600 ? '0 2px' : windowWidth < 768 ? '0 8px' : '0 32px',
                  boxShadow: '0 2px 8px #0001',
                  position: 'sticky',
                  top: 0,
                  zIndex: 100,
                  overflowX: 'hidden',
                  overflow: 'visible',
                }}>
                  {/* Logo ve isim */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth < 600 ? 4 : windowWidth < 768 ? 8 : 16, flexShrink: 0 }}>
                    <span className="logo-text" style={{ fontWeight: 700, letterSpacing: 1, color: isDark ? headerColor : '#7c2cff', fontSize: windowWidth < 600 ? 15 : windowWidth < 768 ? 20 : undefined, cursor: 'pointer' }} onClick={() => router.push('/') }>
                      GlassBazaar
                    </span>
                  </div>
                  {/* Dil seçici dropdown */}
                  <div style={{ marginLeft: 8, marginRight: 8, flexShrink: 0 }}>
                    <LanguageDropdown lang={lang} onChange={handleLangChange} />
                  </div>
                  {/* Arama barı */}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
                    <Input.Search
                      className="search-input"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      onSearch={v => {
                        if (v.trim()) {
                          router.push(`/products?search=${encodeURIComponent(v)}`);
                        }
                      }}
                      placeholder={t('search_placeholder')}
                      enterButton={<Button type="primary" style={{ backgroundColor: 'orange', borderColor: 'orange' }}>{t('search')}</Button>}
                      size={windowWidth < 600 ? 'small' : windowWidth < 768 ? 'middle' : 'large'}
                      style={{
                        width: windowWidth < 600 ? 160 : windowWidth < 768 ? 160 : 260,
                        maxWidth: '100%',
                        fontSize: windowWidth < 600 ? 11 : windowWidth < 768 ? 13 : 15,
                        height: windowWidth < 600 ? 22 : windowWidth < 768 ? 28 : 38
                      }}
                    />
                  </div>
                  {/* Sağ aksiyonlar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth < 600 ? 2 : windowWidth < 768 ? 4 : 10 }}>
                    <CartButtonWithBadge
                      windowWidth={windowWidth}
                      iconBg={iconBg}
                      iconColor={iconColor}
                      cartButtonRef={cartButtonRef}
                      setIsCartOpen={setIsCartOpen}
                      isCartOpen={isCartOpen}
                      MiniCartDrawer={MiniCartDrawer}
                    />
                    <Button type="text" shape="circle" onClick={toggleTheme} style={{  color: iconColor, height: windowWidth < 600 ? 22 : windowWidth < 768 ? 32 : 40, width: windowWidth < 600 ? 22 : windowWidth < 768 ? 32 : 40, minWidth: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: windowWidth < 600 ? 12 : windowWidth < 768 ? 16 : undefined }}>
                      {clientTheme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                    </Button>
                    {clientIsLoggedIn && (
                      windowWidth < 768 ? (
                        <Button type="text" onClick={handleLogout} style={{ marginRight: 8, height: windowWidth < 600 ? 22 : 32, width: windowWidth < 600 ? 22 : 32, minWidth: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} icon={<LogoutOutlined style={{ fontSize: windowWidth < 600 ? 12 : 18 }} />} />
                      ) : (
                        <Button type="primary" onClick={handleLogout} style={{ marginRight: 8, height: 40, fontSize: 15, padding: '0 16px' }}>
                          {t('logout')}
                        </Button>
                      )
                    )}
                  </div>
                </Header>
              )}
              <Content>{children}</Content>
            </Layout>
          </CartProvider>
        </ProductProvider>
        </SearchContext.Provider>
        </LanguageContext.Provider>
      </body>
    </html>
  );
}

// Dil seçici dropdown componenti
function LanguageDropdown({ lang, onChange }: { lang: string, onChange: (lng: string) => void }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const isDark = typeof window !== 'undefined' && document.body.classList.contains('theme-dark');
  const menuBg = isDark ? '#23272f' : '#fff';
  const menuBorder = isDark ? '#333' : '#ececec';
  const menuShadow = isDark ? '0 4px 16px #0006' : '0 4px 16px #0001';
  const itemSelectedBg = isDark ? '#2d323c' : '#f5f5f5';
  const itemHoverBg = isDark ? '#313743' : '#f0f0f0';
  const itemColor = isDark ? '#eee' : '#222';
  return (
    <div style={{ position: 'relative', zIndex: 999 }}>
      <Button type="text" onClick={() => setOpen(o => !o)} style={{ minWidth: 32, padding: '0 8px', height: 32, fontWeight: 500, fontSize: 14, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: itemColor, background: isDark ? '#23272f' : '#fff', border: isDark ? '1px solid #333' : undefined }}>
        {lang === 'tr' ? t('turkish') : t('english')} <DownOutlined style={{ fontSize: 12, marginLeft: 2 }} />
      </Button>
      {open && (
        <div style={{
          position: 'absolute',
          top: 36,
          left: 0,
          background: menuBg,
          borderRadius: 10,
          boxShadow: menuShadow,
          minWidth: 80,
          padding: 0,
          overflow: 'hidden',
          border: `1px solid ${menuBorder}`,
          fontSize: 15,
        }}>
          <div
            onClick={() => { onChange('en'); setOpen(false); }}
            style={{
              padding: '7px 0 7px 0',
              cursor: 'pointer',
              background: lang === 'en' ? itemSelectedBg : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              fontWeight: lang === 'en' ? 600 : 400,
              color: itemColor,
              borderBottom: `1px solid ${isDark ? '#292929' : '#f0f0f0'}`,
              paddingLeft: 18,
              position: 'relative',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = itemHoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = lang === 'en' ? itemSelectedBg : 'transparent')}
          >
            {lang === 'en' && <CheckOutlined style={{ fontSize: 15, color: itemColor }} />} {t('english')}
          </div>
          <div
            onClick={() => { onChange('tr'); setOpen(false); }}
            style={{
              padding: '7px 0 7px 0',
              cursor: 'pointer',
              background: lang === 'tr' ? itemSelectedBg : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              fontWeight: lang === 'tr' ? 600 : 400,
              color: itemColor,
              paddingLeft: 18,
              position: 'relative',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = itemHoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = lang === 'tr' ? itemSelectedBg : 'transparent')}
          >
            {lang === 'tr' && <CheckOutlined style={{ fontSize: 15, color: itemColor }} />} {t('turkish')}
          </div>
        </div>
      )}
    </div>
  );
}

// Basit çeviri fonksiyonu
export function useTranslation() {
  const { lang } = useContext(LanguageContext);
  const dict = lang === 'en' ? en : tr;
  function t(key: string) {
    return (dict as any)[key] || key;
  }
  return { t, lang };
}
