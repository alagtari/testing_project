import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Card,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      const success = await login(values);
      if (success) {
        navigate("/home");
      }
    } catch (error) {
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col xs={22} sm={16} md={12} lg={8}>
        <Card bordered={false} className="card">
          <Title level={2} style={{ textAlign: "center" }}>
            Welcome Back
          </Title>
          <Text
            type="secondary"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Log in to your account
          </Text>
          <Form onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
              style={{ marginBottom: "12px" }}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
              style={{ marginBottom: "24px" }}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "150px" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Space
            direction="vertical"
            style={{ width: "100%", textAlign: "center" }}
          >
            <Text type="secondary">Don't have an account?</Text>
            <Button type="link" onClick={() => navigate("/register")}>
              Register Now
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;