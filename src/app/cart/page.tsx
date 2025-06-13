"use client";
import { useCart } from "@/data/CartContext";
import { Typography, Table, Button, InputNumber, Row, Col, Card, Empty, message, Spin } from "antd";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';
import { SearchContext } from '../layout';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [initialLoading, setInitialLoading] = useState(true);
  const { search } = useContext(SearchContext);
  const isDark = typeof window !== 'undefined' && document.body.classList.contains('theme-dark');

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
      title: "Ürün",
      dataIndex: "Name",
      key: "Name",
      render: (_: any, record: any) => (
        <Row gutter={8} align="middle">
          <Col>
            <img src={record.Image} alt={record.Name} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />
          </Col>
          <Col>
            <Link href={`/products/${record.Id}`}>{record.Name}</Link>
          </Col>
        </Row>
      ),
    },
    {
      title: "Fiyat",
      dataIndex: "Price",
      key: "Price",
      render: (price: number) => `${price} ₺`,
    },
    {
      title: "Adet",
      dataIndex: "quantity",
      key: "quantity",
      render: (_: any, record: any) => (
        <Row align="middle" gutter={4}>
          <Col>
            <Button size="small" onClick={() => decreaseQty(record.Id)} disabled={record.quantity <= 1}>-</Button>
          </Col>
          <Col>
            <InputNumber min={1} value={record.quantity} readOnly style={{ width: 48 }} />
          </Col>
          <Col>
            <Button size="small" onClick={() => increaseQty(record.Id)}>+</Button>
          </Col>
        </Row>
      ),
    },
    {
      title: "Toplam",
      key: "total",
      render: (_: any, record: any) => `${(record.Price * record.quantity).toFixed(2)} ₺`,
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: any) => (
        <Button danger onClick={() => removeFromCart(record.Id)}>Kaldır</Button>
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
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Button type="text" onClick={() => router.push('/')} icon={<ArrowLeftOutlined />} size="middle" style={{ height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }} />
        <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, margin: 0 }}>Sepetim</div>
      </div>
      {cart.length === 0 ? (
        <Empty description="Sepetinizde ürün yok." style={{ margin: 48 }} />
      ) : (
        <>
          <Table
            dataSource={cart}
            columns={columns}
            rowKey="Id"
            pagination={false}
            style={{ marginBottom: 32 }}
            scroll={{ x: true }}
          />
          <Card style={{ maxWidth: 400, margin: "0 auto" }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
              Toplam: {total.toFixed(2)} ₺
            </div>
            <Row gutter={12}>
              <Col span={12}>
                <Link href="/products">
                  <Button block>Alışverişe Devam Et</Button>
                </Link>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    message.success("Satın alma işlemi simüle edildi!");
                    clearCart();
                  }}
                >
                  Satın Al
                </Button>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </div>
  );
} 