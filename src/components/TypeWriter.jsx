"use client"
import { useRef,useEffect,useState} from "react"
const sentences = [
    "Build , Film & compete",
    "Make your Brilliant Move",
    "Turn your ambition into reality",
];
const ts = 90;
const es = 90;
const pat = 3000;
const pae = 400;
export default function TypeWriter()
{
    const [displayed,setDisplayed] = useState("");
    const [phase,setPhase] = useState("typing");
    const sentenceIndex = useRef(0);
    const charIndex = useRef(0);
    useEffect(()=>{
        let timeout;
        const tick = () => {
            const current = sentences[sentenceIndex.current];
            if(phase==="typing")
            {
                if(charIndex.current < current.length)
                {
                    charIndex.current++;
                    setDisplayed(current.slice(0,charIndex.current));
                    timeout = setTimeout(tick,ts);
                }
                else
                {
                    setPhase("pausing");
                }
            }
            else if (phase === "pausing")
            {
                timeout = setTimeout(()=>setPhase("erasing"),pat);
            }
            else if (phase === "erasing")
            {
                if(charIndex.current > 0)
                {
                    charIndex.current--;
                    setDisplayed(current.slice(0,charIndex.current));
                    timeout = setTimeout(tick,es);
                } else {
                    setPhase("waiting");
                }
            }
            else if (phase === "waiting")
            {
                sentenceIndex.current = (sentenceIndex.current + 1) % sentences.length;
                timeout = setTimeout(()=>setPhase("typing"),pae);
            }
        };
        timeout =  setTimeout(tick,0);
        return () => clearTimeout(timeout);
    },[phase]);
    return (
        <span className="inline-flex items-baseline gap-0.5 font-header uppercase text-white font-black text-center text-2xl md:text-7xl">
      {displayed}
      <span
        style={{
          display: "inline-block",
          width: "1.5px",
          height: "0.85em",
          background: "#FFDE59",
          marginLeft: "4px",
          borderRadius: "1px",
          verticalAlign: "baseline",
          animation: "blink 1s step-start infinite",
        }}
      />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
    );
}