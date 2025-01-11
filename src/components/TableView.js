import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchTableData } from "../services/api";

const TableView = ({ endpoint }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchTableData(endpoint);
                setData(response.data);
            } catch (error) {
                alert("Failed to load data.");
            }
        };

        loadData();
    }, [endpoint]);

    const columns = Object.keys(data[0] || {}).map((key) => ({
        name: key,
        selector: (row) => row[key],
        sortable: true,
    }));

    return (
        <div className="container">
            <h1 className="text-center mt-4">Table View</h1>
            <DataTable columns={columns} data={data} pagination />
        </div>
    );
};

export default TableView;