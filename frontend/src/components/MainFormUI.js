import React, { useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'
import "../App.css";
import {
  Button,
  useToast,
  ButtonGroup,
  Stack,
  Flex,
  Box,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "./commonComponent/Header";

const MainFormUI = ({ user }) => {
  const navigate = useNavigate()
  //so here i am going to store each data from the fields to particular state in   objects format.
  const [inputStates, setinputStates] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    primaryContact: "",
    primaryName: "",
    primaryPhone: "",
    primaryEmail: "",
    secondaryContact: "",
    secondaryName: "",
    secondaryPhone: "",
    secondaryEmail: "",
    vocation: "",
    class: "",
    enterclassorprofession: "",

    institution: "",
    photo: null,
    EnterInstitution: "",
    password: "",
    Cpassword: "",
  });
  const [photoError, setPhotoError] = useState(""); // To track error messages
  const [formSubmitted, setFormSubmitted] = useState(false); // Track submission status


  const [inputsFocusmissing, setinputsFocusmissing] = useState({
    firstNameerror: false,
    lastNameerror: false,
    gendererror: false,
    doberror: false,
    emailerror: false,
    mobileerror: false,
    address1error: false,
    address2error: false,
    cityerror: false,
    stateerror: false,
    countryerror: false,
    pincodeerror: false,
    primaryContacterror: false,
    primaryNameerror: false,
    primaryPhoneerror: false,
    primaryEmailerror: false,
    secondaryContacterror: false,
    secondaryNameerror: false,
    secondaryPhoneerror: false,
    secondaryEmailerror: false,
    vocationerror: false,
    classerror: false,
    enterclassorprofessionerror: false,
    institutionerror: false,
    photoerror: false,
    EnterInstitutionerror: false,
    passworderror: false,
    Cpassworderror: false,
  });
  const [responseData, setresponseData] = useState({});
  // const [editResponseData, setEditResponseData] = useState({});

  const [loadingData, setloadingData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isDeleting, setisDeleting] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true); // true means passwords match

  const toast = useToast();
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so +1
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    //we need to check whether all required fields are filled or not while form submission ,if not we need to show some warning message
    const checkingElements = e.target.elements;
    console.log("checked elements seems like", checkingElements);

    let isValid = true;
    Array.from(checkingElements).forEach((element) => {
      if (element.tagName === "INPUT" || element.tagName === "SELECT") {
        if (!element.checkValidity()) {
          isValid = false;
          element.classList.add("submitted");
        } else {
          element.classList.remove("submitted");
        }
      }
    });

    if (isValid) {
      //here we are going to pass data through api request
      setFormSubmitted(false)
      setloadingData(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const isCurrentlyEditing =
        responseData && responseData._id ? true : false;
      try {
        let editResponse;
        if (isEditing || isCurrentlyEditing) {
          console.log("Data being sent to backend:", inputStates);

          const response = await axios.put(
            // `/api/users/update?id=${responseData._id}`,
            `/api/users/update`,
            inputStates,
            config
          );
          const responseEdit = response.data;
          if (responseEdit._id) {
            setresponseData(responseEdit);
            toast({
              title: "Updated successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
            setinputStates({
              _id: responseEdit._id,
              firstName: responseEdit.studentPersonalInfo.firstName,
              middleName: responseEdit.studentPersonalInfo.middleName || "", // Handle optional field
              lastName: responseEdit.studentPersonalInfo.lastName,
              gender: responseEdit.studentPersonalInfo.gender,
              dob: formatDate(responseEdit.studentPersonalInfo.dob),
              mobile: responseEdit.studentPersonalInfo.mobile,
              email: responseEdit.studentPersonalInfo.email,
              address1: responseEdit.address.address1,
              address2: responseEdit.address.address2 || "", // Handle optional field
              city: responseEdit.address.city,
              state: responseEdit.address.state,
              country: responseEdit.address.country,
              pincode: responseEdit.address.pincode,
              primaryContact: responseEdit.contacts.primary.relation,
              primaryName: responseEdit.contacts.primary.name,
              primaryPhone: responseEdit.contacts.primary.phone,
              primaryEmail: responseEdit.contacts.primary.email,
              secondaryContact: responseEdit.contacts.secondary.relation || "", // Handle optional field
              secondaryName: responseEdit.contacts.secondary.name || "", // Handle optional field
              secondaryPhone: responseEdit.contacts.secondary.phone || "", // Handle optional field
              secondaryEmail: responseEdit.contacts.secondary.email || "", // Handle optional field
              vocation: responseEdit.vocation,
              class: responseEdit.class || "", // Handle optional field
              enterclassorprofession: responseEdit.enterclassorprofession || "",
              institution: responseEdit.institution || "", // Handle optional field
              photo: responseEdit.photo || "", // Handle optional field
              EnterInstitution: responseEdit.EnterInstitution || "",
              password: responseEdit.accountInfo
                ? responseEdit.accountInfo.password
                : "",
            });
            setIsEditing(false);
            setloadingData(false);
          } else if (responseEdit.message) {
            toast({
              title: responseEdit.message,
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
          }
        } else {
          const { data } = await axios.post(
            "http://localhost:5000/api/users/save",
            inputStates,
            config
          );
          setloadingData(false);
          if (data._id) {
            setresponseData(data);
            console.log("response data seems like", responseData);

            toast({
              title: "Congratulations,User Account Created successfully",
              status: "success",
              duration: 9000,
              isClosable: true,
              position: "top-right",
            });
            navigate("/");


            setinputStates({
              firstName: "",
              middleName: "",
              lastName: "",
              gender: "",
              dob: "",
              mobile: "",
              email: "",
              address1: "",
              address2: "",
              city: "",
              state: "",
              country: "India",
              pincode: "",
              primaryContact: "",
              primaryName: "",
              primaryPhone: "",
              primaryEmail: "",
              secondaryContact: "",
              secondaryName: "",
              secondaryPhone: "",
              secondaryEmail: "",
              vocation: "",
              class: "",
              enterclassorprofession: "",
              institution: "",
              photo: null,
              EnterInstitution: "",
              password: "",
              Cpassword: "",
            });
            // setinputsFocusmissing({})
            // setFormSubmitted(true)
          } else if (data.message) {
            toast({
              title: data.message,
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
          }
        }
      } catch (error) {
        setloadingData(false);
        console.error(
          "API request failed:",
          error.response ? error.response.data : error.message
        );

        toast({
          title: "Something went wrong. Please try again later.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }

      // ending of if
    } else {
      console.log("please fill the fields firstly");
    }
  };
  const inputsTrigger = (e) => {
    const { name, value, id, type, checked, files } = e.target;

    setinputStates({
      ...inputStates,
      [name]: type === "file" ? files[0] : value,
    }); //beacuse here we are only allowing a single image to upload
    if (name === "Cpassword") {
      setPasswordMatch(value === inputStates.password);
    }
  };

  const postPictureDetails = (pics, name) => {
    setPhotoError("");
    if (!pics && inputStates.photo) {
      // No new file selected, keep the existing photo
      return;
    }
    if (pics === undefined) {
      setPhotoError("Select an file");
      console.log("photoError seems like", photoError);

      toast({
        title: "PLease select any image to upload",
        // description: "We've created your account for you.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/svg+xml"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "FormUsersParent");
      data.append("cloud_name", "dhbe7h0hc");
      fetch("https://api.cloudinary.com/v1_1/dhbe7h0hc/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          const pictInfo = data.url.toString();
          setinputStates({ ...inputStates, [name]: pictInfo });
        })
        .catch((err) => {
          console.log("uploading error seems like", err);
        });
    } else {
      setPhotoError("Please upload a valid image file (JPG, PNG, SVG).");
      console.log(
        "photoError is being set to: Please upload a valid image file (JPG, PNG, SVG)."
      );

      toast({
        title: "Please select an image of type jpeg/png!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
  };
  const handleEditFunctionality = () => {
    console.log("User:", user);
    console.log("InputStates:", inputStates);
    console.log("response seems like", responseData);
    setisDeleting(false);
    if (responseData && responseData.studentPersonalInfo) {
      setinputStates({
        _id: responseData._id,
        firstName: responseData.studentPersonalInfo.firstName,
        middleName: responseData.studentPersonalInfo.middleName || "", // Handle optional field
        lastName: responseData.studentPersonalInfo.lastName,
        gender: responseData.studentPersonalInfo.gender,
        dob: formatDate(responseData.studentPersonalInfo.dob),
        mobile: responseData.studentPersonalInfo.mobile,
        email: responseData.studentPersonalInfo.email,
        address1: responseData.address.address1,
        address2: responseData.address.address2 || "", // Handle optional field
        city: responseData.address.city,
        state: responseData.address.state,
        country: responseData.address.country,
        pincode: responseData.address.pincode,
        primaryContact: responseData.contacts.primary.relation,
        primaryName: responseData.contacts.primary.name,
        primaryPhone: responseData.contacts.primary.phone,
        primaryEmail: responseData.contacts.primary.email,
        secondaryContact: responseData.contacts.secondary.relation || "", // Handle optional field
        secondaryName: responseData.contacts.secondary.name || "", // Handle optional field
        secondaryPhone: responseData.contacts.secondary.phone || "", // Handle optional field
        secondaryEmail: responseData.contacts.secondary.email || "", // Handle optional field
        vocation: responseData.vocation,
        class: responseData.class || "", // Handle optional field
        enterclassorprofession: responseData.enterclassorprofession || "",
        institution: responseData.institution || "", // Handle optional field
        photo: responseData.photo || "", // Handle optional field
        EnterInstitution: responseData.EnterInstitution || "",
        password: responseData.accountInfo.password,
      });
      setIsEditing(true);
    }
  };
  const handleDeleteFunctionality = () => {
    setIsEditing(false);

    if (responseData && responseData.studentPersonalInfo) {
      setinputStates({
        _id: responseData._id,
        firstName: responseData.studentPersonalInfo.firstName,
        middleName: responseData.studentPersonalInfo.middleName || "", // Handle optional field
        lastName: responseData.studentPersonalInfo.lastName,
        gender: responseData.studentPersonalInfo.gender,
        dob: formatDate(responseData.studentPersonalInfo.dob),
        mobile: responseData.studentPersonalInfo.mobile,
        email: responseData.studentPersonalInfo.email,
        address1: responseData.address.address1,
        address2: responseData.address.address2 || "", // Handle optional field
        city: responseData.address.city,
        state: responseData.address.state,
        country: responseData.address.country,
        pincode: responseData.address.pincode,
        primaryContact: responseData.contacts.primary.relation,
        primaryName: responseData.contacts.primary.name,
        primaryPhone: responseData.contacts.primary.phone,
        primaryEmail: responseData.contacts.primary.email,
        secondaryContact: responseData.contacts.secondary.relation || "", // Handle optional field
        secondaryName: responseData.contacts.secondary.name || "", // Handle optional field
        secondaryPhone: responseData.contacts.secondary.phone || "", // Handle optional field
        secondaryEmail: responseData.contacts.secondary.email || "", // Handle optional field
        vocation: responseData.vocation,
        class: responseData.class || "", // Handle optional field
        enterclassorprofession: responseData.enterclassorprofession || "",
        institution: responseData.institution || "", // Handle optional field
        photo: responseData.photo || "", // Handle optional field
        EnterInstitution: responseData.EnterInstitution || "",
        password: responseData.accountInfo.password,
      });
      setisDeleting(true);
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    setloadingData(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      if (responseData && responseData._id) {
        const deleteResponse = await axios.delete(
          `/api/users/delete?id=${responseData._id}`
        );
        if (deleteResponse.status === 200) {
          toast({
            title: "User deleted successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });

          setinputStates({
            firstName: "",
            middleName: "",
            lastName: "",
            gender: "",
            dob: "",
            mobile: "",
            email: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            primaryContact: "",
            primaryName: "",
            primaryPhone: "",
            primaryEmail: "",
            secondaryContact: "",
            secondaryName: "",
            secondaryPhone: "",
            secondaryEmail: "",
            vocation: "",
            class: "",
            enterclassorprofession: "",
            institution: "",
            photo: "",
            EnterInstitution: "",
            password: "",
            Cpassword: "",
          });
          setresponseData(null);
          setisDeleting(false);
        }
      }
    } catch (error) {
      toast({
        title: "Error while deleting user",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (user) {
      setinputStates({
        _id: user._id,
        firstName: user.studentPersonalInfo.firstName,
        middleName: user.studentPersonalInfo.middleName || "", // Handle optional field
        lastName: user.studentPersonalInfo.lastName,
        gender: user.studentPersonalInfo.gender,
        dob: formatDate(user.studentPersonalInfo.dob),
        mobile: user.studentPersonalInfo.mobile,
        email: user.studentPersonalInfo.email,
        address1: user.address.address1,
        address2: user.address.address2 || "", // Handle optional field
        city: user.address.city,
        state: user.address.state,
        country: user.address.country,
        pincode: user.address.pincode,
        primaryContact: user.contacts.primary.relation,
        primaryName: user.contacts.primary.name,
        primaryPhone: user.contacts.primary.phone,
        primaryEmail: user.contacts.primary.email,
        secondaryContact: user.contacts.secondary.relation || "", // Handle optional field
        secondaryName: user.contacts.secondary.name || "", // Handle optional field
        secondaryPhone: user.contacts.secondary.phone || "", // Handle optional field
        secondaryEmail: user.contacts.secondary.email || "", // Handle optional field
        vocation: user.vocation,
        class: user.class || "", // Handle optional field
        enterclassorprofession: user.enterclassorprofession || "",
        institution: user.institution || "", // Handle optional field
        photo: user.photo || "", // Handle optional field
        EnterInstitution: user.EnterInstitution || "",
        password: user.accountInfo.password,
      });
      setIsEditing(true);
    }
  }, [user]);

  return (
    <div className="main-div">
      {/* <div className="header-div">{user ? <Header user={user} /> : null}</div> */}

      <div className="container">
        <div className="nav-main">
          {/* <h1>{user ? "Edit Customer Details" : "Join Us Today"}</h1> */}
          {/* {!user && (
            <Stack direction="row" spacing={4} align="center">
              <Button
                colorScheme="green"
                variant="ghost"
                fontWeight="bold"
                fontSize="18px"
                _hover={{ bg: "#AAB396", color: "black.800" }}
                onClick={handleEditFunctionality}
              >
                Edit
              </Button>
              <Button
                colorScheme="red"
                variant="ghost"
                fontWeight="bold"
                fontSize="18px"
                _hover={{ bg: "#AAB396", color: "black.800" }}
                onClick={handleDeleteFunctionality}
              >
                Remove
              </Button>
            </Stack>
          )} */}
        </div>
        <form
          onSubmit={isDeleting ? handleDelete : handleSubmit}
          autoComplete="off"
          noValidate
        >
          <section class="section-wrap">
            <div class="row">
              <div class="col-xl-5 col-lg-5 ">
                <div class="card card-transparent b-0 title-card">
                  <div class="card-body">
                    <h1 class="m-b-20">
                      Hello and welcome to Crossroads Music!
                    </h1>
                    <p class="d-none d-sm-block">
                      We're excited to have you here. Please fill out the form
                      to get started. Once you submit your information, our team
                      will get back to you as soon as possible. Go ahead!
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-xl-7 col-lg-7 student-data-wrap">
                <div class="card">
                  <div class="card-body">
                    <h2 class="mw-80 m-b-20 d-none d-sm-block ">
                      Get started with your account.
                    </h2>
                    <p class="fs-16 mw-80 m-b-40">
                      Please fill out your information carefully. To make things
                      easier, we've grouped the form under various headings. If
                      you miss any mandatory information, you will be notified
                      before submission.
                    </p>

                    {/* Student Personal Info */}

                    <section>
                      <div class="info-title">Student Personal Info</div>

                      <div class="row">
                        <div class="col-md-4">
                          <div className="form-group">
                            {user ? (
                              <label for="firstName">First Name</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              className="form-control"
                              value={inputStates.firstName}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  firstNameerror: true,
                                })
                              }
                              focus={inputsFocusmissing.firstNameerror.toString()}
                              placeholder="First Name"
                              required
                            />
                            <span>First name is required</span>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="middleName">Middle Name</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="text"
                              id="middleName"
                              name="middleName"
                              className="form-control"
                              value={inputStates.middleName}
                              onChange={inputsTrigger}
                              placeholder="Middle Name"
                            />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="lastName">Last Name</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              className="form-control"
                              value={inputStates.lastName}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  lastNameerror: true,
                                })
                              }
                              focus={inputsFocusmissing.lastNameerror.toString()}
                              placeholder="Last Name"
                              required
                            />
                            <span>Last name is required</span>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? <label htmlFor="gender">Gender</label> : ""}
                            <select
                              id="gender"
                              name="gender"
                              className="form-control"
                              value={inputStates.gender}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  gendererror: true,
                                })
                              }
                              focus={inputsFocusmissing.gendererror.toString()}
                              required
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                            <span>Please select any gender</span>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="dob">Date of Birth</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="date"
                              id="dob"
                              name="dob"
                              className="form-control"
                              value={inputStates.dob}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  doberror: true,
                                })
                              }
                              focus={inputsFocusmissing.doberror.toString()}
                              required
                            />
                            <span>DOB is required</span>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="mobile">Student Mobile</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="text"
                              id="mobile"
                              name="mobile"
                              className="form-control"
                              value={inputStates.mobile}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  mobileerror: true,
                                })
                              }
                              onFocus={() =>
                                setinputStates({
                                  ...inputStates,
                                  mobile: "+91",
                                })
                              }
                              onKeyDown={(e) => {
                                if (
                                  inputStates.mobile === "+91" &&
                                  (e.key === "Backspace" || e.key === "Delete")
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              focus={inputsFocusmissing.mobileerror.toString()}
                              placeholder="Student Mobile"
                              maxLength="13"
                              pattern="\+91[0-9]{10}"
                              required
                            />
                            <span>mobile number needs to be proper</span>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="email">Student Email</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="form-control"
                              value={inputStates.email}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  emailerror: true,
                                })
                              }
                              focus={inputsFocusmissing.emailerror.toString()}
                              placeholder="Student Email"
                              required
                            />
                            <span>Email must be valid</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* //address details */}

                    <section>
                      <div class="info-title">Address Details</div>

                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="address1">Address Line 1</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="text"
                              id="address1"
                              name="address1"
                              className="form-control"
                              value={inputStates.address1}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  address1error: true,
                                })
                              }
                              focus={inputsFocusmissing.address1error.toString()}
                              placeholder="Address Line 1"
                              required
                            />
                            <span>Enter your address</span>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="address2">Address Line 2</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="text"
                              id="address2"
                              name="address2"
                              className="form-control"
                              value={inputStates.address2}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  address2error: true,
                                })
                              }
                              focus={inputsFocusmissing.address2error.toString()}
                              placeholder="Address Line 2"
                              // required
                            />
                            <span>Enter your address</span>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="city">Town / City</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="text"
                              id="city"
                              name="city"
                              className="form-control"
                              value={inputStates.city}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  cityerror: true,
                                })
                              }
                              focus={inputsFocusmissing.cityerror.toString()}
                              placeholder="Town / City"
                              required
                            />
                            <span>Name your town/city</span>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? <label htmlFor="state">State</label> : ""}
                            <select
                              id="state"
                              name="state"
                              className="form-control"
                              value={inputStates.state}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  stateerror: true,
                                })
                              }
                              focus={inputsFocusmissing.stateerror.toString()}
                              required
                            >
                              <option value="">Select State</option>
                              <option value="Andhra Pradesh">
                                Andhra Pradesh
                              </option>
                              <option value="Arunachal Pradesh">
                                Arunachal Pradesh
                              </option>
                              <option value="Assam">Assam</option>
                              <option value="Bihar">Bihar</option>
                              <option value="Chhattisgarh">Chhattisgarh</option>
                              <option value="Goa">Goa</option>
                              <option value="Gujarat">Gujarat</option>
                              <option value="Haryana">Haryana</option>
                              <option value="Himachal Pradesh">
                                Himachal Pradesh
                              </option>
                              <option value="Jharkhand">Jharkhand</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Kerala">Kerala</option>
                              <option value="Madhya Pradesh<">
                                Madhya Pradesh
                              </option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Manipur">Manipur</option>
                              <option value="Meghalaya">Meghalaya</option>
                              <option value="Mizoram">Mizoram</option>
                              <option value="Nagaland">Nagaland</option>
                              <option value="Odisha">Odisha</option>
                              <option value="Punjab">Punjab</option>
                              <option value="Rajasthan">Rajasthan</option>
                              <option value="Sikkim">Sikkim</option>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Tripura">Tripura</option>
                              <option value="Uttar Pradesh">
                                Uttar Pradesh
                              </option>
                              <option value="Uttarakhand">Uttarakhand</option>
                              <option value="West Bengal">West Bengal</option>

                              {/* Add more states */}
                            </select>
                            <span>Pick your state</span>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="country">Country</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="text"
                              id="country"
                              name="country"
                              className="form-control"
                              value={inputStates.country}
                              onChange={inputsTrigger}
                              disabled
                            />
                            <span>Choose country</span>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="pincode">Pincode</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="text"
                              id="pincode"
                              name="pincode"
                              className="form-control"
                              value={inputStates.pincode}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  pincodeerror: true,
                                })
                              }
                              focus={inputsFocusmissing.pincodeerror.toString()}
                              placeholder="Pincode"
                              maxLength="6"
                              pattern="[0-9]{6}"
                              required
                            />
                            <span>Enter your pincode correctly</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Parent/Guardian Details */}

                    <section>
                      <div class="info-title">Parent/Guardian Details</div>

                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="primaryContact">
                                Primary Contact
                              </label>
                            ) : (
                              ""
                            )}

                            <select
                              id="primaryContact"
                              name="primaryContact"
                              className="form-control"
                              value={inputStates.primaryContact}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  primaryContacterror: true,
                                })
                              }
                              focus={inputsFocusmissing.primaryContacterror.toString()}
                              required
                            >
                              <option value="">Choose Primary Contact</option>
                              <option value="father">Father</option>
                              <option value="mother">Mother</option>
                              <option value="guardian">Guardian</option>
                            </select>
                            <span>Choose your primary contact</span>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="primaryName">
                                Primary Person Name
                              </label>
                            ) : (
                              ""
                            )}

                            <input
                              type="text"
                              id="primaryName"
                              name="primaryName"
                              className="form-control"
                              value={inputStates.primaryName}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  primaryNameerror: true,
                                })
                              }
                              focus={inputsFocusmissing.primaryNameerror.toString()}
                              placeholder="Primary Person Name"
                              required
                            />
                            <span>Enter your primary person contact name</span>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="primaryPhone">
                                Primary Person Phone
                              </label>
                            ) : (
                              ""
                            )}

                            <input
                              type="text"
                              id="primaryPhone"
                              name="primaryPhone"
                              className="form-control"
                              value={inputStates.primaryPhone}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  primaryPhoneerror: true,
                                })
                              }
                              onFocus={() =>
                                setinputStates({
                                  ...inputStates,
                                  primaryPhone: "+91",
                                })
                              }
                              onKeyDown={(e) => {
                                if (
                                  inputStates.primaryPhone === "+91" &&
                                  (e.key === "Backspace" || e.key === "Delete")
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              focus={inputsFocusmissing.primaryPhoneerror.toString()}
                              placeholder="Primary Person Phone"
                              maxLength="13"
                              pattern="\+91[0-9]{10}"
                              required
                            />
                            <span>Enter your primary person contact no</span>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="primaryEmail">
                                Primary Person Email
                              </label>
                            ) : (
                              ""
                            )}

                            <input
                              type="email"
                              id="primaryEmail"
                              name="primaryEmail"
                              className="form-control"
                              value={inputStates.primaryEmail}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  primaryEmailerror: true,
                                })
                              }
                              focus={inputsFocusmissing.primaryEmailerror.toString()}
                              placeholder="Primary Person Email"
                              required
                            />
                            <span>Enter your primary person valid email</span>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="secondaryContact">
                                Secondary Contact
                              </label>
                            ) : (
                              ""
                            )}

                            <select
                              id="secondaryContact"
                              name="secondaryContact"
                              className="form-control"
                              value={inputStates.secondaryContact}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  secondaryContacterror: true,
                                })
                              }
                              focus={inputsFocusmissing.secondaryContacterror.toString()}
                            >
                              <option value="">Choose Secondary Contact</option>
                              <option value="father">Father</option>
                              <option value="mother">Mother</option>
                              <option value="guardian">Guardian</option>
                            </select>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="secondaryName">
                                Secondary Person Name
                              </label>
                            ) : (
                              ""
                            )}

                            <input
                              type="text"
                              id="secondaryName"
                              name="secondaryName"
                              className="form-control"
                              value={inputStates.secondaryName}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  secondaryNameerror: true,
                                })
                              }
                              focus={inputsFocusmissing.secondaryNameerror.toString()}
                              placeholder="Secondary Person Name"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="secondaryPhone">
                                Secondary Person Phone
                              </label>
                            ) : (
                              ""
                            )}

                            <input
                              type="text"
                              id="secondaryPhone"
                              name="secondaryPhone"
                              className="form-control"
                              value={inputStates.secondaryPhone}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  secondaryPhoneerror: true,
                                })
                              }
                              onFocus={() =>
                                setinputStates({
                                  ...inputStates,
                                  secondaryPhone: "+91",
                                })
                              }
                              onKeyDown={(e) => {
                                if (
                                  inputStates.secondaryPhone === "+91" &&
                                  (e.key === "Backspace" || e.key === "Delete")
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              focus={inputsFocusmissing.secondaryPhoneerror.toString()}
                              placeholder="Secondary Person Phone"
                              maxLength="13"
                              pattern="\+91[0-9]{10}"
                            />
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="secondaryEmail">
                                Secondary Person Email
                              </label>
                            ) : (
                              ""
                            )}

                            <input
                              type="email"
                              id="secondaryEmail"
                              name="secondaryEmail"
                              className="form-control"
                              value={inputStates.secondaryEmail}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  secondaryEmailerror: true,
                                })
                              }
                              focus={inputsFocusmissing.secondaryEmailerror.toString()}
                              placeholder="Secondary Person Email"
                            />
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Other Details */}

                    <section>
                      <div class="info-title">Other Details</div>

                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="vocation">Vocation</label>
                            ) : (
                              ""
                            )}
                            <select
                              id="vocation"
                              name="vocation"
                              className="form-control"
                              value={inputStates.vocation}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  vocationerror: true,
                                })
                              }
                              focus={inputsFocusmissing.vocationerror.toString()}
                              required
                            >
                              <option value="">Choose Occupation</option>
                              <option value="student">Student</option>
                              <option value="employed">Employed</option>
                              <option value="homemaker">Home maker</option>
                              {/* <option value="other">Other</option> */}
                            </select>
                            <span>Select Occupation</span>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="class">Class/Profession</label>
                            ) : (
                              ""
                            )}
                            <select
                              id="class"
                              name="class"
                              className="form-control"
                              value={inputStates.class}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  classerror: true,
                                })
                              }
                              focus={inputsFocusmissing.classerror.toString()}
                              required
                              disabled={inputStates.vocation === "homemaker"}
                            >
                              <option value="">Select Class/Profession</option>
                              {inputStates.vocation === "student" && (
                                <>
                                  <option value="Kindergarden">
                                    Kindergarden
                                  </option>
                                  <option value="LKG">LKG</option>
                                  <option value="UKG">UKG</option>
                                  <option value="1st standard">
                                    1st Standard
                                  </option>
                                  <option value="2nd Standard">
                                    2nd Standard
                                  </option>
                                  <option value="3rd Standard">
                                    3rd Standard
                                  </option>
                                  <option value="4th Standard">
                                    4th Standard
                                  </option>
                                  <option value="5th Standard">
                                    5th standard
                                  </option>
                                  <option value="6th Standard">
                                    6th Standard
                                  </option>
                                  <option value="7th Standard">
                                    7th Standard
                                  </option>
                                  <option value="8th Standard">
                                    8th Standard
                                  </option>
                                  <option value="9th Standard">
                                    9th Standard
                                  </option>
                                  <option value="10th Standard">
                                    10th Standard
                                  </option>
                                  <option value="11th Standard">
                                    11th Standard
                                  </option>
                                  <option value="12th Standard">
                                    12th Standard
                                  </option>
                                  <option value="Graduation">Graduation</option>
                                  <option value="Post Graduation">
                                    Post Graduation
                                  </option>
                                  <option value="Other">Other</option>
                                </>
                              )}
                              {inputStates.vocation === "employed" && (
                                <>
                                  <option value="IT">IT</option>
                                  <option value="Commerce">Commerce</option>
                                  <option value="Business">Business</option>
                                  <option value="Engineering">
                                    Engineering
                                  </option>
                                  <option value="Healthcare">Healthcare</option>
                                  <option value="Finance">Finance</option>
                                  <option value="Other">Other</option>
                                </>
                              )}
                            </select>
                            <span>Pick class/profession</span>
                          </div>
                        </div>
                      </div>

                      {inputStates.class === "Other" && (
                        <>
                          <div class="row">
                            <div class="col-md-6">
                              <div className="form-group">
                                {user ? (
                                  <label htmlFor="enterclassorprofession">
                                    Class/Profession name
                                  </label>
                                ) : (
                                  ""
                                )}
                                <input
                                  type="text"
                                  name="enterclassorprofession"
                                  id="enterclassorprofession"
                                  className="form-control"
                                  value={inputStates.enterclassorprofession}
                                  onChange={inputsTrigger}
                                  onBlur={() =>
                                    setinputsFocusmissing({
                                      ...inputsFocusmissing,
                                      enterclassorprofessionerror: true,
                                    })
                                  }
                                  focus={inputsFocusmissing.enterclassorprofessionerror.toString()}
                                  placeholder="Enter the Class/Profession name"
                                  required
                                />
                                <span>
                                  Class or Profession name is required
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div class="row">
                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="institution">
                                Institution of Study
                              </label>
                            ) : (
                              ""
                            )}

                            <select
                              id="institution"
                              name="institution"
                              className="form-control"
                              value={inputStates.institution}
                              onChange={inputsTrigger}
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  institutionerror: true,
                                })
                              }
                              focus={inputsFocusmissing.institutionerror.toString()}
                              required
                              disabled={inputStates.vocation === "homemaker"}
                            >
                              <option value="">Select Institution</option>
                              {inputStates.vocation === "student" && (
                                <>
                                  <option value="GreenwoodInternationalSchool">
                                    Greenwood International School
                                  </option>
                                  <option value="HilltopPublicSchool">
                                    Hilltop Public School
                                  </option>
                                  <option value="MaplewoodPrimarySchool">
                                    Maplewood Primary School
                                  </option>
                                  <option value="SilverOakHighSchool">
                                    Silver Oak High School
                                  </option>
                                  <option value="SunriseEnglishMediumSchool">
                                    Sunrise English Medium School
                                  </option>
                                  <option value="Other">Other</option>
                                </>
                              )}
                              {inputStates.vocation === "employed" && (
                                <>
                                  <option value="InnovativeDesignInstitute">
                                    Innovative Design Institute
                                  </option>
                                  <option value="CreativeArtsAcademy">
                                    Creative Arts Academy
                                  </option>
                                  <option value="ModernMediaCollege">
                                    Modern Media College
                                  </option>
                                  <option value="SkillBuildersAcademy">
                                    Skill Builders Academy
                                  </option>
                                  <option value="InstituteofDigitalInnovation">
                                    Institute of Digital Innovation
                                  </option>
                                  <option value="Other">Other</option>
                                </>
                              )}
                            </select>
                            <span>Pick your Institution</span>
                          </div>
                        </div>

                        <div class="col-md-6">
                          <div className="form-group">
                            {user ? (
                              <label htmlFor="photo">Photo of Student</label>
                            ) : (
                              ""
                            )}
                            <input
                              type="file"
                              name="photo"
                              className="form-control"
                              id="photo"
                              // accept="image/*"
                              accept="image/jpeg, image/png, image/svg+xml"
                              onChange={(e) =>
                                postPictureDetails(
                                  e.target.files[0],
                                  e.target.name
                                )
                              }
                              onBlur={() =>
                                setinputsFocusmissing({
                                  ...inputsFocusmissing,
                                  photoerror: true,
                                })
                              }
                              focus={inputsFocusmissing.photoerror.toString()}
                              required={!inputStates.photo}
                            />
                            {inputStates.photo && (
                              <div className="mt-3">
                                <img
                                  src={inputStates.photo}
                                  alt="Current Student Photo"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                  }}
                                />
                              </div>
                            )}

                            <span className="d-always">
                              {" "}
                              Please upload an image in JPG, PNG, or SVG format.
                              Maximum size: 2MB.
                            </span>
                            {photoError && <span>{photoError}</span>}
                          </div>
                        </div>
                      </div>

                      {inputStates.institution === "Other" && (
                        <>
                          <div class="row">
                            <div class="col-md-6">
                              <div className="form-group">
                                {user ? (
                                  <label htmlFor="EnterInstitution">
                                    Institution Name
                                  </label>
                                ) : (
                                  ""
                                )}
                                <input
                                  type="text"
                                  id="EnterInstitution"
                                  name="EnterInstitution"
                                  className="form-control"
                                  value={inputStates.EnterInstitution}
                                  onChange={inputsTrigger}
                                  onBlur={() =>
                                    setinputsFocusmissing({
                                      ...inputsFocusmissing,
                                      EnterInstitutionerror: true,
                                    })
                                  }
                                  focus={inputsFocusmissing.EnterInstitutionerror.toString()}
                                  placeholder="Enter Your Institution name"
                                  required
                                />
                                <span>Institution name is required</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </section>

                    {/* Account Information */}

                    {!user && (
                      <section>
                        <div class="info-title">Account Password</div>

                        <div class="row">
                          <div class="col-md-6">
                            <div className="form-group">
                              {user ? (
                                <label htmlFor="password">Password</label>
                              ) : (
                                ""
                              )}
                              <input
                                type="text"
                                id="password"
                                name="password"
                                className="form-control"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                value={inputStates.password}
                                onChange={inputsTrigger}
                                onBlur={() =>
                                  setinputsFocusmissing({
                                    ...inputsFocusmissing,
                                    passworderror: true,
                                  })
                                }
                                focus={inputsFocusmissing.passworderror.toString()}
                                placeholder=" Enter your Password"
                              />
                              <span>
                                Password should contain minimum 8
                                characters,atleast 1 uppercase,lowercase and
                                digit
                              </span>
                            </div>
                          </div>

                          <div class="col-md-6">
                            <div className="form-group">
                              {user ? (
                                <label htmlFor="password">
                                  Confirm Password
                                </label>
                              ) : (
                                ""
                              )}
                              <input
                                type="text"
                                id="Cpassword"
                                name="Cpassword"
                                className="form-control"
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                value={inputStates.Cpassword}
                                onChange={inputsTrigger}
                                onBlur={() =>
                                  setinputsFocusmissing({
                                    ...inputsFocusmissing,
                                    Cpassworderror: true,
                                  })
                                }
                                focus={inputsFocusmissing.Cpassworderror.toString()}
                                placeholder=" Confirm your Password"
                              />
                              {!passwordMatch &&
                                inputsFocusmissing.Cpassworderror && (
                                  <span style={{ color: "red" }}>
                                    Passwords do not match
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                    <div class="clearfix"></div>
                    <div class="row m-t-25">
                      <div class="col-xl-6 p-b-10">
                        <p class="small-text hint-text">
                          {user ? (
                            <>
                              By clicking the 'Update' button, you are
                              confirming the changes to your account and
                              agreeing to Pages' updated{" "}
                              <a href="javascript:void(0);">Terms of Use</a> and{" "}
                              <a href="javascript:void(0);">Privacy Policy</a>.{" "}
                            </>
                          ) : (
                            <>
                              By clicking the "Submit" button, you are creating
                              an account, and you agree to Pages's{" "}
                              <a href="javascript:void(0);">Terms of Use</a> and{" "}
                              <a href="javascript:void(0);">Privacy Policy</a>.{" "}
                            </>
                          )}
                        </p>
                      </div>
                      <div class="col-xl-6">
                        <button
                          aria-label=""
                          class="btn btn-primary pull-right btn-lg btn-block"
                          type="submit"
                          fdprocessedid="15tyk9d"
                        >
                          {isDeleting
                            ? "Delete"
                            : isEditing || user
                            ? "Update"
                            : "Submit"}
                        </button>
                        {!user && (
                          <div class="text-center mt-3">
                            <p class="mb-0">
                              Already have an account?
                              <Link
                                to="/"
                                class="text-primary font-weight-bold"
                              >
                                Log in
                              </Link>
                            </p>
                          </div>
                        )}
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
  );
};

export default MainFormUI;
