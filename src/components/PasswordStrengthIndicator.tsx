
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const requirements = [
    { label: 'At least 8 characters', check: password.length >= 8 },
    { label: 'Contains uppercase letter', check: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', check: /[a-z]/.test(password) },
    { label: 'Contains number', check: /\d/.test(password) },
    { label: 'Contains special character', check: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const strength = requirements.filter(req => req.check).length;
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-crm-text-secondary">Password Strength</span>
        <span className="text-sm font-medium text-crm-text-white">
          {strengthLabels[strength - 1] || 'Very Weak'}
        </span>
      </div>
      
      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-colors duration-200 ${
              index < strength ? strengthColors[strength - 1] : 'bg-crm-tertiary'
            }`}
          />
        ))}
      </div>

      <div className="space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2 text-xs">
            {req.check ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-red-500" />
            )}
            <span className={req.check ? 'text-green-400' : 'text-crm-text-secondary'}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
