import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({ isDuplicate, setValid, setResponse }) {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(true);
    };

    const navigate = useNavigate();

    const redirectToLogin = () => {
        navigate("/login")
    }

    const remainAtCurrent = () => {
        setValid(false);
        setResponse(false);
        setOpen(false);
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {isDuplicate ? "Username is already in use." : "You have signed up successfully!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {isDuplicate ? "Please provide another username." : "You may now log in using your credentials!"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={isDuplicate ? remainAtCurrent : redirectToLogin} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
