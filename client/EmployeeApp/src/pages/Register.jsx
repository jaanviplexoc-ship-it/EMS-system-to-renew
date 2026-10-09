
import { Typography, Paper } from "@mui/material";
import MainLayout from "../components/molecules/MainLayout";
import RegistrationForm from "../components/organisms/RegistrationForm";

export default function Register() {
    return (
        <MainLayout>
            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight={700} mb={1}>
                    Add Employee
                </Typography>

                <Typography color="text.secondary" mb={4}>
                    Create an employee record and linked login account.
                </Typography>

                <RegistrationForm />
            </Paper>
        </MainLayout>
    );
}