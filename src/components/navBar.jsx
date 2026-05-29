import Image from "next/image";
export default function NavBar()
{
    return(
        <div className="bar flex m-3">
            <div className="desktop hiddne md:flex  w-full justify-between items-center">
                <div className="left">
                    <Image src="/logo2.png" alt="" height={60} width={60}/>
                </div>
                <div className="mid-links flex gap-20 font-poppins font-medium uppercase text-md text-white">
                    <a href="" className="border-b-2 border-transparent hover:border-accent hover:scale-105 transition-all duration-300 ease-in-out">About</a>
                    <a href="" className="border-b-2 border-transparent hover:border-accent hover:scale-105 transition-all duration-300 ease-in-out">Vision</a>
                    <a href="" className="border-b-2 border-transparent hover:border-accent hover:scale-105 transition-all duration-300 ease-in-out">Timeline</a>
                    <a href="" className="border-b-2 border-transparent hover:border-accent hover:scale-105 transition-all duration-300 ease-in-out">FAQ</a>
                </div>
                <div className="right-cta">
                    <div className="registerBox hover:bg-transparent border-2 border-transparent hover:border-white transition-all duration-300 ease-in-out bg-accent px-2 py-1 rounded-xl cursor-pointer"><h1 className="text-white font-medium font-poppins ">Register-&gt;</h1></div>
                </div>
            </div>
        </div>
    );
}