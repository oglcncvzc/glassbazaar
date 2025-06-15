"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Alert } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from '../layout';

const { Title } = Typography;

const MOCK_USER = {
  email: "test@gurok.com",
  password: "123456",
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        router.replace('/');
      }
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDark(document.body.classList.contains('theme-dark'));
      const handleThemeChange = () => setIsDark(document.body.classList.contains('theme-dark'));
      window.addEventListener('storage', handleThemeChange);
      const observer = new MutationObserver(handleThemeChange);
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      return () => {
        window.removeEventListener('storage', handleThemeChange);
        observer.disconnect();
      };
    }
  }, []);

  const onFinish = (values: any) => {
    setLoading(true);
    setError("");
    const { email, password } = values;
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      if (typeof window !== "undefined") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
      }
      router.push("/");
    } else {
      setError(t('invalid_email_or_password'));
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: isDark ? '#18191a' : "#f0f2f5" }}>
      <div style={{ width: 350, padding: 32, background: isDark ? '#23272f' : "#fff", borderRadius: 8, boxShadow: isDark ? '0 2px 16px #0008' : "0 2px 8px #f0f1f2" }}>
        <Title level={3} style={{ textAlign: "center", color: isDark ? '#ededed' : undefined }}>GlassBazaar {t('login')}</Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label={<span style={{ color: isDark ? '#ededed' : undefined }}>{t('email')}</span>}
            rules={[
              { required: true, message: t('please_enter_email') },
              { type: "email", message: t('please_enter_valid_email') },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder={t('email')} 
              size="large" 
              style={{ background: isDark ? '#18191a' : undefined, color: isDark ? '#ededed' : undefined, borderColor: isDark ? '#333' : undefined, caretColor: '#a259ff' }}
              className="login-input"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span style={{ color: isDark ? '#ededed' : undefined }}>{t('password')}</span>}
            rules={[{ required: true, message: t('please_enter_password') }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder={t('password')} 
              size="large" 
              style={{ background: isDark ? '#18191a' : undefined, color: isDark ? '#ededed' : undefined, borderColor: isDark ? '#333' : undefined, caretColor: '#a259ff' }}
              className="login-input"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              {t('login')}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <style>{`
        .login-input input, .login-input input[type="password"] {
          caret-color: #a259ff !important;
        }
      `}</style>
    </div>
  );
} 