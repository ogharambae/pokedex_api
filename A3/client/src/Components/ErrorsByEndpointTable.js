import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'Listing', width: 50, flex: 1 },
    { field: 'method', headerName: 'Method', width: 115, flex: 1 },
    { field: 'status', headerName: 'Status', width: 115, flex: 1 },
    { field: 'endpoint', headerName: 'Endpoint', width: 115, flex: 1 }
];

export default function DataTable({ data }) {
    const addId = (arr) => {
        return arr.map((obj, index) => {
            return ({ ...obj, id: index + 1 })
        });
    };
    const newData = addId(data)

    return (
        <div style={{ height: 375, width: '100%' }}>
            <DataGrid
                rows={newData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                sx={{ fontSize: 20 }}
            />
        </div>
    );
}