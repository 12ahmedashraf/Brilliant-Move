import Image from "next/image"
import TypeWriter from "@/components/TypeWriter";
import Link from "next/link";
export default function Hero()
{
    return <div className="flex flex-col items-center mt-7 gap-15 px-3 md:px-0">
        <div className="logo-text flex items-center gap-5 md:gap-10">
            <Image src="/BM_Logo.png" height={190} width={190} alt="" className="w-20 h-20 md:w-36 md:h-36"/>
            <h1 className="font-header font-bold text-white text-[23px] md:text-5xl">Brilliant Move&apos;26</h1>
        </div>
        <div className="text">
            <div className="type-heading flex flex-col items-center gap-10">
                <div><TypeWriter/></div>
                <p className="text-zinc-400 font-medium  text-md text-center font-poppins md:text-xl">Build something incredible this summer, film your journey building it & compete!</p>
            </div>
        </div>
        <div className="cta hover:border-accent bg-accent  registerBox hover:bg-transparent border-2 border-transparent  px-2 py-1 rounded-xl cursor-pointer max-w-md">
                <Link href="/register" className="  text-black   text-sm md:text-lg uppercase font-medium font-poppins hover:text-white transition-all duration-300 ease-in-out ">Make your Brilliant Move now</Link>

        </div>
    </div>
}