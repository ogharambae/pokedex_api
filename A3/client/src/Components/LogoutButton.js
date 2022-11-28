import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";

const LogoutButton = () => {
    const navigate = useNavigate();

    const buttonHandler = (e) => {
        e.preventDefault();
        logoutUser();
    }

    const logoutUser = async () => {
        const API_URL = "http://localhost:5000"
        const { data: resData } = await axios.get(`${API_URL}/logout`, {
            withCredentials: true
        })
        if (resData) {
            navigate("/login");
        }
    }

    return (
        <Button variant="contained" style={{ fontSize: "18px", fontWeight: "bolder" }} onClick={buttonHandler} >Logout</Button>
    )
}

export default LogoutButton;