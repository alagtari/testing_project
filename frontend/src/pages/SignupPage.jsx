import React from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Divider,
} from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import our auth hook

const { Title, Text } = Typography;

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth(); // Use our auth context

  const onFinish = async (values) => {
    try {
      // Remove confirmPassword as it's not needed in the API
      const { confirmPassword, ...signupData } = values;

      // Use the signup function from our auth context
      const success = await signup(signupData);

      if (success) {
        navigate("/");
      }
    } catch (error) {}
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card bordered={false} className="card">
          <Title level={2} style={{ textAlign: "center" }}>
            Create an Account
          </Title>
          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            Join us and start your journey
          </Text>
          <Form
            onFinish={onFinish}
            layout="vertical"
            size="large"
            validateTrigger="onBlur"
          >
            <Form.Item
              name="username" // Changed from name to username to match our backend
              label="Username"
              rules={[
                { required: true, message: "Please enter your username!" },
                { min: 3, message: "Username must be at least 3 characters!" },
              ]}
              style={{ marginBottom: "12px" }}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email!",
                },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email format!",
                },
              ]}
              style={{ marginBottom: "12px" }}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter a password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
              style={{ marginBottom: "12px" }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
              style={{ marginBottom: "24px" }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "150px" }}
              >
                Register
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Space
            direction="vertical"
            style={{ width: "100%", textAlign: "center" }}
          >
            <Text type="secondary">Already have an account?</Text>
            <Button type="link" onClick={() => navigate("/login")}>
              Login
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default SignupPage;
