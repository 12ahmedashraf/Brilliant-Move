import Hero from "@/components/heroSection";
import About from "@/components/About";
import Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col gap-35">
      <Hero/>
      <About/>
    </div>
  );
}
