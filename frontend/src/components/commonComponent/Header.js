import {
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@chakra-ui/icons";
const Header = ({ user }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const logOutFunctionality = async () => {
    try {
      await localStorage.removeItem("UserInfo");
      toast({
        title: "Logged out successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error logging out.",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  return (
    <Flex
      direction="row"
      align="center"
      justify="space-between"
      p={4}
      // bg="teal.600"
      bg="#557C56"
      color="white"
      boxShadow="md"
      mt={4}
    >
      <h4 style={{ margin: 0, fontStyle: "normal", fontSize: "18px" }}>
        Hello, Welcome {user.studentPersonalInfo.firstName}
      </h4>{" "}
      {/* Use Flex to align content */}
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={
            <ChevronDownIcon color="white" boxSize="1.2em" marginLeft="4px" />
          } // Customize icon color and size
          // bg="teal.600" // Background color of the button
          bg="#3C3D37"
          color="white" // Text color of the button
          _hover={{ bg: "#78A083" }} // Background color on hover
          _active={{ bg: "#78A083" }} // Background color when active
          borderRadius="md" // Rounded corners
          border="none" // No border
          fontWeight="bold" // Ensure text is bold
          padding="8px 16px"
          marginLeft="5px" // Add padding for better button size
        >
          Profile
        </MenuButton>
        <MenuList
          bg="white" // Background color of the menu
          color="black" // Text color of the menu
          // borderColor="teal.200" // Border color of the menu
          borderRadius="md" // Rounded corners
          boxShadow="md" // Shadow for depth
        >
          <MenuItem _hover={{ bg: "#78A083" }} onClick={logOutFunctionality}>
            Log out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default Header;
