import { Button } from '@mui/material';

export default function LogoutButton({ type, onClick }) {

    return (
        <div>
            <Button
                variant="contained"
                fullWidth
                type={type}
                onClick={onClick}
            >
                Logout
            </Button>
        </div>
    )
}