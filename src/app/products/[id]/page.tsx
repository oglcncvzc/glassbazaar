"use client";
import React, { useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, Typography, Row, Col, Breadcrumb, Button, Rate } from "antd";
import productsData from "@/data/Glass_Products.json";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useCart } from '@/data/CartContext';
import { message } from 'antd';

const { Title, Paragraph } = Typography;

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const product = productsData.find((p: any) => String(p.Id) === id);
  if (!product) return notFound();

  
  const related = productsData
    .filter((p: any) => p.Id !== product.Id && p.Category === product.Category)
    .sort((a, b) => Math.abs(b.Rating - product.Rating) - Math.abs(a.Rating - product.Rating))
    .slice(0, 4);

  const { addToCart } = useCart();

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
  }, [id]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.back()} size="middle" style={{ height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }} />
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1, margin: 0 }}>{product.Name}</div>
      </div>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link href="/products">Ürünler</Link> },
          { title: product.Name },
        ]}
      />
      <Row gutter={[32, 32]}>
        <Col xs={24} md={10}>
          <Card
            cover={<img alt={product.Name} src={product.Image} style={{ width: "100%", maxHeight: 400, objectFit: "contain" }} />}
            variant="borderless"
          >
            <Title level={3}>{product.Name}</Title>
            <Paragraph strong>Fiyat: {product.Price} ₺</Paragraph>
            <Paragraph>
              Puan: <Rate allowHalf disabled value={product.Rating} /> ({product.Rating} / 5)
            </Paragraph>
            <Paragraph>Stok: {product.InStock ? "Var" : "Yok"}</Paragraph>
            <Paragraph>Kategori: {product.Category}</Paragraph>
            <Paragraph>Marka: {product.Brand}</Paragraph>
            <Button
              type="primary"
              disabled={!product.InStock}
              onClick={() => {
                addToCart(product);
                message.success('Ürün sepete eklendi!');
              }}
            >
              Sepete Ekle
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={14}>
          <Card title="Ürün Açıklaması" variant="borderless">
            <Paragraph>{product.Description}</Paragraph>
            <Paragraph type="secondary" style={{ marginTop: 16 }}>
              Eklenme Tarihi: {new Date(product.CreatedDate).toLocaleDateString("tr-TR")}
            </Paragraph>
          </Card>
          {related.length > 0 && (
            <Card title="Benzer Ürünler" style={{ marginTop: 32 }} variant="borderless">
              <Row gutter={[16, 16]}>
                {related.map((rel: any) => (
                  <Col xs={24} sm={12} md={6} key={rel.Id}>
                    <Link href={`/products/${rel.Id}`}>
                      <Card
                        hoverable
                        cover={<img alt={rel.Name} src={rel.Image} style={{ height: 100, objectFit: "cover" }} />}
                        variant="borderless"
                      >
                        <Card.Meta title={rel.Name} description={`Fiyat: ${rel.Price} ₺`} />
                        <Button
                          type="primary"
                          size="small"
                          style={{ marginTop: 8 }}
                          onClick={e => {
                            e.preventDefault();
                            addToCart(rel);
                            message.success('Ürün sepete eklendi!');
                          }}
                          disabled={!rel.InStock}
                        >
                          Sepete Ekle
                        </Button>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
} 