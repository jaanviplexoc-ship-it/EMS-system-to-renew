
import { useEffect, useState } from "react";
import {
    Alert,
    Button,
    CircularProgress,
    MenuItem,
    TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import InputField from "../atoms/InputField";
import { createEmployee } from "../../services/employeeApi";
import { getDepartments } from "../../services/departmentApi";
import { getDesignations } from "../../services/designationApi";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    joiningDate: "",
    salary: "",
    departmentId: "",
    designationId: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
};

export default function RegistrationForm() {
    const [formData, setFormData] = useState(initialForm);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        async function loadOptions() {
            try {
                const [departmentResponse, designationResponse] = await Promise.all([
                    getDepartments(),
                    getDesignations(),
                ]);

                setDepartments(departmentResponse.data);
                setDesignations(designationResponse.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load departments and designations."
                );
            } finally {
                setLoadingOptions(false);
            }
        }

        loadOptions();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        try {
            setSaving(true);

            const payload = {
                ...formData,
                salary: Number(formData.salary),
                departmentId: Number(formData.departmentId),
                designationId: Number(formData.designationId),
                dateOfBirth: formData.dateOfBirth || null,
            };

            const response = await createEmployee(payload);

            setSuccess(
                `Employee ${response.data.firstName} ${response.data.lastName} was created. Their initial password is their phone number.`
            );

            setFormData(initialForm);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create employee. Check the form and try again."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loadingOptions) {
        return <CircularProgress />;
    }

    return (
        <form onSubmit={handleSubmit} className="employee-form">
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    action={
                        <Button color="inherit" onClick={() => navigate("/employees")}>
                            View employees
                        </Button>
                    }
                >
                    {success}
                </Alert>
            )}

            <div className="row g-3">
                {[
                    ["firstName", "First name", "text", true],
                    ["lastName", "Last name", "text", true],
                    ["email", "Email", "email", true],
                    ["phone", "Phone number", "tel", true],
                    ["dateOfBirth", "Date of birth", "date", false],
                    ["joiningDate", "Joining date", "date", true],
                    ["salary", "Salary", "number", true],
                    ["address", "Address", "text", false],
                    ["city", "City", "text", false],
                    ["state", "State", "text", false],
                    ["country", "Country", "text", false],
                    ["pincode", "Pincode", "text", false],
                ].map(([name, label, type, required]) => (
                    <div className="col-12 col-md-6" key={name}>
                        <InputField
                            name={name}
                            label={label}
                            type={type}
                            value={formData[name]}
                            onChange={handleChange}
                            required={required}
                        />
                    </div>
                ))}

                <div className="col-12 col-md-6">
                    <TextField
                        select
                        fullWidth
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <MenuItem value="">Not specified</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                </div>

                <div className="col-12 col-md-6">
                    <TextField
                        select
                        fullWidth
                        required
                        label="Department"
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleChange}
                    >
                        {departments.map((department) => (
                            <MenuItem
                                key={department.departmentId}
                                value={department.departmentId}
                            >
                                {department.departmentName}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <div className="col-12 col-md-6">
                    <TextField
                        select
                        fullWidth
                        required
                        label="Designation"
                        name="designationId"
                        value={formData.designationId}
                        onChange={handleChange}
                    >
                        {designations.map((designation) => (
                            <MenuItem
                                key={designation.designationId}
                                value={designation.designationId}
                            >
                                {designation.designationName}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
            </div>

            <Alert severity="info" sx={{ mt: 3 }}>
                The employee's initial password is their phone number. The password is
                hashed and stored by the backend.
            </Alert>

            <Button
                type="submit"
                variant="contained"
                disabled={saving}
                sx={{ mt: 3 }}
            >
                {saving ? "Creating employee..." : "Create Employee"}
            </Button>
        </form>
    );
}