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

  const columns = [
    {
      title: t('product'),
      dataIndex: "Name",
      key: "Name",
      render: (_: any, record: any) => (
        <Row gutter={8} align="middle">
          <Col>
            <img src={record.Image} alt={record.Name} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />
          </Col>
          <Col>
            <Link href={`/products/${encodeURIComponent(record.Category)}/${record.Id}`}>{record.Name}</Link>
          </Col>
        </Row>
      ),
    },
    {
      title: t('price'),
      dataIndex: "Price",
      key: "Price",
      render: (price: number) => `${price} ₺`,
    },
    {
      title: t('quantity'),
      dataIndex: "quantity",
      key: "quantity",
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap' }}>
          <Button 
            size="small" 
            onClick={() => decreaseQty(record.Id)} 
            disabled={record.quantity <= 1}
            style={isDark ? { background: '#23272f', color: '#ededed', borderColor: '#444', minWidth: 28, height: 28, padding: 0 } : { minWidth: 28, height: 28, padding: 0 }}
          >-</Button>
          <InputNumber 
            min={1} 
            value={record.quantity} 
            readOnly 
            style={{ 
              width: 44, 
              background: isDark ? '#23272f' : undefined, 
              color: isDark ? '#ededed' : undefined, 
              borderColor: isDark ? '#444' : undefined,
              caretColor: isDark ? '#a259ff' : undefined,
              textAlign: 'center',
              height: 28
            }} 
          />
          <Button 
            size="small" 
            onClick={() => increaseQty(record.Id)}
            style={isDark ? { background: '#23272f', color: '#ededed', borderColor: '#444', minWidth: 28, height: 28, padding: 0 } : { minWidth: 28, height: 28, padding: 0 }}
          >+</Button>
        </div>
      ),
    },
    {
      title: t('total'),
      key: "total",
      render: (_: any, record: any) => `${(record.Price * record.quantity).toFixed(2)} ₺`,
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: any) => (
        <Button 
          danger 
          onClick={() => removeFromCart(record.Id)} 
          icon={<DeleteOutlined />} 
          aria-label={t('remove')}
          style={{ minWidth: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
        />
      ),
    },
  ];

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
          <div style={{ width: '100%', overflowX: 'auto', marginBottom: 24 }}>
            <Table
              dataSource={cart}
              columns={columns.map(col => ({
                ...col,
                responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
                onHeaderCell: () => ({ style: { padding: '8px 8px', fontSize: 15 } })
              }))}
              rowKey="Id"
              pagination={false}
              style={{ width: '100%' }}
              scroll={undefined}
              size="middle"
            />
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