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
          console.log('logged in user data seems like ',logedStudentdetails);
          

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
    <div className="main-div">
      <div className="container">
        <form>
          <section>
            <div class="row">
              <div class="col-xl-5 col-lg-5 ">
                <div class="card card-transparent">
                  <div class="card-body">
                    <h3>
                      Showcase and guide users with a better User Interface
                      &amp; Experience.{" "}
                    </h3>
                    <p>
                      Forms are one of the most important components when it
                      comes to a dashboard. Recognizing that fact, users are
                      able work in a maximum content width.{" "}
                    </p>

                    <p class="small hint-text m-t-5">
                      VIA senior product manager for UI/UX at REVOX{" "}
                    </p>
                    <button
                      class="btn btn-primary btn-cons"
                      fdprocessedid="zecdb"
                    >
                      More
                    </button>
                  </div>
                </div>
              </div>

              <div class="col-xl-7 col-lg-7 student-data-wrap">
                <div class="card">
                  <div class="card-body">
                    <h2 class="mw-80">Get started with your account.</h2>
                    <p class="fs-16 mw-80 m-b-40">
                      Find your people. Engage your customers. Build your brand.
                      Do it all with Page's UI Framework Platform. Already have
                      an account? <a href="javascript:void(0);">Log in</a>
                    </p>

                    <section>
                      <div class="info-title"> Log to your account</div>
                      <div class="row">
                        <div class="col-md-12">
                          <div className="form-group">
                            <input
                              type="text"
                              id="Idstudent"
                              name="Idstudent"
                              className="form-control"
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
                            <p>We'll never share your id.</p>
                            <span>StudentId is required</span>
                          </div>
                        </div>
                      </div>

                      {passwordfieldVisibility && (
                        <>
                          <div class="row">
                            <div class="col-md-6">
                              <div className="form-group">
                                <input
                                  type="text"
                                  id="Password"
                                  name="Password"
                                  className="form-control"
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
                                    isPasswordSet
                                      ? "Enter yoy password"
                                      : "Create password"
                                  }
                                  required
                                />
                                <p>We'll never share your password.</p>
                                <span>
                                  Password should contain minimum 8
                                  characters,atleast 1 uppercase,lowercase and
                                  digit
                                </span>
                              </div>
                            </div>

                            {!isPasswordSet && (
                              <div class="col-md-6">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    id="Cpassword"
                                    name="Cpassword"
                                    className="form-control"
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
                                  <p>We'll never share your password.</p>
                                  {!isPasswordMatch &&
                                    loginInputsFocusmissing.Cpassworderror && (
                                      <span style={{ color: "red" }}>
                                        Password should match
                                      </span>
                                    )}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </section>
                    {/* //button */}
                    <div class="clearfix"></div>
                    <div class="row m-t-25">
                      <div class="col-xl-6 p-b-10">
                        <p class="small-text hint-text">
                          By clicking the "Submit" button, you are creating a
                          account, and you agree to Pages's{" "}
                          <a href="javascript:void(0);">Terms of Use</a> and{" "}
                          <a href="javascript:void(0);">Privacy Policy</a>.{" "}
                        </p>
                      </div>
                      <div class="col-xl-6">
                        <button
                          aria-label=""
                          class="btn btn-primary pull-right btn-lg btn-block"
                          type="submit"
                          onClick={handleSubmitForm}
                          fdprocessedid="15tyk9d"
                        >
                          {isPasswordSet ? "Login" : "Submit"}
                        </button>

                        <div class="text-center mt-3">
                          <p class="mb-0">
                            Don't have an account?
                            <Link
                              to="/register"
                              class="text-primary font-weight-bold"
                            >
                              Register here
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>

    // <div className="lgn-main">

    //   <div className="form-container-login">
    //     <div className="hdr">
    //       <h5>Login to your account</h5>
    //     </div>
    //     <div className="form-content">
    //       {/* <form action="" onSubmit={handleSubmitForm}> */}
    //       <FormControl id="studentID" mb={4}>
    //         <FormLabel color="white" fontStyle="italic">
    //           Enter Your Id:
    //         </FormLabel>
    //         <Input
    //           type="text"
    //           id="Idstudent"
    //           name="Idstudent"
    //           value={logininputStates.Idstudent}
    //           onChange={loginFieldsTrigger}
    //           onBlur={() =>
    //             setloginInputsFocusmissing({
    //               ...loginInputsFocusmissing,
    //               Idstudenterror: true,
    //             })
    //           }
    //           focus={loginInputsFocusmissing.Idstudenterror.toString()}
    //           placeholder="Student ID,please"
    //           required
    //         />
    //         <FormHelperText>We'll never share your id.</FormHelperText>
    //         <span>StudentId is required</span>
    //       </FormControl>
    //       {passwordfieldVisibility && (
    //         <>
    //           <FormControl id="Password" mb={4}>
    //             <FormLabel color="white" fontStyle="italic">
    //               {isPasswordSet ? " Password" : "Create password"}
    //             </FormLabel>
    //             <Input
    //               type="text"
    //               id="Password"
    //               name="Password"
    //               pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
    //               value={logininputStates.Password}
    //               onChange={loginFieldsTrigger}
    //               onBlur={() =>
    //                 setloginInputsFocusmissing({
    //                   ...loginInputsFocusmissing,
    //                   Passworderror: true,
    //                 })
    //               }
    //               focus={loginInputsFocusmissing.Passworderror.toString()}
    //               placeholder={
    //                 isPasswordSet ? "Enter yoy password" : "Create password"
    //               }
    //               required
    //             />
    //             <FormHelperText>
    //               We'll never share your password.
    //             </FormHelperText>
    //             <span>
    //               Password should contain minimum 8 characters,atleast 1
    //               uppercase,lowercase and digit
    //             </span>
    //           </FormControl>
    //           {!isPasswordSet && (
    //             <FormControl id="Cpassword" mb={4}>
    //               <FormLabel color="white" fontStyle="italic">
    //                 Confirm Password
    //               </FormLabel>
    //               <Input
    //                 type="text"
    //                 id="Cpassword"
    //                 name="Cpassword"
    //                 pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
    //                 value={logininputStates.Cpassword}
    //                 onChange={loginFieldsTrigger}
    //                 onBlur={() =>
    //                   setloginInputsFocusmissing({
    //                     ...loginInputsFocusmissing,
    //                     Cpassworderror: true,
    //                   })
    //                 }
    //                 focus={loginInputsFocusmissing.Cpassworderror.toString()}
    //                 placeholder="Confirm your password"
    //                 required
    //               />
    //               <FormHelperText>
    //                 We'll never share your password.
    //               </FormHelperText>
    //               {!isPasswordMatch &&
    //                 loginInputsFocusmissing.Cpassworderror && (
    //                   <span style={{ color: "red" }}>
    //                     Password should match
    //                   </span>
    //                 )}
    //             </FormControl>
    //           )}
    //         </>
    //       )}

    //       <Button
    //         colorScheme="teal"
    //         size="lg"
    //         _hover={{ backgroundColor: "#508D4E" }}
    //         fontWeight="bold"
    //         type="submit"
    //         onClick={handleSubmitForm}
    //       >
    //         {isPasswordSet ? "Login" : "Submit"}
    //       </Button>
    //       {/* </form> */}

    //       <Text mt={4} color="white" fontSize="md">
    //         Don't have an account?
    //         <Link
    //           to="/register"
    //           style={{ color: "teal", fontWeight: "bold", fontSize: "md" }}
    //         >
    //           Register here
    //         </Link>
    //       </Text>
    //     </div>
    //   </div>
    // </div>
  );
};

export default LoginFormUI;
