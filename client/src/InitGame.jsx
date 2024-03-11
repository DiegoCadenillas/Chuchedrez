import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import CustomDialog from "./components/CustomDialog";
import socket from './socket';

export default function InitGame({ setRoom, setOrientation, setPlayers }) {
    const [roomDialogOpen, setRoomDialogOpen] = useState(false);
    const [roomInput, setRoomInput] = useState(''); // input state
    const [roomError, setRoomError] = useState('');

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ height: '100%', padding: 0, margin: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
            <CustomDialog
                open={roomDialogOpen}
                handleClose={() => setRoomDialogOpen(false)}
                title="Unirse a una sala"
                contentText="Introduzca el ID de la sala"
                handleContinue={() => {
                    // join a room
                    if (!roomInput) return; // if given room input is valid, do nothing.
                    socket.emit("joinRoom", { roomId: roomInput }, (r) => {
                        // r is the response from the server
                        if (r.error) return setRoomError(r.message); // if an error is returned in the response set roomError to the error message and exit
                        console.log("response:", r);
                        setRoom(r?.roomId); // set room to the room ID
                        setPlayers(r?.players); // set players array to the array of players in the room
                        setOrientation("black"); // set orientation as black
                        setRoomDialogOpen(false); // close dialog
                    });
                }}
            >
                <TextField
                    autoFocus
                    margin="dense"
                    id="room"
                    label="ID de sala"
                    name="room"
                    value={roomInput}
                    required
                    onChange={(e) => setRoomInput(e.target.value)}
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(roomError)}
                    helperText={!roomError ? 'Introduzca el ID de la sala' : `ID de sala inválido: ${roomError}`}
                />
            </CustomDialog>
            {/* Button for starting a game */}
            <Button
                variant="contained"
                onClick={() => {
                    socket.emit("createRoom", (r) => {
                        console.log(r);
                        setRoom(r);
                        setOrientation("white");
                    });
                }}
            >
                Crear sala
            </Button>
            {/* Button for joining a game */}
            <Button
            variant="contained"
                onClick={() => {
                    setRoomDialogOpen(true)
                }}
            >
                Unirse a una sala
            </Button>
        </Stack>
    );
}