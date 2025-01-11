// TechCardPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

import 'datatables.net-bs4';
import 'datatables.net-fixedcolumns-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-fixedcolumns-bs4/css/fixedColumns.bootstrap4.min.css';

import { api } from '../services/api';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import './TechCardPage.css';


const TechCardPage = () => {
    const [techCards, setTechCards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [editingOrder, setEditingOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await api.get('/tech-cards/combined');
            setTechCards(response.data);
            initializeDataTable(response.data);
        } catch (error) {
            console.error('Ошибка загрузки техкарточек:', error);
        }
    };

    const initializeDataTable = (data) => {
        $('#techCardsTable').DataTable({
            data,
            columns: [
                {
                    data: 'order_number',
                    title: 'Название техкарты',
                    render: (data, type, row) => {
                        return `
              <a href="#" class="techcard-link" data-id="${row.order_number}">
                Tech_Card_${row.order_number}
              </a>
            `;
                    },
                },
                { data: 'production_start_date', title: 'Дата начала производства' },
                { data: 'customer', title: 'Клиент' },
                { data: 'circulation', title: 'Тираж' },
                { data: 'cup_article', title: 'Артикул стакана' },
                { data: 'design', title: 'Дизайн' },
                { data: 'product_type', title: 'Тип продукта' },
                { data: 'throat_diameter', title: 'Диаметр горла' },
                { data: 'bottom_diameter', title: 'Диаметр дна' },
                { data: 'height', title: 'Высота' },
                { data: 'capacity', title: 'Вместимость' },
                { data: 'manufacturer', title: 'Производитель' },
                { data: 'density', title: 'Плотность' },
                { data: 'width', title: 'Ширина' },
                { data: 'pe_layer', title: 'ПЭ слой' },
                { data: 'meters_per_circulation', title: 'Метры на тираж' },
                { data: 'kg_per_circulation', title: 'Кг на тираж' },
                { data: 'rapport_impressions', title: 'Раппорт отпечатков' },
                { data: 'bottom_material_meters', title: 'Материал дна (м)' },
                { data: 'bottom_material_kg', title: 'Материал дна (кг)' },
                { data: 'sleeve', title: 'Рукав' },
                { data: 'tooling_number', title: 'Номер инструмента' },
                { data: 'quantity_per_rapport', title: 'Количество на раппорт' },
                { data: 'bottom_width', title: 'Ширина дна' },
                { data: 'glasses_per_sleeve', title: 'Стаканов в рукаве' },
                { data: 'sleeves_per_box', title: 'Рукавов в коробке' },
                { data: 'corrugated_box_size', title: 'Размер коробки' },
                { data: 'printing_unit_number', title: 'Номер печатного узла' },
                { data: 'lineature_anilox', title: 'Линейность анилокса' },
                { data: 'shaft_number', title: 'Номер вала' },
                { data: 'part2_name', title: 'Имя части 2' },
                { data: 'color', title: 'Цвет' },
                { data: 'viscosity', title: 'Вязкость' },
                { data: 'consumption', title: 'Потребление' },
                { data: 'comments', title: 'Комментарии' },
                {
                    data: null,
                    title: 'Состояние',
                    className: 'text-center',
                    orderable: true,
                    render: (rowData) => {
                        const fieldsToCheck = [
                            'manufacturer', 'name', 'pe_layer',
                            'printing_unit_number', 'lineature_anilox', 'shaft_number',
                            'part2_name', 'color', 'viscosity', 'consumption', 'comments'
                        ];
                        const isReady = fieldsToCheck.every((field) => {
                            const value = rowData[field];
                            return value !== null && value !== undefined && value !== '';
                        });
                        const downloadButton = isReady
                            ? `<button class="download-btn ml-2" data-id="${rowData.order_number}">
                  <svg class="w-5 h-5 text-gray-600 hover:text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>`
                            : '';
                        const badgeClass = isReady
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800';
                        const statusText = isReady ? 'Готово' : 'Новое';

                        return `
              <div class="flex items-center justify-center">
                <span class="px-2 py-1 rounded-full text-xs ${badgeClass} font-medium">
                  ${statusText}
                </span>
                ${downloadButton}
              </div>
            `;
                    },
                },
                {
                    data: null,
                    title: 'Действия',
                    orderable: false,
                    className: 'text-center',
                    render: (rowData) => `
            <button class="btn btn-primary btn-sm edit-btn" data-id="${rowData.order_number}">Редактировать</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${rowData.order_number}">Удалить</button>
          `,
                },
            ],
            scrollX: true,
            fixedColumns: {
                rightColumns: 2,
            },
            destroy: true,
        });

        // Кнопка загрузки
        $(document).off('click', '.download-btn').on('click', '.download-btn', function () {
            const orderId = $(this).data('id');
            handleDownload(orderId);
        });

        // Ссылка Tech_Card_{orderNumber}
        $(document).off('click', '.techcard-link').on('click', '.techcard-link', function (e) {
            e.preventDefault();
            const orderNumber = $(this).data('id');
            navigate(`/techcards/view/${orderNumber}`);
        });
    };

    useEffect(() => {
        $(document).off('click', '.edit-btn').on('click', '.edit-btn', function () {
            const orderNumber = $(this).data('id');
            handleEdit(orderNumber);
        });

        $(document).off('click', '.delete-btn').on('click', '.delete-btn', function () {
            const orderNumber = $(this).data('id');
            handleDelete(orderNumber);
        });
    }, [techCards]);

    const handleDownload = async (orderNumber) => {
        try {
            const response = await api.get(`/tech-cards/download/${orderNumber}`, {
                responseType: 'blob',
                headers: {
                    Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
            });
            const url = window.URL.createObjectURL(
                new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                })
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `tech_card_${orderNumber}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Ошибка загрузки техкарты:', error);
            alert('Не удалось загрузить техкарту.');
        }
    };

    const handleEdit = (orderNumber) => {
        const techCard = techCards.find((card) => card.order_number === orderNumber);
        setEditingOrder(orderNumber);
        if (techCard) {
            setFormData({
                manufacturer: techCard.manufacturer || '',
                name: techCard.name || '',
                pe_layer: techCard.pe_layer || '',
                printing_unit_number: techCard.printing_unit_number || '',
                lineature_anilox: techCard.lineature_anilox || '',
                shaft_number: techCard.shaft_number || '',
                part2_name: techCard.part2_name || '',
                color: techCard.color || '',
                viscosity: techCard.viscosity || '',
                consumption: techCard.consumption || '',
                comments: techCard.comments || '',
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (orderNumber) => {
        if (window.confirm(`Вы уверены, что хотите удалить техкарту: ${orderNumber}?`)) {
            try {
                await api.delete(`/tech-cards/combined/${orderNumber}`);
                alert(`Техкарта ${orderNumber} успешно удалена.`);
                loadData();
            } catch (error) {
                console.error('Ошибка удаления техкарты:', error);
                alert('Не удалось удалить техкарту.');
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
            const updates = {};
            for (const [key, value] of Object.entries(formData)) {
                const techCard = techCards.find((card) => card.order_number === editingOrder);
                if (value !== '' && value !== techCard[key]) {
                    updates[key] = value;
                }
            }
            await api.put(`/tech-cards/combined/${editingOrder}`, updates);
            setIsModalOpen(false);
            loadData();
            alert('Техкарта успешно обновлена.');
        } catch (error) {
            console.error('Ошибка обновления техкарты:', error);
            const errorMessage = error.response?.data?.message || 'Не удалось обновить техкарту.';
            alert(`Ошибка: ${errorMessage}`);
        }
    };

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-6">Техкарты</h1>
            <table id="techCardsTable" className="table table-striped table-bordered" width="100%"></table>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Редактировать техкарту</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { name: 'manufacturer', label: 'Производитель' },
                            { name: 'name', label: 'Название' },
                            { name: 'pe_layer', label: 'ПЭ слой' },
                            { name: 'printing_unit_number', label: 'Номер печатного узла' },
                            { name: 'lineature_anilox', label: 'Линейность анилокса' },
                            { name: 'shaft_number', label: 'Номер вала' },
                            { name: 'part2_name', label: 'Имя части 2' },
                            { name: 'color', label: 'Цвет' },
                            { name: 'viscosity', label: 'Вязкость (с)' },
                            { name: 'consumption', label: 'Потребление (г)' },
                            { name: 'comments', label: 'Комментарии' },
                        ].map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <label htmlFor={field.name} className="text-sm font-medium">
                                    {field.label}
                                </label>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleInputChange}
                                    className="mt-1"
                                />
                            </div>
                        ))}
                        <DialogFooter>
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

export default TechCardPage;