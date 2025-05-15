import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';

interface RegistrationResultModalProps {
  isSuccess: boolean;
  message: string;
  onClose: () => void;
}

const RegistrationResultModal: React.FC<RegistrationResultModalProps> = ({ isSuccess, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          {isSuccess ? (
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
          )}
          <h2 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
            {isSuccess ? 'Registration Successful' : 'Registration Failed'}
          </h2>
          <p className="text-center text-gray-600 mb-6">{message}</p>
          <Button onClick={onClose} className="w-full">
            {isSuccess ? 'Continue' : 'Try Again'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationResultModal;
