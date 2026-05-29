import { Users,LayoutGrid,Video,Award,ChevronRight } from "lucide-react";
export default function About(){
    const steps = [
        {
      num: "01",
      title: "Form a Team (1-4)",
      desc: "form a team of 1 to 4 students with different skills and interests. All students belong here !",
      tags: ["14-18 years","1–4 members", "Any skill"],
      icon: <Users className="w-5 h-5 text-accent" />,
    },
    {
      num: "02",
      title: "Build your project & Learn",
      desc: "Spend 5 weeks building a project in one of 4 tracks. Attend weekly workshops from founders, creators, and experts.",
      tags: ["Science & Engineering", "AI & programming" , "Visual arts & literature" , "Startups & business"],
      icon: <LayoutGrid className="w-5 h-5 text-accent" />,
    },
    {
      num: "03",
      title: "Create your film",
      desc: "make a very short film about your story. Capture the journey and showcase your project.",
      tags: ["less than 10 minutes", "Showcase your brilliant move"],
      icon: <Video className="w-5 h-5 text-accent" />,
    },
    {
      num: "04",
      title: "Compete & Celebrate",
      desc: "Present your project , celebrate your brilliant move and screen your film at a festival-style closing ceremony. Winners are recognized across all tracks.",
      tags: ["celebrate your brilliant move", "festival-like closing ceremony"],
      icon: <Award className="w-5 h-5 text-accent" />,
    },
    ];
    return (
        <section id="#about" className="flex flex-col items-center gap-10   max-w-7xl mx-auto">
          <div className="heading-about flex flex-col items-center gap-2">
            <h1 className="text-white font-header font-black uppercase text-4xl">What&apos;s brilliant Move?</h1>
            <div className="bg-accent h-1 w-1/2 rounded-full"/>
          </div>
          <div className="text">
            <p className=" text-zinc-400 max-w-3xl font-light text-center  leading-relaxed text-base">Brilliant Move is a <span className="text-accent font-semibold">5-week 
              summer hackathon</span> for students aged 14–18. Teams of up to 4 build real projects 
              across 4 tracks, document their journey through a  <span className="text-accent font-semibold">very short film</span>, and compete in a 
              festival-style closing ceremony 
               all while learning from expert workshops every week.</p>
          </div>
          <div className="inline-flex items-center gap-3 bg-accent/8 border border-accent/25 rounded-full px-5 py-2.5 mb-5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-white/65 text-sm">
            Build , Film and learn from workshops & mentorship 
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {steps.map((step, i) => (
            <div key={step.num} className="relative w-full h-full">
              <div className="group flex flex-col items-center text-center border border-white/8 bg-white/3 rounded-2xl p-7 transition-all duration-300 hover:border-accent/40 hover:bg-accent/4 hover:-translate-y-1 cursor-default w-full h-full">
                <div className="text-[0.7rem] font-header font-black uppercase tracking-widest text-white/20 group-hover:text-accent transition-colors duration-300 mb-4">
                  Step {step.num}
                </div>

                <div className="w-12 h-12 shrink-0 rounded-xl bg-white/6 border border-white/10 group-hover:bg-accent/10 group-hover:border-accent/50 transition-all duration-300 flex items-center justify-center mb-4">
                  {step.icon}
                </div>

                <div className="font-header font-extrabold text-white text-base mb-2.5 leading-snug">
                  {step.title}
                </div>

                <p className="text-white/50 text-sm leading-relaxed font-light grow">
                  {step.desc}
                </p>

                <div className="flex flex-wrap justify-center gap-1.5 mt-6">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.72rem] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>
    )
}