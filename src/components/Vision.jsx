import { Route, BrainCircuit,Users,Rocket } from "lucide-react";

const values = [
    {
        title : "Journey Over Results",
        desc: "We celebrate the process, the failures and breakthroughs not the final product only.",
        icon: <Route className="w-5 h-5 text-accent"/>,

    },
    {
        title : "Human Factor in the Age of AI",
        desc: "Creativity , storytelling and empathy  are skills no model can replace, We are putting them at the center.",
        icon: <BrainCircuit className="w-5 h-5 text-accent"/>,
    },
    {
        title : "Creative young minds",
        desc: "Break out of the standard school bubble. We bring together the most ambitious young creators and builders so you can find your circle and grow together.",
        icon: <Users className="w-5 h-5 text-accent"/>,
    },
    {
        title : "Learn by doing",
        desc: "Weekly workshops from real founders and creators. Real knowledge from professional ones.",
        icon: <Rocket className="w-5 h-5 text-accent"/>,
    },
];
const sdgs = [
    {
        num: 4,
        title: "Quality Education",
        desc: "Expert-led workshops & mentorship",
        textColor: "text-[#c5192d]",
        cardStyles: "border-[#c5192d]/20 hover:border-[#c5192d] hover:bg-[#c5192d]/10",
    },
    {
    num: 8,
    title: "Decent Work & Growth",
    desc: "Entrepreneurship, startups & real-world skills",
    textColor: "text-[#a21942]",
    cardStyles: "border-[#a21942]/20 hover:border-[#a21942] hover:bg-[#a21942]/10",
  },
    {
        num: 9,
        title: "Industry & Innovation",
        desc: "Building projects that solve real problems",
        textColor: "text-[#fd6925]",
        cardStyles: "border-[#fd6925]/20 hover:border-[#fd6925] hover:bg-[#fd6925]/10",
    },
    {
        num: 17,
        title: "Partnerships for goals",
        desc: "Community, mentorship & collaboration",
        textColor: "text-[#19486a]",
        cardStyles: "border-[#19486a]/20 hover:border-[#19486a] hover:bg-[#19486a]/10",
    },
];

export default function Vision(){
    return(
        <section id="vision" className="px-6  relative">
            <div className="max-w-6xl mx-auto relative z-10 ">
                <div className="flex justify-center">
                <div className="w-fit heading-about flex flex-col items-center gap-2 justify-center">
                    <h1 className="text-white font-header font-black uppercase text-4xl">Our Vision</h1>
                    <div className="bg-accent h-1 w-1/2 rounded-full"/>
                </div>
                </div>
                <div className="grid grid-cols-1 gap-12 mb-10">
                    <div>
                        <p className="text-accent text-xs font-header font-black uppercase tracking-widest mt-10 md:mt-0 mb-8">
                            what we stand for
                        </p>
                        <div className="flex flex-col gap-2">
                            {
                                values.map((v,i)=>(
                                    <div
                                        key={i}
                                        className="group flex items-start gap-5 p-4 rounded-2xl transition-all duration-300 hover:bg-white/2">
                                            <div className="w-12 h-12 shrink-0 rounded-xl bg-white/4 border border-white/10 group-hover:bg-accent/10 group-hover:border-accent/30 transition-all duration-300 flex items-center justify-center">
                                                {v.icon}
                                            </div>
                                            <div className="pt-1">
                                                <h1 className="block  font-header font-bold text-white text-lg mb-1.5 group-hover:text-accent transition-colors duration-300">
                                                    {v.title}
                                                </h1>
                                                <p className="text-white/50 text-sm leading-relaxed font-light">
                                                    {v.desc}
                                                </p>
                                            </div>
                                    </div>
                                    ))
                            }
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-accent text-xs font-header font-black uppercase tracking-widest mb-8">
                            Why it matters for you?
                        </p>
                        <div className="relative h-full bg-linear-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 md:p-10 overflow-hidden shadow-2xl">
                            <div className="absolute top-0 righit-0 w-64 h-64 bg-accent/5 blur[80px] rounded-full pointer-events-none"/>
                            <p className="relative font-header font-black text-white text-2xl md:text-3xl leading-snug mb-8">
                The brilliant move that will define your future{" "}
                <span className="text-accent">can be taken now.</span>
              </p>
              
              <div className="relative flex flex-col gap-4">
                {[
                  "Build something real , learn from it and add it to your portfolio before university",
                  "Learn from founders, creators, and experts",
                  "Develop communication and storytelling skills that set you apart",
                  "Work in a team, navigate disagreements, and ship under pressure",
                  "Be part of the first student innovation community",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-4 text-white/60 text-sm md:text-base leading-relaxed font-light group">
                    <span className="text-accent/60 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 shrink-0 mt-0.5">
                      &rarr;
                    </span>
                    {point}
                  </div>
                ))}
              </div>
                        </div>
                    </div>
                </div>
                <div className=" border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <p className="text-white/40 text-sm font-header font-black uppercase tracking-widest">
              UN Sustainable Development Goals We Support
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sdgs.map((sdg) => (
              <div
                key={sdg.num}
                className={`group flex flex-col gap-3 bg-white/2 border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default ${sdg.cardStyles}`}
              >
                <span
                  className={`font-header font-black text-3xl leading-none transition-transform duration-300 group-hover:scale-110 origin-left ${sdg.textColor}`}
                >
                  {sdg.num}
                </span>
                <div>
                  <strong className="block text-white text-sm font-bold leading-tight mb-1.5">
                    {sdg.title}
                  </strong>
                  <span className="text-white/40 text-xs leading-relaxed block font-light group-hover:text-white/60 transition-colors">
                    {sdg.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
            </div>
        </section>
    )
}