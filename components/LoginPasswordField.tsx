"use client";

import {useState} from "react";
import {Eye,EyeOff,LockKeyhole} from "lucide-react";

export default function LoginPasswordField(){
  const [show,setShow]=useState(false);
  return <div className="approvedLoginField">
    <LockKeyhole aria-hidden="true"/>
    <input name="password" type={show?"text":"password"} required placeholder="Senha" autoComplete="current-password"/>
    <button type="button" className="loginEye" onClick={()=>setShow(v=>!v)} aria-label={show?"Ocultar senha":"Mostrar senha"}>
      {show?<EyeOff/>:<Eye/>}
    </button>
  </div>;
}
