// src/components/TodosPage.js
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  Card,
  Tag,
  Typography,
  Row,
  Col,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { todoAPI } from '../api/axios';

const { Title } = Typography;

const TodosPage = () => {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoAPI.getAllTodos();
      setTodos(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch todos');
      setLoading(false);
    }
  };

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTodo) {
        await todoAPI.updateTodo(editingTodo._id, values);
        message.success("Todo updated successfully!");
      } else {
        await todoAPI.createTodo(values);
        message.success("Todo created successfully!");
      }
      fetchTodos();
      handleCancel();
    } catch (error) {
      message.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (record) => {
    setEditingTodo(record);
    form.setFieldsValue(record);
    showModal();
  };

  const handleDelete = async (id) => {
    try {
      await todoAPI.deleteTodo(id);
      message.success("Todo deleted successfully!");
      fetchTodos();
    } catch (error) {
      message.error('Failed to delete todo');
    }
  };

  const toggleComplete = async (record) => {
    try {
      await todoAPI.updateTodo(record._id, {
        ...record,
        completed: !record.completed
      });
      fetchTodos();
      message.success(`Todo marked as ${record.completed ? "incomplete" : "completed"}!`);
    } catch (error) {
      message.error('Failed to update todo status');
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      key: "completed",
      render: (_, record) => (
        <Tag
          color={record.completed ? "success" : "warning"}
          onClick={() => toggleComplete(record)}
          style={{ cursor: 'pointer' }}
        >
          {record.completed ? "Completed" : "Pending"}
        </Tag>
      ),
      filters: [
        { text: "Completed", value: true },
        { text: "Pending", value: false },
      ],
      onFilter: (value, record) => record.completed === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Delete Todo"
            description="Are you sure you want to delete this todo?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Row justify="center" align="middle" style={{ minHeight: "calc(100vh - 64px)" }}>
      <Col xs={22} sm={22} md={22} lg={22}>
        <Card className="card">
          <Space
            style={{
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Title level={3}>Todo List</Title>
            <Button type="primary" icon={<PlusOutlined />} size="large" onClick={showModal}>
              Add Todo
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={todos}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            loading={loading}
          />

          <Modal
            title={editingTodo ? "Edit Todo" : "Add New Todo"}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
            >
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  { required: true, message: "Please input the title!" },
                  { min: 3, message: "Title must be at least 3 characters!" },
                ]}
              >
                <Input placeholder="Todo title ..." />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please input the description!" },
                  {
                    min: 5,
                    message: "Description must be at least 5 characters!",
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Todo description ..." />
              </Form.Item>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  {editingTodo ? "Update" : "Create"}
                </Button>
              </Space>
            </Form>
          </Modal>
        </Card>
      </Col>
    </Row>
  );
};

export default TodosPage;