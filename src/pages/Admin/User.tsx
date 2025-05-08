import React, { useState, useEffect } from 'react';
import { Card, Table, message } from 'antd';
import { fetchUsers } from '../../services/User/userService';
import { User } from '../../types/User/User'; 

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {
                const userData = await fetchUsers();
                setUsers(userData);
            } catch (error) {
                messageApi.open({
                    type: 'error',
                    content: error instanceof Error ? error.message : 'Failed to load users',
                });
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [messageApi]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
    ];

    return (
        <>
            {contextHolder}
            <Card title="Customers Management" variant="borderless">
                <Table
                    dataSource={users}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </>
    );
};

export default Users;