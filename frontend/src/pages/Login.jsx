import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, signupUser, toggleForm } from '../redux/action';
import styles from "./styles/login.module.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useToast } from '@chakra-ui/react';
import Spinner from '../components/Spinner';
import axios from 'axios'; // Import axios for making API requests
import Error from "../components/Error"

function Login() {
    const navigate = useNavigate(); // Initialize the navigate function
    const dispatch = useDispatch();
    const showLogin = useSelector((state) => state.showLogin);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resetPassword, setResetPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
    const [resetEmail, setResetEmail] = useState(""); // Email for password reset
    const loading = useSelector((store) => store.isLoading);
    const error = useSelector((store) => store.isError);
    const toast = useToast();

    const handleLogin = () => {
        let vals = {
            email,
            password,
        };
        return dispatch(loginUser(vals))
            .then((res) => {
                if (res?.status === 200) {
                    navigate("/Home");
                    toast({
                        title: `Login Success`,
                        position: "top",
                        isClosable: true,
                    });
                } else {
                    throw new Error("Login failed");
                }
            })
            .catch((err) => {
                setEmail(""); 
                setPassword("");
                toast({
                    title: `Wrong credential`,
                    position: "top",
                    isClosable: true,
                    status: "error",
                });
            });
    };

    const handleToggle = (e) => {
        dispatch(toggleForm());
    };

    const handleSignup = async () => {
        const data = {
            email,
            password,
            resetPassword,
        };

        try {
            let res = await dispatch(signupUser(data)); 
            if (res?.data?.msg === "User Registered success") {
                setEmail("");
                setPassword("");
                dispatch(toggleForm());
                toast({
                    title: `Signup Success!`,
                    position: "top",
                    isClosable: true,
                    status: "success",
                });
            } else if (res?.data === "Password does not matched") {
                toast({
                    title: `Password does not match`,
                    position: "top",
                    isClosable: true,
                    status: "error",
                });
            } else {
                toast({
                    title: `Signup Failed`,
                    description: res?.data?.msg || "Something went wrong",
                    position: "top",
                    isClosable: true,
                    status: "error",
                });
            }
        } catch (error) {
            toast({
                title: `Signup Failed`,
                description: error.response?.data?.msg || "An unexpected error occurred",
                position: "top",
                isClosable: true,
                status: "error",
            });
        }
    };

    const handlePasswordReset = async () => {
        try {
            // Send the reset email by calling the backend /send-mail API
            const response = await axios.post('https://digitalflake-backend.onrender.com/send-mail', { email: resetEmail });

            if (response.data === "Reset password email sent successfully!") {
                // If email is sent successfully, show success toast
                toast({
                    title: `Reset password link sent to your email`,
                    position: "top",
                    isClosable: true,
                    status: "success",
                });
            }
        } catch (error) {
            // Handle any errors from the API call
            toast({
                title: `Error sending reset email`,
                position: "top",
                isClosable: true,
                status: "error",
            });
        } finally {
            setIsModalOpen(false); // Close the modal after handling
        }
    };

    return (
        <div className={styles.main}>
            {loading ? <Spinner /> : error ? <h1> <Error /> </h1> : (
                <>
                    <div className={`${styles.box1} ${showLogin ? styles.active : styles.inactive}`}>
                        <div className={styles.form}>
                            <div className={styles.header}>
                                <img src="https://digitalflake.com/wp-content/uploads/2023/04/DF_logo-transparent2.png" alt="" />
                                <p>Welcome to Digitalflake admin</p>
                            </div>
                            <form>
                                <label className={styles.label}>Email-id</label>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" />
                                <label className={styles.label}>Password</label>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" />
                            </form>
                            <a href="#" onClick={() => setIsModalOpen(true)}>Forgot password?</a>
                            <button onClick={handleLogin}>Log In</button>
                            <p className={styles.redirect}> Don't have an account? <span onClick={handleToggle}>Sign Up</span> </p>
                        </div>
                    </div>

                    <div className={`${styles.box2} ${!showLogin ? styles.active : styles.inactive}`}>
                        <div className={styles.form}>
                            <div className={styles.header}>
                                <img src="https://digitalflake.com/wp-content/uploads/2023/04/DF_logo-transparent2.png" alt="" />
                                <p>Welcome to Digitalflake admin</p>
                            </div>
                            <form>
                                <label className={styles.label}>Email-id</label>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" />
                                <label className={styles.label}>Password</label>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" />
                                <label className={styles.repeat}>Repeat Password</label>
                                <input value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} type="text" />
                            </form>
                            <button onClick={handleSignup}>Sign Up</button>
                            <p className={styles.redirect}> Already have an account? <span onClick={handleToggle}>Log In</span> </p>
                        </div>
                    </div>
                    
                    {/* Modal for Forgot Password */}
                    {isModalOpen && (
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                <h3>Did you forget your password?</h3>
                                <p>Enter your email address and we’ll send you a link to reset your password.</p>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                />
                                <button onClick={handlePasswordReset}>Request reset link</button>
                                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Login;
