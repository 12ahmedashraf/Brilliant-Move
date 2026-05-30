const dates = [
    {
        date: "June 10 - June 26",
        title: "Registration",
        desc: "Applications open to students aged 14–18 from across the Arab world. Form your team of up to 4, or register solo and we'll help you find one.",
        tag: "Registraion phase",
        weeks:null,
        active:false
    },
    {
        date: "June 29 - August 3",
        title: "The 5 week Hackathon",
        desc: "The Brilliant Move Hackathon. Build, learn, improve and document every step of your journey with 2 expert workshops every week.",
        tag: "2 workshops a week",
        weeks:[
      { label: "Week 1", detail: "Ideation. Define your problem, validate your idea, shape your vision." },
      { label: "Weeks 2–4", detail: "Building. Deep work on your project." },
      { label: "Week 5", detail: "Filmmaking & Final week. Make sure everything is ready , finalize your film & project." },
    ],
        active:false
    },
    {
    date: "August 3",
    title: "Projects & films Submission closes",
    desc: "The deadline to submit your project & your very short film.",
    tag: "Final submissions",
    weeks: null,
    active: false,
  },
  {
    date: "August 15",
    title: "Festival Closing Ceremony",
    desc: "A festival-style event where finalist teams present their projects and screen their films. Winners are recognized across all four tracks.",
    tag: "Closing ceremony · Awards",
    weeks: null,
    active: false,
  },
];
export default function TimeLine(){
    return(
        <section id="timeline" className="px-6 ">
            <div className="max-w-4xl mx-auto">
                <div className="flex heading flex-col gap-3 mb-10">
                    <h2 className="font-header font-black uppercase text-white text-4xl md:text-5xl leading-none">
                        Timeline
                    </h2>
                    <div className="h-1 w-16 rounded-full bg-accent"/>
                </div>
                <div className="relative pl-8">
                    {dates.map((date,i)=>(
                        <div key={i} className="relative pb-10 last:pb-0 group">
                             <div
                            className={`absolute -left-8 top-1 w-4 h-4 rounded-full border-2 transition-all duration-300
                            ${date.active
                                ? "border-accent bg-accent shadow-[0_0_12px_rgba(255,222,89,0.4)]"
                                : "border-accent/40 bg-[#0d0d0d] group-hover:border-accent group-hover:bg-accent/15"
                            }`}
                            />
                            <p className="text-accent text-[0.68rem] font-header font-black uppercase tracking-widest mb-1">
                                {date.date}
                            </p>
                            <h3 className="font-header font-bold text-white text-base mb-1.5">
                                {date.title}
                            </h3>
                            <p className="text-white/45 text-sm leading-relaxed font-light max-w-xl">
                                {date.desc}
                            </p>
                            {date.weeks && (<div className="mt-3 ml-1 pl-4 border-l border-white/7 flex flex-col gap-2">
                  {date.weeks.map((w, j) => (
                    <p key={j} className="text-white/35 text-xs leading-relaxed">
                      <strong className="text-white/55 font-medium">{w.label} — </strong>
                      {w.detail}
                    </p>
                  ))}
                </div>
              )}
 
              {date.tag && (
                <span className="inline-block mt-2.5 text-[0.68rem] px-3 py-0.5 rounded-full bg-accent/8 border border-accent/20 text-accent/70 font-medium">
                  {date.tag}
                </span>
              )

                            }
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}