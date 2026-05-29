import Image from "next/image"
import TypeWriter from "@/components/TypeWriter";
export default function Hero()
{
    return <div className="flex flex-col items-center mt-7 gap-15">
        <div className="logo-text flex items-center gap-10">
            <Image src="/BM_Logo.png" height={190} width={190} alt="" />
            <h1 className="font-header font-bold text-white text-5xl">Brilliant Move&apos;26</h1>
        </div>
        <div className="text">
            <div className="type-heading">
                <TypeWriter/>
            </div>
        </div>
    </div>
}