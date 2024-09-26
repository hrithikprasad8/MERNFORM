import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import MainFormUI from "./MainFormUI";

const DashBoard = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    onOpen();
  }, [onOpen]);
  return (
    <div>
      <h3 style={{ color: "#ECDFCC", fontSize: "20px", fontWeight: "bold" }}>
        Dashboard
      </h3>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent maxW="80%" top="10%" bottom="10%" bg="#3C3D37">
          <ModalHeader color="#ECDFCC" fontSize="x-large" fontStyle="italic">
            Manage Customer Data
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MainFormUI user={user} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DashBoard;
