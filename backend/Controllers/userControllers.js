const expressAsyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const bcrypt = require("bcrypt");

const registerData = expressAsyncHandler(async (req, res) => {
  console.log(`whole data seems like: `, req.body);
  //first of all we can destructure data
  const {
    firstName,
    lastName,
    email,
    mobile,
    dob,
    address1,
    city,
    state,
    country,
    pincode,
    primaryContact,
    primaryName,
    primaryPhone,
    primaryEmail,
    password,
    // Cpassword,
  } = req.body;

  //we need to check whether we receive all required fields data in backend
  if (
    !firstName ||
    !lastName ||
    !email ||
    !mobile ||
    !address1 ||
    !primaryName ||
    !primaryPhone ||
    !primaryEmail
  ) {
    return res
      .status(400)
      .json({ message: "Sorry,try to fill all required fields" });
  }

  //then we need to check whether this user is already exist in our database collection or not
  const userExist = await User.findOne({ "studentPersonalInfo.email": email });
  if (userExist) {
    return res.status(400).json({ message: "Sorry,same user already exists" });
  }

  //if it is new user we want to assign a studentId to them
  const branch = req.body.class;
  const Year = new Date().getFullYear();

  const count = await User.countDocuments({
    studentId: { $regex: `^St${Year}${branch}` },
  });

  const studentId = `St${Year}${branch}${count + 1}`;

  //if it is not we need to create a new user
  const newUser = new User({
    studentId,
    studentPersonalInfo: {
      firstName,
      middleName: req.body.middleName || "",
      lastName,
      gender: req.body.gender || "not specified",
      dob,
      mobile,
      email,
    },
    address: {
      address1,
      address2: req.body.address2 || "not specified",
      city,
      state,
      country,
      pincode,
    },
    contacts: {
      primary: {
        relation: primaryContact,
        name: primaryName,
        phone: primaryPhone,
        email: primaryEmail,
      },
      secondary: {
        relation: req.body.secondaryContact || "not specified",
        name: req.body.secondaryName || "not specified",
        phone: req.body.secondaryPhone || "not specified",
        email: req.body.secondaryEmail || "not specified",
      },
    },
    vocation: req.body.vocation || "not specified",
    class: req.body.class || "not specified",
    institution: req.body.institution || "not specified",
    photo: req.body.photo || "",
    accountInfo: {
      ...(password && { password }),
    },
  });

  //then we need to save to User collection
  const createdUser = await newUser.save();

  //so we are going to send all important data as a response to frontend
  res.status(201).json({
    _id: createdUser._id,
    studentId: createdUser.studentId,
    studentPersonalInfo: {
      firstName: createdUser.studentPersonalInfo.firstName,
      middleName: createdUser.studentPersonalInfo.middleName || "", // Handle optional field
      lastName: createdUser.studentPersonalInfo.lastName,
      gender: createdUser.studentPersonalInfo.gender,
      dob: createdUser.studentPersonalInfo.dob,
      mobile: createdUser.studentPersonalInfo.mobile,
      email: createdUser.studentPersonalInfo.email,
    },
    address: {
      address1: createdUser.address.address1,
      address2: createdUser.address.address2 || "", // Handle optional field
      city: createdUser.address.city,
      state: createdUser.address.state,
      country: createdUser.address.country,
      pincode: createdUser.address.pincode,
    },
    contacts: {
      primary: {
        relation: createdUser.contacts.primary.relation,
        name: createdUser.contacts.primary.name,
        phone: createdUser.contacts.primary.phone,
        email: createdUser.contacts.primary.email,
      },
      secondary: {
        relation: createdUser.contacts.secondary.relation || "", // Handle optional field
        name: createdUser.contacts.secondary.name || "", // Handle optional field
        phone: createdUser.contacts.secondary.phone || "", // Handle optional field
        email: createdUser.contacts.secondary.email || "", // Handle optional field
      },
    },
    vocation: createdUser.vocation,
    class: createdUser.class || "", // Handle optional field
    institution: createdUser.institution || "", // Handle optional field
    photo: createdUser.photo || "", // Handle optional field
    accountInfo: {
      password: createdUser.accountInfo.password,
    },
  });
});

