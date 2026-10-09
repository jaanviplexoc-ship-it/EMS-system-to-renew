
import InputField from "../atoms/InputField";

export default function LoginFields({
    email,
    password,
    setEmail,
    setPassword,
}) {
    return (
        <div className="input-fields">
            <div className="email-field">
                <InputField
                    name="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
            </div>

            <div className="password-field">
                <InputField
                    name="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
            </div>
        </div>
    );
}