import * as React from "react";
import { Button, Typography, Dialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({ pokemon, setShow }) {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(true);
    };

    const types = JSON.stringify(pokemon.type).replace(/[\[\]'"]+/g, ' ');

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" variant="h3">
                    {pokemon.name.english}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" variant="h5">
                        HP: {pokemon.base.HP}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description" variant="h5">
                        Attack: {pokemon.base.Attack}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description" variant="h5">
                        Defense: {pokemon.base.Defense}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description" variant="h5">
                        Speed: {pokemon.base.Speed}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description" variant="h5">
                        Speed Attack: {pokemon.base["Speed Attack"]}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description" variant="h5">
                        Speed Defense: {pokemon.base["Speed Defense"]}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description" variant="h5">
                        Type: {types}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description" variant="h5">
                        ID: {pokemon.id}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setShow(false)
                        }}
                        autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
