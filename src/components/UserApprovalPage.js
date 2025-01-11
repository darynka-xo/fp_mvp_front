import React, { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUnapprovedUsers, approveOrDenyUser } from '../services/api';

const UserApprovalPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Проверка, авторизован ли пользователь
        if (!isAuthenticated || !localStorage.getItem('username')) {
            navigate('/');
            return;
        }

        loadUsers();
    }, [navigate, isAuthenticated]);

    const loadUsers = async () => {
        try {
            const response = await fetchUnapprovedUsers();
            const users = response.data.users || [];
            initializeDataTable(users);
        } catch (err) {
            console.error('Ошибка загрузки пользователей для утверждения:', err);
            if (err.response?.status === 403) {
                alert('У вас нет прав доступа к этой странице.');
                navigate('/dashboard'); // Перенаправление на панель управления
            } else {
                alert(err.response?.data?.message || 'Не удалось загрузить пользователей для утверждения');
            }
        }
    };

    const initializeDataTable = (data) => {
        $('#userApprovalTable').DataTable({
            data,
            columns: [
                { data: 'username', title: 'Имя пользователя' },
                { data: 'email', title: 'Электронная почта' },
                { data: 'role', title: 'Роль' },
                {
                    data: null,
                    title: 'Действия',
                    orderable: false,
                    className: 'text-center',
                    render: (data, type, row) => `
                        <button class="btn btn-success btn-sm approve-btn" data-id="${row.id}">Одобрить</button>
                        <button class="btn btn-danger btn-sm deny-btn" data-id="${row.id}">Отклонить</button>
                    `,
                },
            ],
            destroy: true, // Разрешить повторную инициализацию
        });
    };

    useEffect(() => {
        $(document).on('click', '.approve-btn', async function () {
            const userId = $(this).data('id');
            try {
                await approveOrDenyUser(userId, 'approve');
                alert('Пользователь успешно одобрен.');
                loadUsers();
            } catch (err) {
                console.error('Ошибка при одобрении пользователя:', err);
                alert(err.response?.data?.message || 'Не удалось одобрить пользователя');
            }
        });

        $(document).on('click', '.deny-btn', async function () {
            const userId = $(this).data('id');
            try {
                await approveOrDenyUser(userId, 'deny');
                alert('Пользователь успешно отклонён.');
                loadUsers();
            } catch (err) {
                console.error('Ошибка при отклонении пользователя:', err);
                alert(err.response?.data?.message || 'Не удалось отклонить пользователя');
            }
        });
    }, []);

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-6">Управление утверждением пользователей</h1>
            <table
                id="userApprovalTable"
                className="table table-striped table-bordered"
                width="100%"
            ></table>
        </div>
    );
};

export default UserApprovalPage;