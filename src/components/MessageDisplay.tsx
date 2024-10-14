import React from "react";
import {Typography} from "@mui/material";

interface MessageDisplayProps {
    message: string | null;
    type:  "error" | "validation";
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({message, type}) => {
    if(!message) return null;

    return (
        <Typography
        variant="body2"
        sx={{marginTop:"10px",
            color: type === "error" ? "red" : "#4caf50"
        }}>
            {message}
        </Typography>
    )
}

export default MessageDisplay;