import { Poppins,Montserrat } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navBar";
import Footer from "@/components/Footer";
import GridCursorEffect from "@/components/gridcursor";
const fMontserrat = Montserrat({
  
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const fPoppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Brilliant Move Hackathon",
  description: "Build your project, film your journey & make your brilliant move!!",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fMontserrat.variable} ${fPoppins.variable} min-h-screen antialiased `}
    >
      <body className="min-h-screen bg-grid-pattern flex flex-col font-poppins">
          <GridCursorEffect />
        <NavBar/>
        <main className="relative z-10">{children}</main>
        <Footer/>
        </body>
        
    </html>
  );
}
