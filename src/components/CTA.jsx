import Link from "next/link"
export default function CTA()
{
    return (
        <section className="p-4 sm:p-6 mb-5 md:mb-10">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 md:gap-10">
                <div className="flex flex-col items-center gap-4">
                    <h2 className="font-header font-black uppercase text-white text-3xl sm:text-4xl md:text-5xl leading-tight ">
                    Ready to make your{" "} 
                    <span className="text-accent">Brilliant Move?</span>
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg font-light text-white/40 max-w-lg leading-relaxed font-poppins">
                      Join students from across the Arab world this summer. Build something real, tell your story, and compete.  
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-10 w-full sm:w-auto">
                    <Link
                     href="/register"
                     className="w-full  sm:w-auto text-center font-poppins font-semibold uppercase text-sm sm:text-base tracking-wide
              px-8 py-3.5 rounded-xl
              bg-accent text-black border-2 border-accent
              hover:bg-transparent hover:text-white hover:border-white
              transition-all duration-300 ease-in-out"
          >
            Participate -&gt;
                    </Link>
          
                </div>
            </div>
        </section>
    )
}