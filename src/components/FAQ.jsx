"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
const faqs = [
    {
        q: "Who can participate in Brilliant Move?",
        a: <>Any student aged <span className="text-accent font-semibold ">14 to 18</span> from anywhere in the <span className="text-accent font-semibold">Arab World</span>is welcome. If you are a beginner or still don&apos;t have skills , Don&apos;t worry it is your place!</>
    },
    {
        q:"What are the 4 tracks?",
        a:(
            <div className="flex flex-col gap-2.5">
                {
                    [
                        ["Science & Engineering" , "Scientific research , hardware & engineering projects."],
                        ["AI & Programming" , "Software , website & AI powered projects."],
                        ["Literature & Digital Arts","Writing a Novel, creating a film (other than the short film) , making a magazine and all creative work."],
                        ["Startups & Business","Ventures, business models, and entrepreneurship."]
                    ].map(([title,desc]) => (
                        <div key={title}>
                            <p className="text-accent font-semibold">{title}</p>
                            <span className="text-white/50"> - {desc}</span>
                        </div>
                    ))
                }
            </div>
        ),
    },
    {
        q: "Can I join without a team?",
        a: <>Yes. you can register solo and we&apos;ll help you connect with other participants during onboarding to form a team. Teams can be <span className="text-accent font-semibold">1 to 4 members</span> but we encourage at least 2 for accountability and collaboration.</>
    },
    {
        q:"Is Brilliant Move free?",
        a: <>Completely<span className="text-accent font-semibold"> FREE. </span>The only thing we ask for is <span className="text-accent font-semibold">your commitment to your brilliant move</span></>
    },
    {
        q: "What are the workshops like?",
        a: <>Every week throughout the hackathon there are <span className="text-accent font-semibold">workshops </span>led by real founders, creators, and experts. They&apos;re built around helping you make progress on your project, not generic lectures.</>
    },
    {
        q:"How are the winners selected?",
        a: <>Winners are judged on both their<span className="text-accent font-semibold"> projects and short films</span>. Full judging criteria will be announced closer to the event but know that the journey and story matter just as much as the final result.</>
    },
];
export default function FAQ()
{
    const [open,setOpen] = useState(null);
    return (
        <section id="faq" className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col gap-3 mb-10 md:mb-14">
                    <h2 className="font-header font-black uppercase text-white text-3xl md:text-5xl leading-none">
                        FAQ
                    </h2>
                    <div className="h-1 w-14 md:w-16 rounded-full bg-accent"/>
                </div>
                <div className="flex flex-col gap-2">
                    {faqs.map((faq,i)=>{
                        const isOpen = open == i;
                        return (
                            <div
                            key={i}
                            className={`border rounded-xl overflow-hidden transition-colors duration-200 ${isOpen ? "border-accent/25" : "border-white/7"}`}>
                                <button onClick={() => setOpen(isOpen ? null : i)} className={`w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-4 sm:py-4.5 text-left transition-colors duration-200 ${isOpen ? "bg-accent/4": "bg-white/2 hover:bg-white/4"}`}>
                                    <span className="font-header font-bold text-white text-xs sm:text-sm md:text-base leading-snug">
                                        {faq.q}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 sm:h-5 flex-shrik-0 transition-all duration-300 ${isOpen ? "stroke-accent rotate-180" : "stroke-accent/50"}`}
                                    />
                                </button>
                                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <div className="border-t font-poppins border-white/5 pt-3 sm:pt-4 text-white/50 text-xs sm:text-sm leading-relaxed font-light">
                      {faq.a}
                    </div>
                  </div>
                </div>
                            </div>
                        )
                    })

                    }
                </div>
            </div>
        </section>
    )
}