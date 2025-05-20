import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import RegistrationResultModal from "../../components/RegistrationResultModal";

interface ModalRegisterPageProps {
  onClose?: () => void;
  onSwitchToLogin?: () => void;
}

export const ModalRegisterPage = ({
  onClose,
  onSwitchToLogin,
}: ModalRegisterPageProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isConsultant, setIsConsultant] = useState(false);
  const [consultancyArea, setConsultancyArea] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const consultancyAreas = [
    "Technology",
    "Law",
    "Health",
    "Finance",
    "Marketing",
    "Human Resources",
    "Strategy",
    "Education",
    "Media",
    "Sales",
    "Customer Service",
    "Design",
    "Product Management",
    "Project Management",
    "Business Development",
    "Operations Management",
  ];

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResultModalVisible(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5085/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: isConsultant ? "Specialist" : "User",
          consultancyArea: isConsultant ? consultancyArea : undefined,
        }),
      });

      const result = await response.json();

      setIsSuccess(response.ok);
      setResultMessage(result.message || (response.ok ? "You have successfully registered." : "Something went wrong."));
      setResultModalVisible(true);
    } catch (err: any) {
      setIsSuccess(false);
      setResultMessage(err.message || "Registration failed");
      setResultModalVisible(true);
    }
  };

  const handleCloseResultModal = () => {
    setResultModalVisible(false);
    if (isSuccess) {
      onSwitchToLogin?.();
    }
  };

  return (
    <div className="flex items-center justify-center">
      {resultModalVisible && (
        <RegistrationResultModal
          isSuccess={isSuccess}
          message={resultMessage}
          onClose={handleCloseResultModal}
        />
      )}

      <Card className="w-full max-w-[90vw] sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl h-auto max-h-[90vh] overflow-y-auto relative rounded-[10px] border border-solid border-[#007aff45]">
        <CardContent className="pt-[43px] px-[43px] pb-[43px] flex flex-col gap-2.5">
          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            {/* Email */}
            <div className="flex flex-col w-full items-start gap-1">
              <label htmlFor="email" className="text-xs text-[#202833] font-normal leading-[17px]">Email address</label>
              <Input
                id="email"
                type="email"
                placeholder="Type here..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col w-full items-start gap-1">
              <label htmlFor="password" className="text-xs text-[#202833] font-normal leading-[17px]">Password</label>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Type here..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute w-[19px] h-[13px] top-[10px] right-[8px] focus:outline-none"
                >
                  <div className="absolute w-[13px] h-[13px] top-0 left-1.5 border border-[#202833]">
                    {showPassword ? <EyeOffIcon className="w-3 h-3" /> : <EyeIcon className="w-3 h-3" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col w-full items-start gap-1">
              <label htmlFor="confirmPassword" className="text-xs text-[#202833] font-normal leading-[17px]">Confirm Password</label>
              <div className="relative w-full">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Type here..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute w-[19px] h-[13px] top-[10px] right-[8px] focus:outline-none"
                >
                  <div className="absolute w-[13px] h-[13px] top-0 left-1.5 border border-[#202833]">
                    {showConfirmPassword ? <EyeOffIcon className="w-3 h-3" /> : <EyeIcon className="w-3 h-3" />}
                  </div>
                </button>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            {/* Consultant checkbox + Select */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consultant"
                  checked={isConsultant}
                  onCheckedChange={(checked) => setIsConsultant(checked as boolean)}
                />
                <label htmlFor="consultant" className="text-xs text-black font-normal leading-[17px]">
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

            {/* Buttons */}
            <div className="flex flex-col gap-4 mt-4">
              <Button type="submit" className="w-full h-[41px] bg-[#007aff] text-white rounded-lg">
                Register
              </Button>
              {onClose && (
                <Button
                  type="button"
                  onClick={onClose}
                  className="w-full h-[41px] bg-gray-200 text-gray-800 rounded-lg"
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

export default ModalRegisterPage;
