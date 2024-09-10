import React, { useState } from "react";
import "../App.css";
import { Button, useToast, ButtonGroup, Stack } from "@chakra-ui/react";
import axios from "axios";

const MainFormUI = () => {
  //so here i am going to store each data from the fields to particular state in   objects format.
  const [inputStates, setinputStates] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
    mobile: "+91",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    primaryContact: "",
    primaryName: "",
    primaryPhone: "+91",
    primaryEmail: "",
    secondaryContact: "",
    secondaryName: "",
    secondaryPhone: "+91",
    secondaryEmail: "",
    vocation: "",
    class: "",
    institution: "",
    photo: null,
  });

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
    institutionerror: false,
    photoerror: false,
  });
  const [responseData, setresponseData] = useState({});
  // const [editResponseData, setEditResponseData] = useState({});

  const [loadingData, setloadingData] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isDeleting, setisDeleting] = useState(false);

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
    //here we are going to pass data through api request
    setloadingData(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      let editResponse;
      if (isEditing) {
        const response = await axios.put(
          `/api/users/update?id=${responseData._id}`,
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
            firstName: "",
            middleName: "",
            lastName: "",
            gender: "",
            dob: "",
            mobile: "+91",
            email: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            country: "India",
            pincode: "",
            primaryContact: "",
            primaryName: "",
            primaryPhone: "+91",
            primaryEmail: "",
            secondaryContact: "",
            secondaryName: "",
            secondaryPhone: "+91",
            secondaryEmail: "",
            vocation: "",
            class: "",
            institution: "",
            photo: null,
          });
          setIsEditing(false);
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
            title: "Everything went successfully",
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
            mobile: "+91",
            email: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            country: "India",
            pincode: "",
            primaryContact: "",
            primaryName: "",
            primaryPhone: "+91",
            primaryEmail: "",
            secondaryContact: "",
            secondaryName: "",
            secondaryPhone: "+91",
            secondaryEmail: "",
            vocation: "",
            class: "",
            institution: "",
            photo: null,
          });
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
      console.log(`Unable to pass data to frontend through api`, error.message);
      toast({
        title: "Something went wrong. Please try again later.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const inputsTrigger = (e) => {
    const { name, value, id, type, checked, files } = e.target;
    setinputStates({
      ...inputStates,
      [name]: type === "file" ? files[0] : value,
    }); //beacuse here we are only allowing a single image to upload
  };

  const postPictureDetails = (pics, name) => {
    if (pics === undefined) {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
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
    console.log("response seems like", responseData);
    if (responseData) {
      setinputStates({
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
        institution: responseData.institution || "", // Handle optional field
        photo: responseData.photo || "", // Handle optional field
      });
      setIsEditing(true);
    }
  };
  const handleDeleteFunctionality = () => {
    handleEditFunctionality();
    setIsEditing(false);
    setisDeleting(true);
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
            institution: "",
            photo: "",
          });
          setResponseData(null);
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

  return (
    <div className="form-container">
      <div className="nav-main">
        <h1>Join Us Today</h1>
        <Stack direction="row" spacing={4} align="center">
          <Button
            c
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
      </div>
      <form
        onSubmit={isDeleting ? handleDelete : handleSubmit}
        autoComplete="off"
      >
        {/* Student Personal Info */}
        <section>
          <h2>Student Personal Info</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
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
            <div className="form-group">
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={inputStates.middleName}
                onChange={inputsTrigger}
                placeholder="Middle Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
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
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
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
                <option value="other">Other</option>
              </select>
              <span>Please select any gender</span>
            </div>
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
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
            <div className="form-group">
              <label htmlFor="mobile">Student Mobile</label>
              <input
                type="text"
                id="mobile"
                name="mobile"
                value={inputStates.mobile}
                onChange={inputsTrigger}
                onBlur={() =>
                  setinputsFocusmissing({
                    ...inputsFocusmissing,
                    mobileerror: true,
                  })
                }
                focus={inputsFocusmissing.mobileerror.toString()}
                placeholder="Student Mobile"
                maxLength="13"
                pattern="\+91[0-9]{10}"
                required
              />
              <span>mobile number needs to be proper</span>
            </div>
            <div className="form-group">
              <label htmlFor="email">Student Email</label>
              <input
                type="email"
                id="email"
                name="email"
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
        </section>

        {/* Address Details */}
        <section>
          <h2>Address Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address1">Address Line 1</label>
              <input
                type="text"
                id="address1"
                name="address1"
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
            <div className="form-group">
              <label htmlFor="address2">Address Line 2</label>
              <input
                type="text"
                id="address2"
                name="address2"
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
                required
              />
              <span>Enter your address</span>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">Town / City</label>
              <input
                type="text"
                id="city"
                name="city"
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
            <div className="form-group">
              <label htmlFor="state">State</label>
              <select
                id="state"
                name="state"
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
                <option value="kerala">Kerala</option>
                <option value="karnataka">Karnataka</option>
                {/* Add more states */}
              </select>
              <span>Pick your state</span>
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={inputStates.country}
                onChange={inputsTrigger}
                disabled
              />
              <span>Choose country</span>
            </div>
            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
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
        </section>

        {/* Parent/Guardian Details */}
        <section>
          <h2>Parent/Guardian Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="primaryContact">Primary Contact</label>
              <select
                id="primaryContact"
                name="primaryContact"
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
                <option value="">Select Primary Contact</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="guardian">Guardian</option>
              </select>
              <span>Choose your primary contact</span>
            </div>
            <div className="form-group">
              <label htmlFor="primaryName">Primary Person Name</label>
              <input
                type="text"
                id="primaryName"
                name="primaryName"
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
            <div className="form-group">
              <label htmlFor="primaryPhone">Primary Person Phone</label>
              <input
                type="text"
                id="primaryPhone"
                name="primaryPhone"
                value={inputStates.primaryPhone}
                onChange={inputsTrigger}
                onBlur={() =>
                  setinputsFocusmissing({
                    ...inputsFocusmissing,
                    primaryPhoneerror: true,
                  })
                }
                focus={inputsFocusmissing.primaryPhoneerror.toString()}
                placeholder="Primary Person Phone"
                maxLength="13"
                pattern="\+91[0-9]{10}"
                required
              />
              <span>Enter your primary person contact no</span>
            </div>
            <div className="form-group">
              <label htmlFor="primaryEmail">Primary Person Email</label>
              <input
                type="email"
                id="primaryEmail"
                name="primaryEmail"
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="secondaryContact">Secondary Contact</label>
              <select
                id="secondaryContact"
                name="secondaryContact"
                value={inputStates.secondaryContact}
                onChange={inputsTrigger}
                onBlur={() =>
                  setinputsFocusmissing({
                    ...inputsFocusmissing,
                    secondaryContacterror: true,
                  })
                }
                focus={inputsFocusmissing.secondaryContacterror.toString()}
                required
              >
                <option value="">Select Secondary Contact</option>
                <option value="father">Father</option>
                <option value="mother">Mother</option>
                <option value="guardian">Guardian</option>
              </select>
              <span>Choose your secondary contact </span>
            </div>
            <div className="form-group">
              <label htmlFor="secondaryName">Secondary Person Name</label>
              <input
                type="text"
                id="secondaryName"
                name="secondaryName"
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
                required
              />
              <span>Enter your secondary person contact name</span>
            </div>
            <div className="form-group">
              <label htmlFor="secondaryPhone">Secondary Person Phone</label>
              <input
                type="text"
                id="secondaryPhone"
                name="secondaryPhone"
                value={inputStates.secondaryPhone}
                onChange={inputsTrigger}
                onBlur={() =>
                  setinputsFocusmissing({
                    ...inputsFocusmissing,
                    secondaryPhoneerror: true,
                  })
                }
                focus={inputsFocusmissing.secondaryPhoneerror.toString()}
                placeholder="Secondary Person Phone"
                maxLength="13"
                pattern="\+91[0-9]{10}"
                required
              />
              <span>Enter your secondary person contact no</span>
            </div>
            <div className="form-group">
              <label htmlFor="secondaryEmail">Secondary Person Email</label>
              <input
                type="email"
                id="secondaryEmail"
                name="secondaryEmail"
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
                required
              />
              <span>Enter your secondary person valid email</span>
            </div>
          </div>
        </section>

        {/* Other Details */}
        <section>
          <h2>Other Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vocation">Vocation</label>
              <select
                id="vocation"
                name="vocation"
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
                <option value="">Select Vocation</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="engineer">Engineer</option>
                <option value="other">Other</option>
              </select>
              <span>Choose Vocation</span>
            </div>
            <div className="form-group">
              <label htmlFor="class">Class/Profession</label>
              <select
                id="class"
                name="class"
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
              >
                <option value="">Select Class/Profession</option>
                <option value="science">Science</option>
                <option value="commerce">Commerce</option>
                <option value="arts">Arts</option>
                <option value="other">Other</option>
              </select>
              <span>Pick class/profession</span>
            </div>
            <div className="form-group">
              <label htmlFor="institution">Institution of Study</label>
              <select
                id="institution"
                name="institution"
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
              >
                <option value="">Select Institution</option>
                <option value="institution1">Institution 1</option>
                <option value="institution2">Institution 2</option>
                <option value="other">Other</option>
              </select>
              <span>Pick your Institution</span>
            </div>
            <div className="form-group">
              <label htmlFor="photo">Photo of Student</label>
              <input
                type="file"
                name="photo"
                id="photo"
                accept="image/*"
                // value={inputStates.photo}
                onChange={(e) =>
                  postPictureDetails(e.target.files[0], e.target.name)
                }
                onBlur={() =>
                  setinputsFocusmissing({
                    ...inputsFocusmissing,
                    photoerror: true,
                  })
                }
                focus={inputsFocusmissing.photoerror.toString()}
                required
              />
              <span>Upload a image</span>
            </div>
          </div>
        </section>

        <Button
          type="submit"
          className="button-main"
          _hover={{
            bg: "#557C56",
            color: "white",
            transform: "scale(1.05)",
          }}
        >
          {isDeleting ? "Delete" : isEditing ? "Update" : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default MainFormUI;
