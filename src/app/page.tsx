"use client";
import { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/data/ProductContext";
import { useCart } from "@/data/CartContext";
import { Typography, Button, Row, Col, Card, Badge, Carousel, Spin } from "antd";
import Link from "next/link";
import { ShoppingCartOutlined, AppstoreOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { SearchContext } from './layout';
import styles from './page.module.css';
import MiniCartDropdown from './MiniCartDrawer';

const { Title } = Typography;


export default function Home() {
  const router = useRouter();
  const { products } = useProducts();
  const { cart, addToCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const { search } = useContext(SearchContext);
  const [isDark, setIsDark] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showArrows, setShowArrows] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(logged);
      setUserEmail(localStorage.getItem("userEmail") || "");
      if (!logged) router.replace("/login");
      // Son görüntülenen ürünleri getir
      try {
        const ids = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        if (Array.isArray(ids) && ids.length > 0) {
          setRecentlyViewed(products.filter(p => ids.includes(String(p.Id))));
        }
      } catch {}
      setIsDark(document.body.classList.contains('theme-dark'));

      // Tema değişimini dinle (storage ve body class değişimi)
      const handleThemeChange = () => {
        setIsDark(document.body.classList.contains('theme-dark'));
      };
      window.addEventListener('storage', handleThemeChange);
      // MutationObserver ile body class değişimini dinle
      const observer = new MutationObserver(handleThemeChange);
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      return () => {
        window.removeEventListener('storage', handleThemeChange);
        observer.disconnect();
      };
    }
  }, [router, products]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (products.length > 0) {
      timeout = setTimeout(() => setInitialLoading(false), 500);
    }
    return () => clearTimeout(timeout);
  }, [products]);

  if (initialLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? '#181818' : '#fff',
        transition: 'background 0.3s'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  // Kategoriler ve görselleri
  const categories = Array.from(new Set(products.map((p) => p.Category)));
  const categoryImages: Record<string, string> = {};
  products.forEach((p) => {
    if (!categoryImages[p.Category]) categoryImages[p.Category] = p.Image;
  });
  // Hot Deals (en yüksek puanlı ilk 4 ürün, sadece stokta olanlar)
  const hotDeals = [...products].filter(p => p.InStock).sort((a, b) => b.Rating - a.Rating).slice(0, 4);
  // Sepet özeti
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Tema için renk belirleme
  const cardBg = isDark ? '#181818' : '#fff';
  const cardColor = isDark ? '#ededed' : '#171717';
  const heroSubColor = isDark ? '#bdbdbd' : '#444';

  // Carousel için her kategoriden bir ürün seç
  const categoryFirstProducts = categories.map(cat => products.find(p => p.Category === cat)).filter(Boolean).slice(0, 3);

  return (
    <div className={styles.pageRoot} style={{ padding: '0 32px' }}>
      {/* Hero alanı */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '32px 0 24px 0', minHeight: 180 }}>
        <div className="welcome-message" style={{ marginBottom: 8, textAlign: 'center', fontSize: 16 }}>
          <b>Hoş geldiniz{userEmail ? `, ${userEmail}` : ''}!</b>
        </div>
        <Title level={1} style={{ margin: 0, fontWeight: 800, fontSize: 40, textAlign: 'center' }}>Welcome to GlassBazaar</Title>
        <div style={{ fontSize: 20, color: heroSubColor, marginBottom: 8, textAlign: 'center' }}>Discover Unique Glassware</div>
        <Button onClick={() => router.push('/products')} type="primary" size="large" style={{ marginTop: 8 }}>Shop Now</Button>
      </div>
      {/* Banner Carousel */}
      <div
        style={{ width: '100%', maxWidth: '100%', margin: '0 auto 32px auto', position: 'relative' }}
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
      >
        <Carousel
          autoplay
          dots
          
          
          
          draggable
        >
          {categoryFirstProducts.map((product, idx) => (
            product ? (
              <div key={product.Id}>
                <div
                  className={styles.carouselCard}
                  style={{
                    background:  'linear-gradient(135deg, #00cba9 0%, #3a8dde 50%, #7c2cff 100%)',
                    color: isDark ? '#fff' : '#fff',
                  }}
                >
                  <div className={styles.carouselImageBox}>
                    <img src={product.Image} alt={product.Name} className={styles.carouselImage} />
                  </div>
                  <div className={styles.carouselContent}>
                    <div className={styles.carouselTitle}>{product.Category} Fırsatları</div>
                    <div className={styles.carouselSub}>Şimdi %25'e varan indirim!</div>
                    {screen.width > 768 ?  (
                    <div className={styles.carouselDesc}>{product.Name} ve daha fazlası seni bekliyor. Sadece bu haftaya özel kampanya!</div> ) : null }
                    <Button type="primary" size="large" onClick={() => router.push(`/products?category=${encodeURIComponent(product.Category)}`)}>
                      Fırsatları Gör
                    </Button>
                  </div>
                </div>
              </div>
            ) : null
          ))}
        </Carousel>
      </div>
      {/* Kategoriler yatay scroll görsel kartlar */}
      <div style={{ margin: '32px 0 24px 0' }}>
        <Title level={4} style={{ marginLeft: 8 }}>Kategoriler</Title>
        <div style={{ display: 'flex', overflowX: 'auto', gap: 20, padding: '8px 0 8px 8px' }}>
          {categories.map((cat, idx) => (
            <Link key={cat + '-' + idx} href={`/products?category=${encodeURIComponent(cat)}`} style={{ textDecoration: 'none' }}>
              <div style={{ minWidth: 120, height: 110, background: cardBg, borderRadius: 16, boxShadow: '0 2px 8px #0001', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid #eee', color: cardColor, cursor: 'pointer' }}>
                <img src={categoryImages[cat]} alt={cat} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 12, marginBottom: 4 }} />
                <span style={{ fontWeight: 600, fontSize: 16 }}>{cat}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Hot Deals / Öne Çıkan Ürünler */}
      <div style={{ marginBottom: 32, marginTop: 32 }}>
        <Title level={4} style={{ marginLeft: 8 }}>Hot Deals</Title>
        <Row gutter={[24, 24]} style={{ margin: 0 }}>
          {hotDeals.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.Id}>
              <Link href={`/products/${product.Id}`} style={{ textDecoration: 'none' }}>
                <Card
                  hoverable
                  className="card-fade-in"
                  style={{ borderRadius: 16, minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: cardBg, color: cardColor }}
                  cover={<img alt={product.Name} src={product.Image} style={{ height: 180, objectFit: "cover", borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />}
                >
                  <Card.Meta
                    title={<span style={{ fontWeight: 700 }}>{product.Name}</span>}
                    description={<>
                      <div>Fiyat: {product.Price} ₺</div>
                      <div>Puan: {product.Rating}</div>
                    </>}
                  />
                  <Button
                    type="primary"
                    block
                    style={{ marginTop: 16 }}
                    onClick={e => { e.preventDefault(); addToCart(product); }}
                    disabled={!product.InStock}
                  >
                    Sepete Ekle
                  </Button>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
      {/* Son Görüntülenenler */}
      {recentlyViewed.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <Title level={4} style={{ marginLeft: 8 }}>Son Görüntülenenler</Title>
          <Row gutter={[24, 24]} style={{ margin: 0 }}>
            {recentlyViewed.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.Id}>
                <Link href={`/products/${product.Id}`} style={{ textDecoration: 'none' }}>
                  <Card
                    hoverable
                    className="card-fade-in"
                    style={{ borderRadius: 16, minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    cover={<img alt={product.Name} src={product.Image} style={{ height: 120, objectFit: "cover", borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />}
                  >
                    <Card.Meta
                      title={<span style={{ fontWeight: 700 }}>{product.Name}</span>}
                      description={<>
                        <div>Fiyat: {product.Price} ₺</div>
                        <div>Puan: {product.Rating}</div>
                      </>}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}
      {/* About Us */}
      <div style={{ background: isDark ? '#181818' : '#e3f2fd', borderRadius: 16, margin: '32px 16px', padding: 32, textAlign: 'center' }}>
        <Title level={5} style={{ marginBottom: 8 }}>Hakkımızda</Title>
        <div style={{ maxWidth: '100%', margin: '0 auto', color: isDark ? '#ededed' : '#333', fontSize: 16 }}>
          <b>GlassBazaar</b> el yapımı ve modern cam ürünlerinde Türkiye'nin öncü pazar yeridir. Kaliteli, özgün ve şık cam ürünleriyle evinize değer katıyoruz.<br /><br />
          <span style={{ color: '#1976d2', fontWeight: 600 }}>Yaza Özel: Tüm ürünlerde %20 indirim!</span>
        </div>
      </div>
    </div>
  );
}
