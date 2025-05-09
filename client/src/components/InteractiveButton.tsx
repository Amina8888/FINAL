// import { Button } from "@/components/ui/button";
// import React from "react";

// interface InteractiveButtonProps {
//   children: React.ReactNode;
// }

// export default function InteractiveButton({ children }: InteractiveButtonProps) {
//   return (
//     <div className="inline-flex items-center justify-center">
//       <Button className="h-auto w-[113px] p-3 bg-[#007aff26] hover:bg-[#007aff40] text-white font-body-small-strong font-semibold text-[14px] tracking-normal leading-[139.9999976158142%] shadow-shadow">
//         {children}
//       </Button>
//     </div>
//   );
// }

import React from "react";

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function InteractiveButton({ children, onClick }: InteractiveButtonProps) {
  return (
    <div className="inline-flex justify-center items-center h-20">
      <div className="w-[113px] shadow-[0px_10px_50px_rgba(0,0,0,0.10)] flex justify-start items-start">
        <button
          onClick={onClick}
          className="w-[113px] h-[41px] px-3 py-2 bg-[rgba(0,122,255,0.15)] hover:bg-[rgba(0,122,255,0.25)] text-[#F5F5F5] text-[14px] font-semibold leading-[1.4] font-['Inter'] rounded-[8px] flex items-center justify-center transition-colors duration-200"
        >
          {children}
        </button>
      </div>
    </div>
  );
}


