import Hero from "@/components/heroSection";
import About from "@/components/About";
import Image from "next/image";
import Vision from "@/components/Vision";
import TimeLine from "@/components/Timeline";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <div className="flex flex-col gap-20 md:gap-25">
      <Hero/>
      <About/>
      <TimeLine/>
      <Vision/>
      <FAQ/>
      <Footer/>
    </div>
  );
}
