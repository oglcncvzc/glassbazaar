"use client";
import { useCart } from "@/data/CartContext";
import { Typography, Table, Button, InputNumber, Row, Col, Card, Empty, message, Spin } from "antd";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';
import { SearchContext, useTranslation } from '../layout';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const { search } = useContext(SearchContext);
  const isDark = typeof window !== 'undefined' && document.body.classList.contains('theme-dark');
  const { t } = useTranslation();

  const total = cart.reduce((sum, item) => sum + item.Price * item.quantity, 0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (cart.length >= 0) {
      timeout = setTimeout(() => setInitialLoading(false), 500);
    }
    return () => clearTimeout(timeout);
  }, [cart]);

  useEffect(() => {
    const handleThemeChange = () => {
      window.location.reload();
    };
    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

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

  return (
    <div
      style={{
        padding: '16px',
        maxWidth: 900,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Button type="text" onClick={() => router.push('/')} icon={<ArrowLeftOutlined />} size="middle" style={{ height: 36, width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }} />
        <div style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 700, lineHeight: 1, margin: 0, color: isDark ? '#ededed' : '#171717' }}>{t('my_cart')}</div>
      </div>
      {cart.length === 0 ? (
        <Empty description={t('your_cart_is_empty')} style={{ margin: 48 }} />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {cart.map(item => (
              <Card key={item.Id} style={{ width: '100%', maxWidth: 600, margin: '0 auto', padding: 12 }} bodyStyle={{ padding: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <img src={item.Image} alt={item.Name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <Link href={`/products/${encodeURIComponent(item.Category)}/${item.Id}`}>
                      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, wordBreak: 'break-word' }}>{item.Name}</div>
                    </Link>
                    <div style={{ color: '#888', fontSize: 14 }}>{item.Price} ₺</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Button size="small" onClick={() => decreaseQty(item.Id)} disabled={item.quantity <= 1} style={{ minWidth: 28, height: 28, padding: 0 }}>-</Button>
                    <InputNumber min={1} value={item.quantity} readOnly style={{ width: 44, textAlign: 'center', height: 28 }} />
                    <Button size="small" onClick={() => increaseQty(item.Id)} style={{ minWidth: 28, height: 28, padding: 0 }}>+</Button>
                  </div>
                  <div style={{ fontWeight: 500, fontSize: 15, marginLeft: 12, minWidth: 60, textAlign: 'right' }}>{(item.Price * item.quantity).toFixed(2)} ₺</div>
                  <Button type="text" danger onClick={() => removeFromCart(item.Id)} icon={<DeleteOutlined />} style={{ minWidth: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, marginLeft: 8 }} />
                </div>
              </Card>
            ))}
          </div>
          <Card
            style={{
              maxWidth: 420,
              margin: '0 auto',
              width: '100%',
              boxSizing: 'border-box',
              padding: '16px 12px',
            }}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ fontWeight: 600, fontSize: 'clamp(16px, 4vw, 20px)', marginBottom: 12, textAlign: 'center' }}>
              {t('total')}: {total.toFixed(2)} ₺
            </div>
            <Row gutter={8} style={{ width: '100%' }}>
              <Col xs={24} sm={12} style={{ marginBottom: 8 }}>
                <Link href="/products">
                  <Button block size="large">{t('continue_shopping')}</Button>
                </Link>
              </Col>
              <Col xs={24} sm={12} style={{ marginBottom: 8 }}>
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={() => {
                    message.success(t('purchase_simulated'));
                    clearCart();
                  }}
                >
                  {t('buy_now')}
                </Button>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </div>
  );
} 