import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'ID', width: 50, flex: 1 },
    { field: 'user', headerName: 'User', width: 115, flex: 1 },
    { field: 'count', headerName: 'count', width: 115, flex: 1 }
];

const rows = [
    { id: 1, count: 'Snow', user: 'Jon' },
    { id: 2, count: 'Lannister', user: 'Cersei' },
    { id: 3, count: 'Lannister', user: 'Jaime' },
    { id: 4, count: 'Stark', user: 'Arya', age: 16 },
    { id: 5, count: 'Targaryen', user: 'Daenerys' },
    { id: 6, count: 'Melisandre', user: 'User' },
    { id: 7, count: 'Clifford', user: 'Ferrara' },
    { id: 8, count: 'Frances', user: 'Rossini' }
];

export default function DataTable() {
    return (
        <div style={{ height: 375, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
            />
        </div>
    );
}