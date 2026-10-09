
import { Button } from "@mui/material";

export default function PrimaryButton({
    type = "button",
    disabled = false,
    label = "Login",
}) {
    return (
        <Button
            variant="contained"
            fullWidth
            type={type}
            disabled={disabled}
        >
            {label}
        </Button>
    );
}