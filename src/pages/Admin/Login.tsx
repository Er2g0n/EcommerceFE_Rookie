import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { API_AUTH_BASE_URL } from '../../services/apiConfig'; // Adjust path as necessary

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_AUTH_BASE_URL}auth/loginAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: values.username,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (result.isSuccess && result.result?.token) {
        localStorage.setItem("token", result.result.token);
        messageApi.open({
          type: 'success',
          content: 'Success Login',
        });
        navigate("/home"); // Navigate to /home, which is defined in routes.tsx
      } else {
        if (result.message?.includes("not an admin")) {
          messageApi.open({
            type: 'warning',
            content: 'UnAuthorized',
          });
        } else {
          messageApi.open({
            type: 'error',
            content: 'Fail',
          });
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Fail',
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f2f5',
        }}
      >
        <Card title="Admin Login" style={{ width: 400 }}>
          <Form
            name="admin_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Log In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Login;