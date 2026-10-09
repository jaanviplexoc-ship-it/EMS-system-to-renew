import InputField from "../atoms/InputField";

export default function RegistrationFields({ onChange }) {

    return (
        <>

            <InputField
                name='firstName'
                label="First Name"
                type='text'
                onChange={onChange}
                required
            />

            <InputField
                name='lastName'
                label="Last Name"
                type='text'
                onChange={onChange}
                required
            />

            <InputField
                name='email'
                label="Email"
                type='email'
                onChange={onChange}
                required
            />

            <InputField
                name='phone'
                label="Phone"
                type='tel'
                onChange={onChange}
                required
            />

            <InputField
                name='joiningDate'
                label="Joining Date"
                type='date'
                onChange={onChange}
                required
            />

            <InputField
                name='departmentId'
                label="Department"
                type='text'
                onChange={onChange}
                required
            />

            <InputField
                name='designationId'
                label="Designation"
                type='text'
                onChange={onChange}
                required
            />
            <InputField
                name="salary"
                label="Salary"
                type="number"
                onChange={onChange}
                required
            />

            <InputField
                name='address'
                label="Address"
                type='text'
                onChange={onChange}
            />

            <InputField
                name='city'
                label="City"
                type='text'
                onChange={onChange}
                required
            />

            <InputField
                name='dateOfBirth'
                label="DOB(Date of Birth)"
                type='date'
                onChange={onChange}
                required
            />

            <InputField
                name="password"
                label="Password"
                type="password"
                onChange={onChange}
                required
            />

            <InputField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                onChange={onChange}
                required
            />

        </>
    )
}