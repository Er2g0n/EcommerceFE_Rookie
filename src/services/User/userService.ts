import { API_AUTH_BASE_URL } from '../apiConfig';
import { User } from '../../types/User/User'; 

export async function fetchUsers(): Promise<User[]> {
    try {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        const response = await fetch(`${API_AUTH_BASE_URL}auth/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        if (!data.isSuccess) {
            throw new Error(data.message || 'Error fetching users');
        }

        return data.result as User[];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}