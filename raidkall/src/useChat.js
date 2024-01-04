import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import { socketIOClient, io } from "socket.io-client";

import { Button, IconButton, TextField } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PhoneIcon from "@mui/icons-material/Phone";


import "./useChat.css";

const socket = io.connect("http://localhost:4000");
const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = (roomId) => {
  // chat message variables
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  // video chat variables
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      myVideo.current.srcObject = stream;
    });

    socket.on('me', (id) => {
      setMe(id);
    });

    socket.on('callUser', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on("callAccepted", () => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  }

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signalData: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideo.current.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#fff" }}>Raidkall</h1>
      <div className="container">
        <div className="video-container">
          <div className="video">
            {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
          </div>
          <div className="video">
            {callAccepted && !callEnded ?
              <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> :
              null}
          </div>
        </div>
        <div className="myId">
          <Textfield
            id="filled-basic"
            label="Name"
            variant="filled"
            value={name}
            onchange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
            <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="Large" />}>
              Copy ID
            </Button>
          </CopyToClipboard>

          <Textfield
            id="filled-basic"
            label="ID to call"
            variant="filled"
            value={idToCall}
            onchange={(e) => setIdToCall(e.target.value)}
          />

          <div className="call-button">
            {callAcceptedCall && !callEnded ? (
              <Button variant="contained" color="secondary" onClick={leaveCall}>
                End Call
              </Button>
            ) : (
              <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                <PhoneIcon fontSize="large" />
              </IconButton>
            )}
            {idToCall}
          </div>
        </div>
        <div>
          {receivingCall && !callAcceptedCall ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );

  /*  useEffect(() => {
     socketRef.current = socketIOClient("newChatMessage", {
       query: { roomId },
     });
 
     socketRef.current.on("newChatMessage", (message) => {
       const incomingMessage = {
         ...message,
         ownedByCurrentUser: message.senderId === socketRef.current.id,
       };
       setMessages((messages) => [...messages, incomingMessage]);
     });
 
     return () => {
       socketRef.current.disconnect();
     };
   }, [roomId]);
 
   const sendMessage = (messageBody) => {
     socketRef.current.emit("newChatMessage", {
       body: messageBody,
       senderId: socketRef.current.id,
     });
   }; */

  //return { messages, sendMessage };
};

export default useChat;