import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useToast,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginFormUI = ({ setUser }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [logininputStates, setlogininputStates] = useState({
    Idstudent: "",
    Password: "",
    Cpassword: "",
  });
  const [loginInputsFocusmissing, setloginInputsFocusmissing] = useState({
    Idstudenterror: false,
    Passworderror: false,
    Cpassworderror: false,
  });
  const [isPasswordMatch, setisPasswordMatch] = useState(true);
  const [loading, setloading] = useState(false);
  const [passwordfieldVisibility, setpasswordfieldVisibility] = useState(false);
  const [isPasswordSet, setisPasswordSet] = useState(false);
  const loginFieldsTrigger = async (e) => {
    const { type, name, id, value } = e.target;
    setlogininputStates({ ...logininputStates, [name]: value });

    if (name === "Idstudent") {
      setloading(true);
      try {
        const response = await axios.get(`/api/users/login?id=${value}`);
        if (response.data.userExists) {
          if (!response.data.hasPassword) {
            setpasswordfieldVisibility(true);
            setisPasswordSet(false);

            toast({
              title: response.data.message,
              description: "just check it out",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
          } else {
            setpasswordfieldVisibility(true);
            setisPasswordSet(true);
          }
        } else {
          setpasswordfieldVisibility(false);
          setisPasswordSet(false);
          toast({
            title: response.data.message,
            description: "just check it out",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to validate the student ID",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setloading(false);
      }
    }

    if (name === "Cpassword") {
      setisPasswordMatch(value === logininputStates.Password);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    //here we perform this operation when userexists and passsword also exists
    if (isPasswordSet) {
      try {
        setloading(true);
        const response = await axios.post(
          `/api/users/submitCredentials?id=${logininputStates.Idstudent}`,
          logininputStates
        );
        if (response.data.success) {
          const logedStudentdetails = response.data.studentDet;

          //here we are going to store data in user state
          setUser(logedStudentdetails);

          //we are going to store this in local storage ,storing logged user data in local storage
          localStorage.setItem("UserInfo", JSON.stringify(logedStudentdetails));
          toast({
            title: response.data.message,
            description: "You have logged in successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        if (error.response && error.response.data) {
          // Backend returned a validation error (like invalid credentials)
          toast({
            title: error.response.data.message,
            description: "Please check your credentials.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          // Generic error (like network issues)
          toast({
            title: "Error",
            description: "Failed to login. Please try again later.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      } finally {
        setloading(false);
      }
    } else {
      try {
        setloading(true);
        const response = await axios.put(
          `/api/users/createNewPassword?id=${logininputStates.Idstudent}`,
          logininputStates
        );
        if (response.data.success) {
          const psdCrstudentdet = response.data.studentDet;
          setUser(psdCrstudentdet);

          localStorage.setItem("UserInfo", JSON.stringify(psdCrstudentdet));
          toast({
            title: response.data.message,
            // description: "We've created your account for you.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        if (error.response && error.response.data) {
          toast({
            title: error.response.data.message,
            // description: "We've created your account for you.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to login. Please try again later.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      } finally {
        setloading(false);
      }
    }
    //when user exists and they have not created password yet
  };
  return (
    <div className="lgn-main">
      {/* <Header /> */}

      <div className="form-container-login">
        <div className="hdr">
          <h5>Login to your account</h5>
        </div>
        <div className="form-content">
          {/* <form action="" onSubmit={handleSubmitForm}> */}
          <FormControl id="studentID" mb={4}>
            <FormLabel color="white" fontStyle="italic">
              Enter Your Id:
            </FormLabel>
            <Input
              type="text"
              id="Idstudent"
              name="Idstudent"
              value={logininputStates.Idstudent}
              onChange={loginFieldsTrigger}
              onBlur={() =>
                setloginInputsFocusmissing({
                  ...loginInputsFocusmissing,
                  Idstudenterror: true,
                })
              }
              focus={loginInputsFocusmissing.Idstudenterror.toString()}
              placeholder="Student ID,please"
              required
            />
            <FormHelperText>We'll never share your id.</FormHelperText>
            <span>StudentId is required</span>
          </FormControl>
          {passwordfieldVisibility && (
            <>
              <FormControl id="Password" mb={4}>
                <FormLabel color="white" fontStyle="italic">
                  {isPasswordSet ? " Password" : "Create password"}
                </FormLabel>
                <Input
                  type="text"
                  id="Password"
                  name="Password"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  value={logininputStates.Password}
                  onChange={loginFieldsTrigger}
                  onBlur={() =>
                    setloginInputsFocusmissing({
                      ...loginInputsFocusmissing,
                      Passworderror: true,
                    })
                  }
                  focus={loginInputsFocusmissing.Passworderror.toString()}
                  placeholder={
                    isPasswordSet ? "Enter yoy password" : "Create password"
                  }
                  required
                />
                <FormHelperText>
                  We'll never share your password.
                </FormHelperText>
                <span>
                  Password should contain minimum 8 characters,atleast 1
                  uppercase,lowercase and digit
                </span>
              </FormControl>
              {!isPasswordSet && (
                <FormControl id="Cpassword" mb={4}>
                  <FormLabel color="white" fontStyle="italic">
                    Confirm Password
                  </FormLabel>
                  <Input
                    type="text"
                    id="Cpassword"
                    name="Cpassword"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    value={logininputStates.Cpassword}
                    onChange={loginFieldsTrigger}
                    onBlur={() =>
                      setloginInputsFocusmissing({
                        ...loginInputsFocusmissing,
                        Cpassworderror: true,
                      })
                    }
                    focus={loginInputsFocusmissing.Cpassworderror.toString()}
                    placeholder="Confirm your password"
                    required
                  />
                  <FormHelperText>
                    We'll never share your password.
                  </FormHelperText>
                  {!isPasswordMatch &&
                    loginInputsFocusmissing.Cpassworderror && (
                      <span style={{ color: "red" }}>
                        Password should match
                      </span>
                    )}
                </FormControl>
              )}
            </>
          )}

          <Button
            colorScheme="teal"
            size="lg"
            _hover={{ backgroundColor: "#508D4E" }}
            fontWeight="bold"
            type="submit"
            onClick={handleSubmitForm}
          >
            {isPasswordSet ? "Login" : "Submit"}
          </Button>
          {/* </form> */}

          <Text mt={4} color="white" fontSize="md">
            Don't have an account?
            <Link
              to="/register"
              style={{ color: "teal", fontWeight: "bold", fontSize: "md" }}
            >
              Register here
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default LoginFormUI;
