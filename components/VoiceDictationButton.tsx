"use client";

import {Mic, Square} from "lucide-react";
import {useRef,useState} from "react";

type SpeechRecognitionLike = {
  lang:string;
  interimResults:boolean;
  continuous:boolean;
  start:()=>void;
  stop:()=>void;
  onresult:((event:any)=>void)|null;
  onerror:((event:any)=>void)|null;
  onend:(()=>void)|null;
};

export default function VoiceDictationButton({targetId}:{targetId:string}){
  const recognition=useRef<SpeechRecognitionLike|null>(null);
  const [listening,setListening]=useState(false);
  const [supported,setSupported]=useState(true);

  function stop(){
    recognition.current?.stop();
    setListening(false);
  }

  function start(){
    const w=window as any;
    const SpeechRecognition=w.SpeechRecognition||w.webkitSpeechRecognition;
    if(!SpeechRecognition){
      setSupported(false);
      return;
    }

    const target=document.getElementById(targetId) as HTMLTextAreaElement|null;
    if(!target) return;

    const instance:SpeechRecognitionLike=new SpeechRecognition();
    instance.lang="pt-BR";
    instance.interimResults=true;
    instance.continuous=true;

    const initial=target.value.trim();
    instance.onresult=(event:any)=>{
      let transcript="";
      for(let i=event.resultIndex;i<event.results.length;i++){
        transcript+=event.results[i][0].transcript;
      }
      target.value=[initial,transcript.trim()].filter(Boolean).join(initial?" ":"");
      target.dispatchEvent(new Event("input",{bubbles:true}));
    };
    instance.onerror=()=>setListening(false);
    instance.onend=()=>setListening(false);
    recognition.current=instance;
    instance.start();
    setListening(true);
  }

  if(!supported) return <span className="voiceUnavailable">Ditado não disponível neste navegador.</span>;

  return <button type="button" onClick={listening?stop:start} className={listening?"voiceButton listening":"voiceButton"} aria-label={listening?"Parar ditado":"Iniciar ditado"}>
    {listening?<Square/>:<Mic/>}<span>{listening?"Ouvindo…":"Ditar observação"}</span>
  </button>;
}
