import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

interface ModalRegisterPageProps {
  onClose?: () => void;
  onSwitchToLogin?: () => void;
}

export const ModalRegisterPage = ({ onClose }: ModalRegisterPageProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isConsultant, setIsConsultant] = useState(false);
  const [consultancyArea, setConsultancyArea] = useState("");

  const consultancyAreas = [
    "Technology",
    "Finance",
    "Marketing",
    "Human Resources",
    "Operations",
    "Strategy",
  ];

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const formFields = [
    { id: "email", label: "Email address", type: "text" },
    { id: "password", label: "Password", type: showPassword ? "text" : "password" },
    { id: "confirmPassword", label: "Confirm password", type: showConfirmPassword ? "text" : "password" },
  ];

  return (
    <div className="flex items-center justify-center">
      <Card className="
        w-full
        max-w-[90vw]
        sm:max-w-md
        md:max-w-xl
        lg:max-w-2xl
        xl:max-w-3xl
        h-auto
        max-h-[90vh]
        overflow-y-auto relative rounded-[10px] border border-solid border-[#007aff45]">
        <CardContent className="pt-[43px] px-[43px] pb-[43px] flex flex-col gap-2.5">
          <form className="flex flex-col gap-4">
            {formFields.map((field) => (
              <div
                key={field.id}
                className="flex flex-col w-full items-start gap-1"
              >
                <label
                  htmlFor={field.id}
                  className="font-['Nunito',Helvetica] font-normal text-[#202833] text-xs tracking-[0] leading-[17px]"
                >
                  {field.label}
                </label>
                <div className="relative w-full">
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder="Type here..."
                    className="w-full bg-white rounded-lg border border-solid border-[#d4dce4] shadow-[0px_2px_2px_#ffffff26,inset_0px_2px_2px_#0000001a] text-xs font-['Nunito',Helvetica] font-normal placeholder:text-[#d4dce4]"
                  />
                  {(field.id === "password" || field.id === "confirmPassword") && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field.id as "password" | "confirmPassword")}
                      className="absolute w-[19px] h-[13px] top-[10px] right-[8px] focus:outline-none"
                    >
                      <div className="absolute w-[13px] h-[13px] top-0 left-1.5 rounded-[6.69px/6.5px] border border-solid border-[#202833]">
                        {(field.id === "password" && showPassword) || (field.id === "confirmPassword" && showConfirmPassword) ? (
                          <EyeOffIcon className="w-3 h-3" />
                        ) : (
                          <EyeIcon className="w-3 h-3" />
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="text-red-500 font-['Nunito',Helvetica] font-normal text-sm tracking-[0] leading-[17px] h-[26px]">
              {/* Password is incorrect */}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consultant"
                  checked={isConsultant}
                  onCheckedChange={(checked) => setIsConsultant(checked as boolean)}
                  className="w-[18px] h-[18px] rounded-sm border border-solid border-[#49454f]"
                />
                <label
                  htmlFor="consultant"
                  className="font-['Nunito',Helvetica] font-normal text-black text-xs tracking-[0] leading-[17px]"
                >
                  Register as a Consultant
                </label>
              </div>
              {isConsultant && (
                <Select value={consultancyArea} onValueChange={setConsultancyArea}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your area of consultancy" />
                  </SelectTrigger>
                  <SelectContent>
                    {consultancyAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <Button
                type="submit"
                className="w-full h-[41px] bg-[#007aff] text-white rounded-lg font-body-small-strong text-[length:var(--body-small-strong-font-size)] tracking-[var(--body-small-strong-letter-spacing)] leading-[var(--body-small-strong-line-height)] [font-style:var(--body-small-strong-font-style)]"
              >
                Register
              </Button>
              {onClose && (
                <Button
                  type="button"
                  onClick={onClose}
                  className="w-full h-[41px] bg-gray-200 text-gray-800 rounded-lg font-body-small-strong text-[length:var(--body-small-strong-font-size)] tracking-[var(--body-small-strong-letter-spacing)] leading-[var(--body-small-strong-line-height)] [font-style:var(--body-small-strong-font-style)]"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
