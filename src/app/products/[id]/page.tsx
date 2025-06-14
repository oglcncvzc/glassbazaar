"use client";
import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Card, Typography, Row, Col, Breadcrumb, Button, Rate, Spin } from "antd";
import productsData from "@/data/Glass_Products.json";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useCart } from '@/data/CartContext';
import { message } from 'antd';
import { useTranslation } from '../../layout';

const { Title, Paragraph } = Typography;

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const { addToCart } = useCart();
  const isDark = typeof window !== 'undefined' && document.body.classList.contains('theme-dark');
  const { t, lang } = useTranslation();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const prod = productsData.find((p: any) => String(p.Id) === id);
      setProduct(prod);
      if (prod) {
        const rel = productsData
          .filter((p: any) => p.Id !== prod.Id && p.Category === prod.Category)
          .sort((a, b) => Math.abs(b.Rating - prod.Rating) - Math.abs(a.Rating - prod.Rating))
          .slice(0, 4);
        setRelated(rel);
      }
      setLoading(false);
    }, 500); // fake loading
  }, [id]);

  useEffect(() => {
    if (typeof window !== 'undefined' && product) {
      const key = 'recentlyViewed';
      let viewed: string[] = [];
      try {
        viewed = JSON.parse(localStorage.getItem(key) || '[]');
      } catch {}
      viewed = viewed.filter((vid) => vid !== id);
      viewed.unshift(id);
      if (viewed.length > 8) viewed = viewed.slice(0, 8);
      localStorage.setItem(key, JSON.stringify(viewed));
    }
  }, [id, product]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? '#181818' : '#f5f5f5',
        transition: 'background 0.3s'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) return notFound();

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.back()} size="middle" style={{ height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }} />
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1, margin: 0, color: isDark ? '#ededed' : '#171717' }}>{product.Name}</div>
      </div>
      <Breadcrumb
        style={{ marginBottom: 16, color: isDark ? '#ededed' : '#171717' }}
        items={[
          { title: <Link href="/products" style={{ color: isDark ? '#4fa3ff' : undefined }}>{t('product_plural')}</Link> },
          { title: <span style={{ color: isDark ? '#ededed' : '#171717' }}>{product.Name}</span> },
        ]}
      />
      <Row gutter={[32, 32]} align="middle" style={{ minHeight: 400 }}>
        {/* Sol: Ürün görseli */}
        <Col xs={24} md={10} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginTop: 16 }}>
          <img alt={product.Name} src={product.Image} style={{ width: '100%', maxWidth: 400, maxHeight: 400, objectFit: 'contain' }} />
        </Col>
        {/* Sağ: Ürün detayları */}
        <Col xs={24} md={14} style={{ display: 'flex', justifyContent: 'center' }}>
          <Card variant="borderless" style={{ marginBottom: 24, width: '100%', maxWidth: 600, minHeight: 360, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Title level={3}>{product.Name}</Title>
            <Paragraph strong>{t('price')}: {product.Price} ₺</Paragraph>
            <Paragraph>
              {t('rating')}: <Rate allowHalf disabled value={product.Rating} /> ({product.Rating} / 5)
            </Paragraph>
            <Paragraph>{t('stock')}: {product.InStock ? t('available') : t('out_of_stock')}</Paragraph>
            <Paragraph>{t('categories')}: {product.Category}</Paragraph>
            <Paragraph>{t('brand')}: {product.Brand}</Paragraph>
            <Button
              type="primary"
              disabled={!product.InStock}
              onClick={() => {
                addToCart(product);
                message.success({ content: t('product_added_to_cart'), key: `add-to-cart-${product.Id}` });
              }}
            >
              {t('add_to_cart')}
            </Button>
          </Card>
        </Col>
      </Row>
      {/* Alt: Ürün açıklaması tam genişlikte */}
      <Row>
        <Col span={24}>
          <Card title={<span style={{ color: isDark ? '#ededed' : '#171717' }}>{t('product_description')}</span>} variant="borderless" style={{ marginTop: 24, background: isDark ? '#181818' : undefined }}>
            <Paragraph>{product.Description}</Paragraph>
            <Paragraph type="secondary" style={{ marginTop: 16 }}>
              {t('added_date')}: {new Date(product.CreatedDate).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
            </Paragraph>
          </Card>
        </Col>
      </Row>
      {/* Benzer Ürünler - Alt kısımda tam genişlikte */}
      {related.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <Card title={<span style={{ color: isDark ? '#ededed' : '#171717' }}>{t('similar_products')}</span>} variant="borderless" style={{ width: '100%', background: isDark ? '#181818' : undefined }}>
            <Row gutter={[16, 16]} justify="start">
              {related.map((rel: any) => (
                <Col xs={12} sm={8} md={6} key={rel.Id} style={{ display: 'flex' }}>
                  <Link href={`/products/${rel.Id}`} style={{ width: '100%', height: '100%' }}>
                    <Card
                      hoverable
                      cover={<img alt={rel.Name} src={rel.Image} style={{ height: 120, objectFit: "cover", width: '100%' }} />}
                      variant="borderless"
                      style={{ height: '100%', minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        <Card.Meta title={rel.Name} description={`${t('price')}: ${rel.Price} ₺`} />
                        <div style={{ flex: 1 }} />
                        <Button
                          type="primary"
                          size="small"
                          style={{ marginTop: 8, width: '100%' }}
                          onClick={e => {
                            e.preventDefault();
                            addToCart(rel);
                            message.success({ content: t('product_added_to_cart'), key: `add-to-cart-${rel.Id}` });
                          }}
                          disabled={!rel.InStock}
                        >
                          {t('add_to_cart')}
                        </Button>
                      </div>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      )}
    </div>
  );
} 