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
import { useTranslation } from '../../../layout';

const { Title, Paragraph } = Typography;

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const category = params.category as string;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const { addToCart } = useCart();
  const isDark = typeof window !== 'undefined' && document.body.classList.contains('theme-dark');
  const { t, lang } = useTranslation();

  const prettyCategory = decodeURIComponent(category)
    .replace(/[-+]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const normalize = (str: string) => decodeURIComponent(str).toLowerCase().replace(/\s+/g, '');
      const prod = productsData.find((p: any) =>
        String(p.Id) === id &&
        normalize(p.Category) === normalize(category)
      );
      if (!prod) {
        router.push('/products');
        return;
      }
      setProduct(prod);
      if (prod) {
        const rel = productsData
          .filter((p: any) => p.Id !== prod.Id && normalize(p.Category) === normalize(prod.Category))
          .sort((a, b) => Math.abs(b.Rating - prod.Rating) - Math.abs(a.Rating - prod.Rating))
          .slice(0, 6);
        setRelated(rel);
      }
      setLoading(false);
    }, 500);
  }, [id, category, router]);

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
          { title: <Link href={`/products?category=${encodeURIComponent(category)}`} style={{ color: isDark ? '#4fa3ff' : undefined }}>{prettyCategory}</Link> },
          { title: <span style={{ color: isDark ? '#ededed' : '#171717' }}>{product.Name}</span> },
        ]}
      />
      <Row gutter={[32, 32]} align="stretch" style={{ minHeight: 400, justifyContent: 'flex-start' }}>
        <Col xs={24} md={15} style={{ display: 'flex', justifyContent: 'flex-start', maxWidth: 850, paddingLeft: 0 }}>
          <Card 
            variant="borderless" 
            style={{ 
              width: '100%', 
              maxWidth: 850, 
              minHeight: 340,
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
              padding: 40,
              background: isDark ? '#181818' : '#fff',
              marginLeft: 32,
              marginRight: 0,
              boxSizing: 'border-box',
              flex: 1,
              alignItems: 'stretch',
              borderRadius: 18,
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 220px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 140 }}>
                <img 
                  alt={product.Name} 
                  src={product.Image} 
                  style={{ 
                    width: '100%', 
                    maxWidth: 220, 
                    maxHeight: 220, 
                    objectFit: 'contain',
                    borderRadius: 12,
                    background: '#f7f7f7',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)'
                  }} 
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%', minWidth: 180 }}>
                <Title level={3} style={{ marginTop: 0, marginBottom: 12, fontWeight: 700 }}>{product.Name}</Title>
                <Paragraph strong style={{ marginBottom: 8, fontSize: 18 }}>{t('price')}: <span style={{fontWeight:600}}>{product.Price} ₺</span></Paragraph>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ marginRight: 8 }}>{t('rating')}:</span>
                  <Rate style={{ fontSize: 18 }} allowHalf disabled value={product.Rating} />
                  <span style={{ marginLeft: 8 }}>{product.Rating}</span>
                </div>
                <Paragraph style={{ marginBottom: 8 }}>{t('stock')}: {product.InStock ? t('available') : t('out_of_stock')}</Paragraph>
                <Paragraph style={{ marginBottom: 8 }}>{t('categories')}: {product.Category}</Paragraph>
                <Paragraph style={{ marginBottom: 16 }}>{t('brand')}: {product.Brand}</Paragraph>
                <Button
                  type="primary"
                  disabled={!product.InStock}
                  onClick={() => {
                    addToCart(product);
                    message.success({ content: t('product_added_to_cart'), key: `add-to-cart-${product.Id}` });
                  }}
                  style={{ marginTop: 12, width: 180, alignSelf: 'flex-start', fontWeight: 600 }}
                >
                  {t('add_to_cart')}
                </Button>
              </div>
            </div>
            <div style={{ marginTop: 18, width: '100%', borderTop: '1px solid #ececec', paddingTop: 18 }}>
              <Title level={5} style={{ marginBottom: 8 }}>{t('product_description')}</Title>
              <Paragraph>{product.Description}</Paragraph>
              <Paragraph type="secondary" style={{ marginTop: 8, fontSize: 13 }}>
                {t('added_date')}: {new Date(product.CreatedDate).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
              </Paragraph>
            </div>
          </Card>
        </Col>
        {related.length > 0 && (
          <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div style={{ position: 'sticky', top: 32, zIndex: 2 }}>
              <Card title={<span style={{ color: isDark ? '#ededed' : '#171717' }}>{t('similar_products')}</span>} variant="borderless" style={{ width: '100%', maxWidth: 900, background: isDark ? '#181818' : undefined, minHeight: 400, margin: '0 auto' }}>
                <Row gutter={[16, 16]} justify="start">
                  {related.slice(0, 6).map((rel: any) => (
                    <Col xs={12} md={8} key={rel.Id} style={{ display: 'flex' }}>
                      <Link href={`/products/${rel.Category}/${rel.Id}`} style={{ width: '100%', height: '100%' }}>
                        <Card
                          hoverable
                          cover={<img alt={rel.Name} src={rel.Image} style={{ height: 120, objectFit: "cover", width: '100%' }} />}
                          variant="borderless"
                          style={{ height: '100%', minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 12 }}
                        >
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                            <Card.Meta title={rel.Name} description={`${t('price')}: ${rel.Price} ₺`} />
                            <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 0 0' }}>
                              <Rate style={{ fontSize: 14 }} allowHalf disabled value={rel.Rating} />
                              <span style={{ marginLeft: 6, fontSize: 13, color: '#888' }}>{rel.Rating}</span>
                            </div>
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
          </Col>
        )}
      </Row>
    </div>
  );
} 