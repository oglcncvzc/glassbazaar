'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, createContext, useContext, useRef } from 'react';
import { Button, Layout, Input, Badge } from 'antd';
import { ProductProvider } from '../data/ProductContext';
import { CartProvider, useCart } from '../data/CartContext';
import { ShoppingCartOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';
import MiniCartDrawer from './MiniCartDrawer';

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
        <Badge count={cartCount} overflowCount={99} showZero style={{ backgroundColor: '#1677ff', color: '#fff' }}>
          <Button 
            shape="circle" 
            icon={<ShoppingCartOutlined style={{ fontSize: windowWidth < 600 ? 12 : windowWidth < 768 ? 16 : 20, color: iconColor }} />} 
            size={windowWidth < 600 ? 'small' : windowWidth < 768 ? 'middle' : 'large'} 
            style={{ background: iconBg, border: '1px solid #eee', height: windowWidth < 600 ? 22 : windowWidth < 768 ? 32 : 40, width: windowWidth < 600 ? 22 : windowWidth < 768 ? 32 : 40, minWidth: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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

  // Tema renkleri
  const isDark = typeof window !== 'undefined' && document.body.classList.contains('theme-dark');
  const headerBg = isDark ? '#181818' : '#fff';
  const headerColor = isDark ? '#ededed' : '#171717';
  const iconBg = isDark ? '#222' : '#eee';
  const iconColor = isDark ? '#ededed' : '#171717';
  const searchBg = isDark ? '#111' : '#f5f5f5';
  const searchColor = isDark ? '#ededed' : '#171717';

  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
                  justifyContent: 'space-between',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: windowWidth < 600 ? 4 : windowWidth < 768 ? 8 : 16 }}>
                    <span className="logo-text" style={{ fontWeight: 700, letterSpacing: 1, color: headerColor, fontSize: windowWidth < 600 ? 15 : windowWidth < 768 ? 20 : undefined }}>
                      GlassBazaar
                    </span>
                  </div>
                  {/* Arama barı */}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <Input.Search
                      className="search-input"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      onSearch={v => {
                        if (v.trim()) {
                          router.push(`/products?search=${encodeURIComponent(v)}`);
                        }
                      }}
                      placeholder="Ürün veya kategori ara..."
                      enterButton
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
                    <Button onClick={toggleTheme} style={{ background: iconBg, color: iconColor, border: '1px solid #eee', height: windowWidth < 600 ? 22 : windowWidth < 768 ? 32 : 40, width: windowWidth < 600 ? 22 : windowWidth < 768 ? 32 : 40, minWidth: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: windowWidth < 600 ? 12 : windowWidth < 768 ? 16 : undefined }}>
                      {clientTheme === 'dark' ? '☀️' : '🌙'}
                    </Button>
                    {clientIsLoggedIn && (
                      windowWidth < 768 ? (
                        <Button type="primary" onClick={handleLogout} style={{ marginRight: 8, height: windowWidth < 600 ? 22 : 32, width: windowWidth < 600 ? 22 : 32, minWidth: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} icon={<LogoutOutlined style={{ fontSize: windowWidth < 600 ? 12 : 18 }} />} />
                      ) : (
                        <Button type="primary" onClick={handleLogout} style={{ marginRight: 8, height: 40, fontSize: 15, padding: '0 16px' }}>
                          Çıkış Yap
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
      </body>
    </html>
  );
}
