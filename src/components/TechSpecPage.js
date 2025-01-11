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

const TechSpecPage = () => {
    const [techSpecs, setTechSpecs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [editingOrder, setEditingOrder] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        loadData();
    }, []);
    useEffect(() => {
        $(document).off('click', '.download-btn').on('click', '.download-btn', function() {
            const orderId = $(this).data('id');
            handleDownload(orderId);
        });
    }, [techSpecs]);

    const loadData = async () => {
        try {
            const response = await api.get('/tech-specifications');
            setTechSpecs(response.data);
            initializeDataTable(response.data);
        } catch (error) {
            console.error('Ошибка загрузки технических спецификаций:', error);
        }
    };

    const initializeDataTable = (data) => {
        $('#techSpecsTable').DataTable({
            data,
            columns: [
                {
                    data: 'order_number',
                    title: 'Название спецификации',
                    render: (data) => `Tech_Spec_${data}`,
                },
                { data: 'article', title: 'Артикул' },
                { data: 'design', title: 'Дизайн' },
                { data: 'production_start_date', title: 'Дата начала производства' },
                { data: 'cup_type', title: 'Тип стакана' },
                { data: 'order_quantity', title: 'Количество заказа' },
                { data: 'color', title: 'Цвет' },
                { data: 'total_cup_weight', title: 'Общий вес стакана' },
                { data: 'machine', title: 'Машина' },
                { data: 'material', title: 'Материал' },
                { data: 'paper_density', title: 'Плотность бумаги' },
                { data: 'side_wall', title: 'Боковая стенка' },
                { data: 'size_mm', title: 'Размер (мм)' },
                { data: 'total_density', title: 'Общая плотность' },
                { data: 'bottom', title: 'Дно' },
                { data: 'size_mm_82_72', title: 'Размер (мм) 82/72' },
                { data: 'total_density_82_72', title: 'Общая плотность 82/72' },
                { data: 'strokes_per_min', title: 'Удары в минуту' },
                { data: 'roll_width_after_print', title: 'Ширина рулона после печати' },
                { data: 'side_wall_weight_per_cup', title: 'Вес боковой стенки на стакан' },
                { data: 'side_wall_cutting_weight', title: 'Вес обрезки боковой стенки' },
                { data: 'total_side_wall_weight', title: 'Общий вес боковой стенки' },
                { data: 'blanker_waste_norm', title: 'Норма отходов бланкера' },
                { data: 'number_of_streams', title: 'Количество потоков' },
                { data: 'utilization_ratio', title: 'Коэффициент использования' },
                { data: 'productivity_per_hour', title: 'Производительность в час' },
                { data: 'blank_consumption_per_1000', title: 'Расход заготовок на 1000' },
                { data: 'side_wall_blanks', title: 'Заготовки боковой стенки' },
                { data: 'bottom_weight', title: 'Вес дна' },
                { data: 'bottom_cutting_weight', title: 'Вес обрезки дна' },
                { data: 'pe_packaging', title: 'ПЭ упаковка' },
                { data: 'pe_weight', title: 'Вес ПЭ' },
                { data: 'pe_packaging_consumption', title: 'Расход ПЭ упаковки' },
                { data: 'stacks_per_box', title: 'Стопок в коробке' },
                { data: 'items_per_stack', title: 'Изделий в стопке' },
                { data: 'items_per_box', title: 'Изделий в коробке' },
                { data: 'box_dimensions', title: 'Размеры коробки' },
                { data: 'box_label_qty', title: 'Количество этикеток на коробке' },
                { data: 'tape_consumption', title: 'Расход скотча' },
                { data: 'tape_per_box', title: 'Скотч на коробку' },
                { data: 'boxes_per_pallet', title: 'Коробок на поддоне' },
                { data: 'items_per_pallet', title: 'Изделий на поддоне' },
                { data: 'stretch_film_consumption', title: 'Расход стрейч-пленки' },
                { data: 'pallet_label_qty', title: 'Количество этикеток на поддоне' },
                {
                    data: null,
                    title: 'Состояние',
                    render: (rowData) => {
                        const requiredFields = [
                            'machine', 'material', 'paper_density',
                            'side_wall', 'size_mm', 'total_density',
                            'bottom', 'strokes_per_min'
                        ];

                        const isReady = requiredFields.every(field =>
                            rowData[field] !== null && rowData[field] !== '');

                        const downloadButton = isReady
                            ? `<button class="download-btn ml-2" data-id="${rowData.order_number}">
                                <svg class="w-5 h-5 text-gray-600 hover:text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                               </button>`
                            : '';

                        return `
                            <div class="flex items-center justify-center">
                                <span class="px-2 py-1 rounded-full text-xs ${
                            isReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        } font-medium">
                                    ${isReady ? 'Готово' : 'Новое'}
                                </span>
                                ${downloadButton}
                            </div>
                        `;
                    }
                },
                {
                    data: null,
                    title: 'Действия',
                    orderable: false,
                    className: 'text-center',
                    render: (data) => `
                        <button class="btn btn-primary btn-sm edit-btn" data-id="${data.order_number}">Редактировать</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${data.order_number}">Удалить</button>
                    `
                }
            ],
            scrollX: true,
            fixedColumns: {
                rightColumns: 2
            },
            destroy: true
        });
    };

    useEffect(() => {
        $(document).off('click', '.edit-btn').on('click', '.edit-btn', function() {
            const orderNumber = $(this).data('id');
            handleEdit(orderNumber);
        });

        $(document).off('click', '.delete-btn').on('click', '.delete-btn', function() {
            const orderNumber = $(this).data('id');
            handleDelete(orderNumber);
        });
    }, [techSpecs]);

    const handleEdit = (orderNumber) => {
        const techSpec = techSpecs.find(spec => spec.order_number === orderNumber);
        setEditingOrder(orderNumber);
        if (techSpec) {
            setFormData({
                machine: techSpec.machine || '',
                material: techSpec.material || '',
                paper_density: techSpec.paper_density || '',
                side_wall: techSpec.side_wall || '',
                size_mm: techSpec.size_mm || '',
                total_density: techSpec.total_density || '',
                bottom: techSpec.bottom || '',
                size_mm_82_72: techSpec.size_mm_82_72 || '',
                total_density_82_72: techSpec.total_density_82_72 || '',
                strokes_per_min: techSpec.strokes_per_min || '',
                side_wall_weight_per_cup: techSpec.side_wall_weight_per_cup || '',
                side_wall_cutting_weight: techSpec.side_wall_cutting_weight || '',
                blanker_waste_norm: techSpec.blanker_waste_norm || '',
                utilization_ratio: techSpec.utilization_ratio || '',
                blank_consumption_per_1000: techSpec.blank_consumption_per_1000 || '',
                bottom_weight: techSpec.bottom_weight || '',
                bottom_cutting_weight: techSpec.bottom_cutting_weight || ''
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (orderNumber) => {
        if (window.confirm(`Вы уверены, что хотите удалить техническую спецификацию: ${orderNumber}?`)) {
            try {
                await api.delete(`/tech-specifications/${orderNumber}`);
                loadData();
                alert('Техническая спецификация успешно удалена.');
            } catch (error) {
                console.error('Ошибка удаления технической спецификации:', error);
                alert('Не удалось удалить техническую спецификацию.');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updates = {};
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== '') {
                    updates[key] = value;
                }
            });

            await api.put(`/tech-specifications/${editingOrder}`, updates);
            setIsModalOpen(false);
            loadData();
            alert('Техническая спецификация успешно обновлена.');
        } catch (error) {
            console.error('Ошибка обновления технической спецификации:', error);
            alert('Не удалось обновить техническую спецификацию.');
        }
    };

    const handleDownload = async (orderNumber) => {
        try {
            const response = await api.get(`/tech-specifications/download/${orderNumber}`, {
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
            link.setAttribute('download', `tech_spec_${orderNumber}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Ошибка загрузки технической спецификации:', error);
            alert('Не удалось загрузить техническую спецификацию.');
        }
    };

    const formFields = [
        { name: 'machine', label: 'Машина', type: 'text' },
        { name: 'material', label: 'Материал', type: 'text' },
        { name: 'paper_density', label: 'Плотность бумаги', type: 'text' },
        { name: 'side_wall', label: 'Боковая стенка', type: 'text' },
        { name: 'size_mm', label: 'Размер (мм)', type: 'number' },
        { name: 'total_density', label: 'Общая плотность', type: 'number' },
        { name: 'bottom', label: 'Дно', type: 'text' },
        { name: 'size_mm_82_72', label: 'Размер (мм) 82/72', type: 'number' },
        { name: 'total_density_82_72', label: 'Общая плотность 82/72', type: 'number' },
        { name: 'strokes_per_min', label: 'Удары в минуту', type: 'number' },
        { name: 'side_wall_weight_per_cup', label: 'Вес боковой стенки на стакан (г)', type: 'number' },
        { name: 'side_wall_cutting_weight', label: 'Вес обрезки боковой стенки (г)', type: 'number' },
        { name: 'blanker_waste_norm', label: 'Норма отходов бланкера (%)', type: 'number' },
        { name: 'utilization_ratio', label: 'Коэффициент использования', type: 'number' },
        { name: 'blank_consumption_per_1000', label: 'Расход заготовок на 1000', type: 'text' },
        { name: 'bottom_weight', label: 'Вес дна', type: 'number' },
        { name: 'bottom_cutting_weight', label: 'Вес обрезки дна', type: 'number' }
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Технические спецификации</h1>
            <div className="overflow-hidden">
                <table id="techSpecsTable" className="table table-striped table-bordered min-w-full"></table>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Редактировать техническую спецификацию</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formFields.map(field => (
                                <div key={field.name} className="flex flex-col">
                                    <label htmlFor={field.name} className="text-sm font-medium mb-1">
                                        {field.label}
                                    </label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type={field.type}
                                        value={formData[field.name] || ''}
                                        onChange={handleInputChange}
                                        className="w-full"
                                    />
                                </div>
                            ))}
                        </div>
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

export default TechSpecPage;