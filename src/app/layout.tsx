'use client';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, createContext, useContext } from 'react';
import { Button, Layout } from 'antd';
import { ProductProvider } from '../data/ProductContext';
import { CartProvider } from '../data/CartContext';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';

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
      setClientIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }
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
                  background: headerBg,
                  color: headerColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  height: 64,
                  padding: '0 32px',
                  boxShadow: '0 2px 8px #0001',
                  position: 'sticky',
                  top: 0,
                  zIndex: 100
                }}>
                  {/* Logo ve isim */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: 1, color: headerColor }}>
                      <span style={{ display: 'inline-block', width: 28, height: 28, background: iconBg, borderRadius: 8, marginRight: 8 }}></span>
                      GlassBazaar
                    </span>
                  </div>
                  {/* Arama barı */}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <input
                      type="text"
                      className="search-input"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && search.trim()) {
                          router.push(`/products?search=${encodeURIComponent(search)}`);
                        }
                      }}
                      placeholder="Ürün veya kategori ara..."
                      style={{
                        width: 260,
                        maxWidth: '100%',
                        padding: '7px 14px',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                        fontSize: 15,
                        background: searchBg,
                        color: searchColor,
                        boxShadow: '0 1px 4px #0001',
                        outline: 'none',
                        transition: 'border 0.2s',
                        height: 38
                      }}
                    />
                    <Button
                      icon={<SearchOutlined />}
                      style={{ marginLeft: 8 }}
                      onClick={() => {
                        if (search.trim()) {
                          router.push(`/products?search=${encodeURIComponent(search)}`);
                        }
                      }}
                    />
                  </div>
                  {/* Sağ aksiyonlar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Link href="/cart">
                      <Button shape="circle" icon={<ShoppingCartOutlined style={{ fontSize: 20, color: iconColor }} />} size="large" style={{ background: iconBg, border: '1px solid #eee' }} />
                    </Link>
                    <Button onClick={toggleTheme} style={{ background: iconBg, color: iconColor, border: '1px solid #eee' }}>
                      {clientTheme === 'dark' ? '☀️' : '🌙'}
                    </Button>
                    {clientIsLoggedIn && (
                      <Button type="primary" onClick={handleLogout}>
                        Çıkış Yap
                      </Button>
                    )}
                  </div>
                </Header>
              )}
              <Content style={{ padding: 0, background: 'inherit' }}>{children}</Content>
            </Layout>
          </CartProvider>
        </ProductProvider>
        </SearchContext.Provider>
      </body>
    </html>
  );
}
