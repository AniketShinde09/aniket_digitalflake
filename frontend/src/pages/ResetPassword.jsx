
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate for redirection
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import styles from "./styles/Home.module.css";
import { useToast } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Input,
} from '@chakra-ui/react';
import axios from 'axios'; // Import axios for making API requests

function ResetPassword() {
  const location = useLocation(); // Hook to get the current URL
  const navigate = useNavigate(); // Hook to redirect to login after password reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  // Extract the email from query parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailFromQuery = searchParams.get("email"); // Get email from query params
    if (emailFromQuery) {
      setEmail(decodeURIComponent(emailFromQuery)); // Decode and set email
    }
  }, [location.search]);

  const handleResetPassword = async () => {
    // Basic validation for password and repeat password match
    if (password === "" || repeatPassword === "" || password !== repeatPassword) {
      toast({
        title: `Passwords do not match`,
        position: "top",
        status: "error",
        isClosable: true,
      });
      return;
    }

    try {
      // Make a POST request to the update-password route
      const response = await axios.post('https://digitalflake-backend.onrender.com/user/update-password', {
        email,
        currentPassword: password,
        newPassword: repeatPassword, // Only send the new password, no need for currentPassword
      });
      console.log(response.data);

      if (response.data === "Password updated success") {
        // Show success modal and reset form
        setIsModalOpen(true);
      } else {
        // Handle any error from the server
        toast({
          title: `Error resetting password`,
          description: response.data.msg || "Something went wrong",
          position: "top",
          status: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      // Handle error from the API
      toast({
        title: `Error resetting password`,
        description: error.response?.data?.msg || "An unexpected error occurred",
        position: "top",
        status: "error",
        isClosable: true,
      });
    }
  };


  const closeModal = () => {
    setIsModalOpen(false);
    toast({
      title: `Password reset successfully, Login now!`,
      position: "top",
      status: "success",
      isClosable: true,
    });
    navigate("/")
  };

  return (
    <div>
      <Navbar />
      <div className={styles.cont}>
        <SideBar />
        <div className={styles.box3}>
          <h2>Reset Password</h2>
          <form className={styles.form1}>
            <div>
              <label>Email</label>
              <Input
                type="email"
                value={email}
                isDisabled // Pre-filled and non-editable
              />
            </div>
            <div>
              <label>New Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label>Repeat Password</label>
              <Input
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Repeat new password"
              />
            </div>
            <div>
              <Button
                colorScheme="blue"
                mt={4}
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Chakra UI Modal for success message */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Password Reset</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Your password has been reset successfully.
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ResetPassword;
