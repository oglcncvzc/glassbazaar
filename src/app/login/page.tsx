"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Alert } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const MOCK_USER = {
  email: "test@gurok.com",
  password: "123456",
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("E-posta veya şifre hatalı!");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5" }}>
      <div style={{ width: 350, padding: 32, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #f0f1f2" }}>
        <Title level={3} style={{ textAlign: "center" }}>GlassBazaar Giriş</Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="E-posta"
            rules={[
              { required: true, message: "Lütfen e-posta adresinizi girin!" },
              { type: "email", message: "Geçerli bir e-posta adresi girin!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="E-posta" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Şifre"
            rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Şifre" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
} 