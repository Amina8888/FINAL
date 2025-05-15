import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import ResultModal from "../../components/ResultModal";
import { useChat } from "@/contexts/ChatContext";

interface ModalLoginPageProps {
  onClose?: () => void;
  onSwitchToRegister?: () => void;
}

export const ModalLoginPage: React.FC<ModalLoginPageProps> = ({ onClose, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { openChat } = useChat();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5085/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 401) {
        const message = typeof data === "string" ? data : data.message;
        setIsSuccess(false);
        setResultMessage(message || "Invalid credentials");
        setShowResultModal(true);
        return;
      }
  
      if (!response.ok) {
        const message = typeof data === "string" ? data : data.message;
        setIsSuccess(false);
        setResultMessage(message || "Login failed");
        setShowResultModal(true);
        return;
      }
  
      const { token, role } = data;
      login(token, role);
      setUserRole(role);

      setIsSuccess(true);
      setResultMessage("Login successful!");
      setShowResultModal(true);
      openChat();
    } catch (error: any) {
      setIsSuccess(false);
      setResultMessage(error.message || "Login failed");
      setShowResultModal(true);
    }
  };
  
  const handleResultModalClose = () => {
    setShowResultModal(false);
    if (isSuccess) {
      onClose?.();
      navigate(userRole === "Specialist" ? "/consultant/dashboard" : "/user/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center">
      {showResultModal && (
        <ResultModal
          title={isSuccess ? "Login Successful" : "Login Failed"}
          isSuccess={isSuccess}
          message={resultMessage}
          buttonText={isSuccess ? "Continue" : "Try Again"}
          onClose={handleResultModalClose}
        />
      )}

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
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col w-full items-start gap-1">
              <label
                htmlFor="email"
                className="font-['Nunito',Helvetica] font-normal text-[#202833] text-xs tracking-[0] leading-[17px]"
              >
                Email address
              </label>
              <div className="relative w-full">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white rounded-lg border border-solid border-[#d4dce4] shadow-[0px_2px_2px_#ffffff26,inset_0px_2px_2px_#0000001a] text-xs font-['Nunito',Helvetica] font-normal placeholder:text-[#d4dce4]"
                />
              </div>
            </div>

            <div className="flex flex-col w-full items-start gap-1">
              <label
                htmlFor="password"
                className="font-['Nunito',Helvetica] font-normal text-[#202833] text-xs tracking-[0] leading-[17px]"
              >
                Password
              </label>
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white rounded-lg border border-solid border-[#d4dce4] shadow-[0px_2px_2px_#ffffff26,inset_0px_2px_2px_#0000001a] text-xs font-['Nunito',Helvetica] font-normal placeholder:text-[#d4dce4]"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute w-[19px] h-[13px] top-[10px] right-[8px] focus:outline-none"
                >
                  <div className="absolute w-[13px] h-[13px] top-0 left-1.5 rounded-[6.69px/6.5px] border border-solid border-[#202833]">
                    {showPassword ? (
                      <EyeOffIcon className="w-3 h-3" />
                    ) : (
                      <EyeIcon className="w-3 h-3" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-blue-600 text-sm hover:underline">Forgot password?</a>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <Button
                type="submit"
                className="w-full h-[41px] bg-[#007aff] text-white rounded-lg font-body-small-strong text-[length:var(--body-small-strong-font-size)] tracking-[var(--body-small-strong-letter-spacing)] leading-[var(--body-small-strong-line-height)] [font-style:var(--body-small-strong-font-style)]"
              >
                Log In
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
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToRegister}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModalLoginPage;
