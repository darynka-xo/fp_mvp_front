import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import { api } from '../services/api';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import './TechCardPage.css';

const CatalogPage = () => {
    const [formData, setFormData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingId, setEditingId] = useState(null);
    const [modalType, setModalType] = useState('cup'); // 'cup' или 'company'

    useEffect(() => {
        loadData();

        // Обработчик нажатия кнопки "Редактировать"
        $(document).on('click', '.edit-btn', function() {
            const id = $(this).data('id');
            const type = $(this).data('type');
            handleEdit(id, type);
        });

        // Обработчик нажатия кнопки "Удалить"
        $(document).on('click', '.delete-btn', function() {
            const id = $(this).data('id');
            const type = $(this).data('type');
            handleDelete(id, type);
        });
    }, []);

    const loadData = async () => {
        try {
            const [cupsResponse, companiesResponse] = await Promise.all([
                api.get('/catalog/cups'),
                api.get('/catalog/companies')
            ]);

            initializeDataTable('#cupsTable', cupsResponse.data, getCupsColumns());
            initializeDataTable('#companiesTable', companiesResponse.data, getCompanyColumns());
        } catch (error) {
            console.error('Не удалось загрузить данные:', error);
            alert('Не удалось загрузить данные каталога.');
        }
    };

    const initializeDataTable = (tableId, data, columns) => {
        $(tableId).DataTable({
            data,
            columns,
            destroy: true,
            responsive: true,
            autoWidth: false,
            scrollX: true,
            fixedColumns: {
                rightColumns: 1,
            },
        });
    };

    const getCupsColumns = () => [
        { data: 'cup_type', title: 'Тип стакана' },
        { data: 'throat_diameter', title: 'Диаметр горла' },
        { data: 'bottom_diameter', title: 'Диаметр дна' },
        { data: 'height', title: 'Высота' },
        { data: 'capacity', title: 'Объем' },
        { data: 'density', title: 'Плотность' },
        { data: 'width', title: 'Ширина' },
        { data: 'quantity_in_report', title: 'Количество в отчете' },
        { data: 'sleeve', title: 'Рукав' },
        { data: 'tooling_number', title: 'Номер инструмента' },
        { data: 'bottom_width', title: 'Ширина дна' },
        { data: 'glasses_per_sleeve', title: 'Стаканов на рукав' },
        { data: 'sleeves_per_box', title: 'Рукавов в коробке' },
        { data: 'corrugated_box_size', title: 'Размер гофрокоробки' },
        { data: 'stacks_per_product', title: 'Стопок на изделие' },
        { data: 'tape_per_box_m', title: 'Скотч на коробку (м)' },
        { data: 'boxes_per_pallet', title: 'Коробок на поддоне' },
        { data: 'packaging_pe', title: 'Упаковка ПЭ' },
        { data: 'pe_sleeve_per_item', title: 'ПЭ на рукав' },
        { data: 'bottom_size', title: 'Размер дна' },
        { data: 'stretch_per_pallet_m', title: 'Стретч на поддон (м)' },
        { data: 'pe_weight', title: 'Вес ПЭ' },
        { data: 'number_of_streams', title: 'Количество потоков' },
        {
            data: null,
            title: 'Действия',
            orderable: false,
            className: 'text-center',
            render: (data, type, row) => `
                <button class="btn btn-success btn-sm edit-btn" data-id="${row.cup_type}" data-type="cup">Редактировать</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${row.cup_type}" data-type="cup">Удалить</button>
            `,
        },
    ];

    const getCompanyColumns = () => [
        { data: 'company_name', title: 'Название компании' },
        {
            data: null,
            title: 'Действия',
            orderable: false,
            className: 'text-center',
            render: (data, type, row) => `
                <button class="btn btn-success btn-sm edit-btn" data-id="${row.company_name}" data-type="company">Редактировать</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${row.company_name}" data-type="company">Удалить</button>
            `,
        },
    ];

    const handleAdd = (type) => {
        setFormData({});
        setModalMode('add');
        setModalType(type);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleEdit = async (id, type) => {
        setModalMode('edit');
        setModalType(type);
        setEditingId(id);

        try {
            let response;
            if (type === 'cup') {
                response = await api.get(`/catalog/cups/${id}`);
            } else {
                response = await api.get(`/catalog/companies/${id}`);
            }
            setFormData(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            alert('Не удалось получить данные.');
        }
    };

    const handleDelete = async (id, type) => {
        const itemType = type === 'cup' ? 'Тип стакана' : 'Компания';
        if (window.confirm(`Вы уверены, что хотите удалить ${itemType}: ${id}?`)) {
            try {
                if (type === 'cup') {
                    await api.delete(`/catalog/cups/${id}`);
                } else {
                    await api.delete(`/catalog/companies/${id}`);
                }
                loadData();
            } catch (error) {
                console.error('Ошибка при удалении:', error);
                alert('Не удалось удалить элемент. Попробуйте снова.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                if (modalType === 'cup') {
                    await api.post('/catalog/cups', formData);
                } else {
                    await api.post('/catalog/companies', formData);
                }
            } else {
                if (modalType === 'cup') {
                    await api.put(`/catalog/cups/${editingId}`, formData);
                } else {
                    await api.put(`/catalog/companies/${editingId}`, formData);
                }
            }
            setIsModalOpen(false);
            loadData();
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
            alert('Не удалось сохранить изменения.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const getFormFields = () => {
        if (modalType === 'cup') {
            return [
                'cup_type',
                'throat_diameter',
                'bottom_diameter',
                'height',
                'capacity',
                'density',
                'width',
                'quantity_in_report',
                'sleeve',
                'tooling_number',
                'bottom_width',
                'glasses_per_sleeve',
                'sleeves_per_box',
                'corrugated_box_size',
                'stacks_per_product',
                'tape_per_box_m',
                'boxes_per_pallet',
                'packaging_pe',
                'pe_sleeve_per_item',
                'bottom_size',
                'stretch_per_pallet_m',
                'pe_weight',
                'number_of_streams',
            ];
        } else {
            return ['company_name'];
        }
    };

    return (
        <div className="dataTableContainer container mx-auto p-4">
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-6">Каталог стаканов</h2>
                <div className="mb-4">
                    <Button onClick={() => handleAdd('cup')}>Добавить новый стакан</Button>
                </div>
                <table id="cupsTable" className="table table-striped table-bordered"></table>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-6">Каталог компаний</h2>
                <div className="mb-4">
                    <Button onClick={() => handleAdd('company')}>Добавить новую компанию</Button>
                </div>
                <table id="companiesTable" className="table table-striped table-bordered"></table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="dialog-content sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {modalMode === 'add' ? `Добавить ${modalType === 'cup' ? 'стакан' : 'компанию'}` :
                                `Редактировать ${modalType === 'cup' ? 'стакан' : 'компанию'}`}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {getFormFields().map((field) => (
                            <div key={field} className="flex flex-col">
                                <label htmlFor={field} className="text-sm font-medium mb-1">
                                    {field.replace(/_/g, ' ')}
                                </label>
                                <Input
                                    id={field}
                                    name={field}
                                    value={formData[field] || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ))}
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

export default CatalogPage;