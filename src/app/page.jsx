import Hero from "@/components/heroSection";
import About from "@/components/About";
import Image from "next/image";
import Vision from "@/components/Vision";
import TimeLine from "@/components/Timeline";
export default function Home() {
  return (
    <div className="flex flex-col gap-20 md:gap-25">
      <Hero/>
      <About/>
      <TimeLine/>
      <Vision/>
    </div>
  );
}
