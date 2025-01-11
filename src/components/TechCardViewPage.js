// TechCardViewPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

const TechCardViewPage = () => {
    const { orderNumber } = useParams();
    const [techCard, setTechCard] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTechCard = async () => {
            try {
                // We fetch the entire list or a single record from your backend
                const response = await api.get('/tech-cards/combined');
                // Filter out the relevant card
                const card = response.data.find((item) => item.order_number === parseInt(orderNumber, 10));
                if (card) {
                    setTechCard(card);
                } else {
                    setError(`Tech Card with order number ${orderNumber} not found.`);
                }
            } catch (err) {
                setError('Error fetching Tech Card details.');
            }
        };
        fetchTechCard();
    }, [orderNumber]);

    const handleDownload = async (orderNum) => {
        try {
            const response = await api.get(`/tech-cards/download/${orderNum}`, {
                responseType: 'blob',
                headers: { 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
            });
            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `tech_card_${orderNum}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to download the tech card.');
        }
    };

    if (error) {
        return (
            <div className="container">
                <h2 className="text-xl font-bold mb-4">Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!techCard) {
        return (
            <div className="container">
                <p>Loading Tech Card details...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-4">
                Viewing Tech_Card_{techCard.order_number}
            </h1>
            <p>Customer: {techCard.customer}</p>
            <p>Production Start: {techCard.production_start_date}</p>
            <p>Circulation: {techCard.circulation}</p>
            <p>Design: {techCard.design}</p>
            {/* Add more fields as needed */}
            <button
                className="btn btn-primary mt-4"
                onClick={() => handleDownload(techCard.order_number)}
            >
                Download Excel
            </button>
        </div>
    );
};

export default TechCardViewPage;