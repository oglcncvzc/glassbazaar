"use client";
import React, { useState, useMemo, useEffect, useContext } from "react";
import { Card, Row, Col, Typography, Input, Select, Checkbox, Pagination, Space, Button, Rate, Spin } from "antd";
import productsData from "@/data/Glass_Products.json";
import Link from "next/link";
import { useCart } from '@/data/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchContext } from '../layout';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;


const categories = Array.from(new Set(productsData.map((p: any) => p.Category)));

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const initialCategory = searchParams.get('category');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sort, setSort] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { search: globalSearch } = useContext(SearchContext);
  const isDark = typeof window !== 'undefined' && document.body.classList.contains('theme-dark');

  
  let userEmail = '';
  if (typeof window !== 'undefined') {
    userEmail = localStorage.getItem('userEmail') || '';
  }

  const initialSearch = searchParams.get('search') || '';
  useEffect(() => {
    setSearch(initialSearch);
    if (initialCategory) setSelectedCategories([initialCategory]);
  }, [initialSearch, initialCategory]);

  const filteredProducts = useMemo(() => {
    let filtered = productsData;
    if (search) {
      filtered = filtered.filter((p: any) => p.Name.toLowerCase().includes(search.toLowerCase()));
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p: any) => selectedCategories.includes(p.Category));
    }
    if (inStockOnly) {
      filtered = filtered.filter((p: any) => p.InStock);
    }
    if (sort === "price-asc") {
      filtered = [...filtered].sort((a, b) => a.Price - b.Price);
    } else if (sort === "price-desc") {
      filtered = [...filtered].sort((a, b) => b.Price - a.Price);
    }
    return filtered;
  }, [search, selectedCategories, inStockOnly, sort]);

  
  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setSearch(e.target.value);
    setPage(1);
    const params = new URLSearchParams();
    if (e.target.value) params.set('search', e.target.value);
    if (selectedCategories.length > 0) params.set('category', selectedCategories[0]);
    router.replace(`/products?${params.toString()}`);
    setTimeout(() => setLoading(false), 500);
  };

  const handleCategoryChange = (v: string[]) => {
    setLoading(true);
    setSelectedCategories(v);
    setPage(1);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (v.length > 0) params.set('category', v[0]);
    router.replace(`/products?${params.toString()}`);
    setTimeout(() => setLoading(false), 500);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (filteredProducts.length > 0) {
      timeout = setTimeout(() => setInitialLoading(false), 500);
    }
    return () => clearTimeout(timeout);
  }, [filteredProducts]);

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
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Button type="text" onClick={() => router.push('/')} icon={<ArrowLeftOutlined />} size="middle" style={{ height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }} />
        <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, margin: 0 }}>Ürünler</div>
      </div>
      <Space direction="vertical" size="middle" style={{ width: "100%", marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              className="search-input"
              placeholder="Ürün adına göre ara"
              value={search}
              onChange={handleSearchChange}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              mode="multiple"
              allowClear
              placeholder="Kategori seç"
              style={{ width: "100%" }}
              value={selectedCategories}
              onChange={handleCategoryChange}
            >
              {categories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Fiyata göre sırala"
              style={{ width: "100%" }}
              value={sort}
              onChange={v => setSort(v)}
              allowClear
            >
              <Option value="price-asc">Fiyat: Artan</Option>
              <Option value="price-desc">Fiyat: Azalan</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} style={{ display: "flex", alignItems: "center" }}>
            <Checkbox checked={inStockOnly} onChange={e => { setInStockOnly(e.target.checked); setPage(1); }}>
              Sadece stokta olanlar
            </Checkbox>
          </Col>
        </Row>
      </Space>
      {loading ? (
        <div style={{ textAlign: 'center', margin: '48px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {pagedProducts.map((product: any) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.Id}>
              <Link href={`/products/${product.Id}`} style={{ textDecoration: "none" }}>
                <Card
                  hoverable
                  className="card-fade-in"
                  cover={<img alt={product.Name} src={product.Image} style={{ height: 200, objectFit: "cover" }} />}
                >
                  <Card.Meta
                    title={product.Name}
                    description={
                      <>
                        <div>Fiyat: {product.Price} ₺</div>
                        <div>Stok: {product.InStock ? "Var" : "Yok"}</div>
                        <div>Puan: <Rate allowHalf disabled value={product.Rating} /> ({product.Rating})</div>
                        {/* Sepete Ekle butonu */}
                        <Button
                          type="primary"
                          block
                          style={{ marginTop: 8 }}
                          onClick={e => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          disabled={!product.InStock}
                        >
                          Sepete Ekle
                        </Button>
                      </>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filteredProducts.length}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
} 