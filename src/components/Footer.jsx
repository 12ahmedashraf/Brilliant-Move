import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTiktok, FaLinkedin } from "react-icons/fa6";
const navLinks = [
    {label:"About",href:"/#about"},
    {label:"TimeLine",href:"/#timeline"},
    {label:"Vision",href:"/#vision"},
    {label:"FAQ",href:"/#faq"},
    {label:"Register",href:"/register"},
];
const socials = [
    { label: "Instagram",href:"#",icon:<FaInstagram className="w-4 h-4"/>},
    {label: "TikTok",href:"#",icon:<FaTiktok className="w-4 h-4"/>},
    {label: "LinkedIn",href:"#",icon:<FaLinkedin className="w-4 h-4"/>},
];
export default function Footer(){
    return (
        <footer className="border-t border-accent/20 px-4 sm:px-6 pt-12 md:pt-14 pb-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-10 md:mb-12">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                            <Image src="/BM_Logo.png" alt="Brilliant Move" width={40} height={40} className="rounded-lg"/>
                            <span className="font-header font-black text-white text-base">
                                Brilliant Move&apos;26
                            </span>
                        </div>
                        <p className="text-sm text-white/35 leading-relaxed font-light max-w-sm md:max-w-xs font-poppins text-center md:text-left">
                            A 5-week summer hackathon for students aged 14-18 from across the Arab world.Build , Film & Compete.
                        </p>
                        <p className="mt-4 text-accent/60 text-xs italic font-poppins md:text-left text-center">
                            &ldquo;The brilliant move in your story&rdquo;
                        </p>
                    </div>
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-header font-black uppercase text-white/30 text-[0.68rem] tracking-widest mb-4">
                        Quick Links
                        </h4>
                        <div className="flex flex-col gap-2.5">
                            {navLinks.map((l)=>(
                                <a key={l.label} href={l.href} className="text-sm text-white/50 hover:text-accent font-poppins transition-colors duration-200 w-fit lowercase text-center md:text-left">
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-header font-black uppercase text-white/30 text-[0.68rem] tracking-widest mb-4">
                            connect
                        </h4>
                        <div className="flex gap-3 mb-5">
                            {socials.map((s)=>(
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white/50 hover:text-accent hover:bg-accent/10 hover:border-accent/30 transition-all duration-200">
                                        {s.icon}
                                    </a>
                            ))}
                        </div>
                    </div>
                </div>
                   <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs text-center sm:text-left">
            © 2026 Brilliant Move  · All rights reserved
          </p>
         
        </div>
            </div>            
        </footer>
    )
}