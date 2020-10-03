import React, { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./Input.css";
import axios from "axios";
import { SERVER_ADDRESS } from "../../constants/config";
import Picker from "emoji-picker-react";
import ReactEmoji from "react-emoji";
const Input = ({ setMessage, sendMessage, message }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const handleClose = () => setModalVisible(false);
  const handleShow = () => setModalVisible(true);
  const [emojiPickerVisible, setEPVisible] = useState(false);
  const inputEL = useRef(null);
  const [file, setFile] = useState(null);
  const fileOnChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };
  const onUpload = async () => {
    try {
      var formdata = new FormData();
      formdata.append("file", file);

      var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
        mode: "cors",
      };
      let res = await fetch(`${SERVER_ADDRESS}/upload`, requestOptions);
      let resJSON = await res.json();
      setUploadedFile(resJSON.file);
      console.log(resJSON);
      handleClose();
      sendMessage(null, resJSON.file);
    } catch (error) {
      alert(error.message);
      return;
    }
  };
  return (
    <>
      <Modal show={modalVisible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ width: "100%" }}>
            <div style={{ width: "100%" }}>
              <div>
                <form className="file-form" method="post" action="#" id="#">
                  <div className="form-group files color">
                    <label>Upload Your File </label>
                    <input
                      onChange={fileOnChange}
                      type="file"
                      class="form-control"
                      multiple=""
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={onUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
      {emojiPickerVisible ? (
        <Picker
          onEmojiClick={(event, e) => {
            console.log(e);
            setMessage(message + e.emoji);
            inputEL.current.focus();
          }}
        />
      ) : null}
      <form className="form">
        <input
          ref={inputEL}
          className="input"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={({ target: { value } }) => {
            setMessage(value);
          }}
          onKeyPress={(event) =>
            event.key === "Enter" ? sendMessage(event) : null
          }
        />
        <button
          className="sendButton"
          style={{ width: "fit-content", background: "#e8e8e8" }}
          onClick={(e) => {
            e.preventDefault();
            setEPVisible(!emojiPickerVisible);
          }}
        >
          😃
        </button>
        <button
          className="sendButton cameraButton"
          onClick={(e) => sendMessage(e, uploadedFile)}
        >
          Send
        </button>
        <button
          className="sendButton cameraButton"
          onClick={(e) => {
            e.preventDefault();
            handleShow();
          }}
        >
          📷
        </button>
      </form>
    </>
  );
};

export default Input;
