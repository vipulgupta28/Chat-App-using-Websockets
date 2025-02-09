import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {

  const[messages, setMessages] = useState(["hi there ", "hello"]);
  const wsRef = useRef();
  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) =>{
      setMessages(m=>[...m, event.data])
    }

    wsRef.current=ws;

    ws.onopen=()=>{
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId:"red"
        }
      }))
    }
    return()=>{
      ws.close()
    }
  }, []);
  return (
    <div className='h-screen bg-black'>
      <div className='h-[95vh]'></div>
      {messages.map(message=><div className="bg-white text-black rounded p-4 m-8">{message}</div>)}
      <div className='w-full bg-white flex p-4'>
        <input className="flex-1 p-4" id="message" ></input>
        <button className="bg-purple-600 text-white" onClick={()=>{
          const message = document.getElementById("message")?.value;
          wsRef.current.send(JSON.stringify({
            type:"chat",
            payload:{
              message:message
            }
          }))
        }}>
          Send Message
          </button>
      </div>
    
    </div>
  );
}

export default App;
