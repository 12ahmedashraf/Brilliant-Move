import Script from "next/script";

export default function RegistrationForm() {
  return (
    <div className="relative w-full h-screen overflow-hidden ">
      
      <Script 
        src="https://tally.so/widgets/embed.js" 
        strategy="afterInteractive" 
      />

      <iframe
        data-tally-src="https://tally.so/r/lbvezv?transparentBackground=1&formEventsForwarding=1"
        width="100%"
        height="100%"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Brilliant Move'26 Registration"
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}