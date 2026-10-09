import { Chip } from "@mui/material";

export default function StatusBadge({ status }) {

    const isActive = status === "Active";

    return (
        <Chip
            label={status}
            size="small"
            className={
                isActive
                    ? "employee-status active"
                    : "employee-status inactive"
            }
        />
    );
}