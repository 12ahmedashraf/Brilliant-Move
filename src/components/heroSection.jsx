import Image from "next/image"
import TypeWriter from "@/components/TypeWriter";
import Link from "next/link";
export default function Hero()
{
    return <div className="flex flex-col items-center mt-7 gap-15">
        <div className="logo-text flex items-center gap-10">
            <Image src="/BM_Logo.png" height={190} width={190} alt="" />
            <h1 className="font-header font-bold text-white text-5xl">Brilliant Move&apos;26</h1>
        </div>
        <div className="text">
            <div className="type-heading flex flex-col items-center gap-10">
                <div><TypeWriter/></div>
                <p className="text-zinc-400 font-medium text-2xl">Build something incredible this summer, film your journey building it & compete!</p>
            </div>
        </div>
        <div className="cta">
            <div className="registerBox hover:bg-transparent border-2 border-transparent hover:border-white transition-all duration-300 ease-in-out bg-accent px-2 py-1 rounded-xl cursor-pointer">
                <Link href="" className="text-white text-2xl uppercase font-medium font-poppins ">Make your Brilliant Move now</Link>
            </div>

        </div>
    </div>
}