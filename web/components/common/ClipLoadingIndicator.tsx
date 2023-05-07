import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
const daisyuiColors = require('daisyui/src/colors/themes');

interface ClipLoadingIndicatorProps {
  loading: boolean;
  size?: number;
  color?: string;
}
export const ClipLoadingIndicator: React.FC<ClipLoadingIndicatorProps> = ({
  loading,
  size = 25,
  color = '#FFFFFF',
}) => {
  const [mounted, setMounted] = useState(false);
  const [colorVariable, setColor] = useState('#FFFFFF');
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const themeColor = daisyuiColors[`[data-theme=${theme}]`]['base-content'];
    setColor(themeColor);
  }, []);

  useEffect(() => {
    if (mounted) {
      const themeColor = daisyuiColors[`[data-theme=${theme}]`]['base-content'];
      setColor(themeColor);
    }
  }, [mounted, theme]);

  if (!mounted) {
    return null;
  }
  return (
    <ClipLoader
      color={color || colorVariable}
      loading={loading}
      size={size}
      aria-label="Loading..."
    />
  );
};
