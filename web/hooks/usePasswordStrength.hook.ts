import { useState } from 'react';

export function usePasswordStrength() {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const getPasswordSuccessPercentage = (password: string) => {
    let percentage = 0;
    if (password.length >= 6) {
      percentage += 25;
    }
    if (password.match(/[a-z]/)) {
      percentage += 25;
    }
    if (password.match(/[A-Z]/)) {
      percentage += 25;
    }
    if (password.match(/[0-9]/)) {
      percentage += 25;
    }
    return percentage;
  };

  const updatePasswordStrength = (password: string) => {
    setPasswordStrength(getPasswordSuccessPercentage(password));
  };

  return { passwordStrength, updatePasswordStrength };
}
