import React, { useState } from 'react'
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../firebase/auth'
import { useAuth } from '../../authContext/authContext'



const Login = () => {
    const { userLoggedIn } = useAuth()
    const [email, setEmail] = useState("")
    const [passowrd, setPassword] = useState("")
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("")

        if (!isSigningIn) {
            setIsSigningIn(true)
            await doSignInWithEmailAndPassword(email, passowrd);
        }
    }

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false)
            })
        }
    }
}

function login() {
    return (
        <div>

        </div>
    )
}

export default login