const updateData = expressAsyncHandler(async (req, res) => {
  const userIdentifier = req.body._id;
  const updatedRes = req.body;
  console.log("reqbody from edited changes seems like", req.body);
  const updatedFields = {
    studentPersonalInfo: {
      firstName: updatedRes.firstName,
      middleName: updatedRes.middleName,
      lastName: updatedRes.lastName,
      gender: updatedRes.gender,
      dob: updatedRes.dob,
      mobile: updatedRes.mobile,
      email: updatedRes.email,
    },
    address: {
      address1: updatedRes.address1,
      address2: updatedRes.address2,
      city: updatedRes.city,
      state: updatedRes.state,
      country: updatedRes.country,
      pincode: updatedRes.pincode,
    },
    contacts: {
      primary: {
        relation: updatedRes.primaryContact,
        name: updatedRes.primaryName,
        phone: updatedRes.primaryPhone,
        email: updatedRes.primaryEmail,
      },
      secondary: {
        relation: updatedRes.secondaryContact,
        name: updatedRes.secondaryName,
        phone: updatedRes.secondaryPhone,
        email: updatedRes.secondaryEmail,
      },
    },
    vocation: updatedRes.vocation,
    class: updatedRes.class,
    institution: updatedRes.institution,
    photo: updatedRes.photo,
    accountInfo: {
      password: updatedRes.password,
    },
  };

  try {
    const updatedResult = await User.findByIdAndUpdate(
      userIdentifier,
      { $set: updatedFields },
      { new: true }
    );
    if (!updatedResult) {
      return res
        .status(404)
        .json({ message: "Sorry, User not found cant update" });
    }
    console.log("updated result seems like", updatedResult);

    res.status(200).json(updatedResult);
  } catch (error) {
    console.log("error updating user", error.message);
    res.status(500).json({ message: "error updaing user" });
  }
});

const deleteData = expressAsyncHandler(async (req, res) => {
  const userIdentifier = req.query.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userIdentifier);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "Sorry, User not found, can't delete" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});
const Uservalidation = expressAsyncHandler(async (req, res) => {
  const Idfromstudent = req.query.id;
  console.log("studentID seems like", Idfromstudent);
  const user = await User.findOne({ studentId: Idfromstudent });
  if (!user) {
    res
      .status(401)
      .json({ message: "Sorry,Invalid Student id", userExists: false });
  } else if (!user.accountInfo.password) {
    res.status(200).json({
      message: "User exists,Create and confirm password",
      userExists: true,
      hasPassword: false,
    });
  } else {
    res.status(200).json({
      message: "User exists,Enter your password",
      userExists: true,
      hasPassword: true,
    });
  }
});
const loginValidation = expressAsyncHandler(async (req, res) => {
  const idOfStudent = req.query.id;
  const stdPassword = req.body.Password;
  console.log("student password seems like", stdPassword);
  const student = await User.findOne({ studentId: idOfStudent });
  if (
    student &&
    (await bcrypt.compare(stdPassword, student.accountInfo.password))
  ) {
    res.status(200).json({
      success: true,
      message: "Congrats,Loged in successfully",
      studentDet: student,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Sorry,Invalid credentials login failed",
    });
  }
});
const PasswordStore = expressAsyncHandler(async (req, res) => {
  const studID = req.query.id;
  const { Password, Cpassword } = req.body;
  //we need to find that partciular student to update the Password
  try {
    const particularStd = await User.findOne({ studentId: studID });
    //if there is student we need to first assign the paswword to its field inside  database collection
    if (particularStd) {
      particularStd.accountInfo.password = Password;
      //then we need to save this document ,then only before saving password field in thedocument ,password can be hashed by using mongoosescheam pre middleware
      await particularStd.save();
      res.status(200).json({
        success: true,
        message: "Congrats, Password created and logged in succesfully",
        studentDet: particularStd,
      });
    } else {
      res.status(400).json({ success: false, message: "Student not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = {
  registerData,
  updateData,
  deleteData,
  Uservalidation,
  loginValidation,
  PasswordStore,
};
