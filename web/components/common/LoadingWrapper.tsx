import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { ClipLoadingIndicator } from './ClipLoadingIndicator';
const daisyuiColors = require('daisyui/src/colors/themes');

interface LoadingWrapperProps {
  loading: boolean;
  children: React.ReactNode;
}
export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ loading, children }) => {
  const [mounted, setMounted] = useState(false);
  const [color, setColor] = useState('#FFFFFF');
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const themeColor = daisyuiColors[`[data-theme=${theme}]`]['primary'];
    setColor(themeColor);
  }, []);

  useEffect(() => {
    if (mounted) {
      const themeColor = daisyuiColors[`[data-theme=${theme}]`]['primary'];
      setColor(themeColor);
    }
  }, [mounted, theme]);

  if (!mounted) {
    return null;
  }
  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center gap-2">
              <ClipLoadingIndicator loading={loading} size={50} color={color} />
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};
