import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import { api } from '../services/api';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import './TechCardPage.css';
import { useAuth } from "../context/AuthContext";

const OrderRegistryPage = () => {
    const { role } = useAuth();

    const [orders, setOrders] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [cupTypes, setCupTypes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [modalMode, setModalMode] = useState('edit');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadData();

        // Подключить функциональность редактирования и удаления к кнопкам DataTables
        $(document).on('click', '.edit-btn', function () {
            const id = $(this).data('id');
            handleEdit(id);
        });

        $(document).on('click', '.delete-btn', function () {
            const id = $(this).data('id');
            handleDelete(id);
        });
    }, []);

    const loadData = async () => {
        try {
            const [ordersResponse, companiesResponse, cupTypesResponse] = await Promise.all([
                api.get('/orders-registry'),
                api.get('/catalog/companies'),
                api.get('/catalog/cups'),
            ]);
            setOrders(ordersResponse.data);
            setCompanies(companiesResponse.data);
            setCupTypes(cupTypesResponse.data);
            initializeDataTable('#ordersTable', ordersResponse.data);
        } catch (error) {
            console.error('Не удалось загрузить данные:', error);
            alert('Не удалось загрузить данные. Пожалуйста, попробуйте снова.');
        }
    };

    const initializeDataTable = (tableId, data) => {
        $(tableId).DataTable({
            data,
            columns: getColumns(),
            destroy: true, // Переинициализировать таблицу
            responsive: true,
            autoWidth: false,
            scrollX: true, // Включить горизонтальную прокрутку для больших таблиц
            fixedColumns: {
                rightColumns: 1, // Закрепить колонку "Действия"
            },
        });
    };

    const getColumns = () => [
        { data: 'order_number', title: 'Номер заказа' },
        { data: 'registration_date', title: 'Дата регистрации' },
        { data: 'month', title: 'Месяц' },
        { data: 'company_name', title: 'Название компании' },
        { data: 'production_start_date', title: 'Дата начала производства' },
        { data: 'article', title: 'Артикул' },
        { data: 'planned_completion_date', title: 'Планируемая дата завершения' },
        { data: 'design', title: 'Дизайн' },
        { data: 'status', title: 'Статус' },
        { data: 'cup_type', title: 'Тип стакана' },
        { data: 'order_quantity', title: 'Количество заказа' },
        {
            data: null,
            title: 'Действия',
            orderable: false,
            className: 'text-center sticky-action-column', // Стиль для закрепленной колонки
            render: (data, type, row) => `
                <button class="btn btn-success btn-sm edit-btn" data-id="${row.order_number}">Редактировать</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${row.order_number}">Удалить</button>
            `,
        },
    ];

    const handleAdd = () => {
        setFormData({});
        setModalMode('add');
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleEdit = (id) => {
        setModalMode('edit');
        setEditingId(id);
        api.get(`/orders-registry/${id}`)
            .then((response) => {
                setFormData(response.data);
                setIsModalOpen(true);
            })
            .catch((error) => {
                console.error('Ошибка при получении данных заказа:', error);
                alert('Не удалось получить данные заказа.');
            });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
            try {
                await api.delete(`/orders-registry/${id}`);
                loadData();
            } catch (error) {
                console.error('Ошибка при удалении:', error);
                alert('Не удалось удалить заказ. Пожалуйста, попробуйте снова.');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let submitData = { ...formData };

            if (role === 'Sales Manager') {
                // Добавить автоматические поля
                if (modalMode === 'add') {
                    submitData.registration_date = new Date().toISOString().split('T')[0];
                    submitData.month = new Date().toLocaleString('default', { month: 'long' });
                }
            }

            if (modalMode === 'add') {
                await api.post('/orders-registry', submitData);
            } else if (modalMode === 'edit') {
                await api.put(`/orders-registry/${editingId}`, submitData);
            }
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            console.error('Ошибка при сохранении данных заказа:', error);
            alert('Не удалось сохранить изменения.');
        }
    };

    const getFields = () => {
        if (role === 'Sales Manager') {
            return [
                { name: 'company_name', label: 'Клиент', type: 'select', options: companies.map((c) => c.company_name) },
                { name: 'production_start_date', label: 'Дата начала производства', type: 'date' },
                { name: 'order_number', label: 'Номер заказа', type: 'text', required: true },
                { name: 'article', label: 'Артикул', type: 'text' },
                { name: 'planned_completion_date', label: 'Планируемая дата завершения', type: 'date' },
                { name: 'design', label: 'Дизайн', type: 'text' },
                { name: 'status', label: 'Статус', type: 'select', options: ['В работе', 'Проект', 'Выполнен'] },
                { name: 'cup_type', label: 'Тип стакана', type: 'select', options: cupTypes.map((c) => c.cup_type) },
                { name: 'order_quantity', label: 'Количество заказа (1000)', type: 'number' }
            ];
        }
        // Технический директор может видеть все поля
        return [
            { name: 'order_number', label: 'Номер заказа', type: 'text', required: true, readOnly: modalMode === 'edit' },
            { name: 'registration_date', label: 'Дата регистрации', type: 'date' },
            { name: 'month', label: 'Месяц', type: 'text' },
            { name: 'production_start_date', label: 'Дата начала производства', type: 'date' },
            { name: 'company_name', label: 'Название компании', type: 'select', options: companies.map((c) => c.company_name) },
            { name: 'cup_type', label: 'Тип стакана', type: 'select', options: cupTypes.map((c) => c.cup_type) },
            { name: 'article', label: 'Артикул', type: 'text' },
            { name: 'design', label: 'Дизайн', type: 'text' },
            { name: 'status', label: 'Статус', type: 'select', options: ['В работе', 'Проект', 'Выполнен'] },
            { name: 'order_quantity', label: 'Количество заказа', type: 'number' }
        ];
    };

    return (
        <div className="dataTableContainer container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Реестр заказов</h1>
            <div className="mb-4">
                <Button onClick={handleAdd}>Добавить новый заказ</Button>
            </div>
            <table id="ordersTable" className="table table-striped table-bordered"></table>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"> {/* Прокручиваемое модальное окно */}
                    <DialogHeader>
                        <DialogTitle>{modalMode === 'add' ? 'Добавить новый заказ' : 'Редактировать заказ'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getFields().map((field) => (
                                <div key={field.name} className="flex flex-col">
                                    <label htmlFor={field.name} className="text-sm font-medium mb-1">
                                        {field.label}
                                    </label>
                                    {field.type === 'select' ? (
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleInputChange}
                                            required={field.required}
                                            className="w-full border border-gray-300 p-2 rounded"
                                        >
                                            <option value="">Выбрать</option>
                                            {field.options.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type={field.type}
                                            value={formData[field.name] || ''}
                                            onChange={handleInputChange}
                                            required={field.required}
                                            readOnly={field.readOnly}
                                            className="w-full"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Отмена
                            </Button>
                            <Button type="submit">Сохранить изменения</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrderRegistryPage;