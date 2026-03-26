import { LandingFooter } from "@/src/components/Footers";
import { LandingHeader } from "@/src/components/Headers";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-marketing">
      <LandingHeader/>
      {children}
      <LandingFooter/>  
    </div>
  );
} 