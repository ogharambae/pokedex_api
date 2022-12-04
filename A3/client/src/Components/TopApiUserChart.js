import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

export default function App({ data }) {
    console.log(data);
    return (
        <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="apiCount" fill="rgba(21, 255, 45, 0.8)" stackId="same" />
            <Bar dataKey="user" fill="rgba(84, 157, 207, 0.4)" stackId="same" />
        </BarChart>
    );
}
