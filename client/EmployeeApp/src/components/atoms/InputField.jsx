
import { TextField } from "@mui/material";

export default function InputField({
  name,
  value,
  label,
  type = "text",
  onChange,
  required = false,
  error = false,
  helperText = "",
  disabled = false,
  multiline = false,
  rows,
}) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      name={name}
      value={value ?? ""}
      label={label}
      type={type}
      onChange={onChange}
      required={required}
      error={error}
      helperText={helperText}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      slotProps={{
        inputLabel: {
          shrink: type === "date" || undefined,
        },
      }}
    />
  );
}