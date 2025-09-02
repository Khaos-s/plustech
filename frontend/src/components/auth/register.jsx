import React, { use, useState } from 'react'
import { useAuth } from '../../authContext/authContext'
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth'
import { useNavigate, Navigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState("")
    const [passowrd, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const OnSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage("")

        if (password !== confirmPassword) {
            setErrorMessage("Password do not mattch")
            return
        }

        setIsRegistering(true)
        try {
            await doCreateUserWithEmailAndPassword(email, passowrd)
            navigate("/home")
        } catch (error) {
            setErrorMessage(error.message)
        }
        setIsRegistering(false)
    }

    if (userLoggedIn) {
        return <Navigate to="/home" replace />
        return (
            <div>
                <h2>Register</h2>
                <form onSubmit={onSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={isRegistering}>
                        {isRegistering ? "Registering..." : "Register"}
                    </button>
                </form>

                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>
        )
    }
}

export default Register
