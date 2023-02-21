import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { getCorrespondingThemeImage } from '../utils/get-page-image-by-theme';

export function useDecorativeImage(imageGroup: string, defaultTheme?: string) {
  const { theme } = useTheme();
  const [imagePath, setImagePath] = useState<string>('');

  useEffect(() => {
    setImagePath(getCorrespondingThemeImage(imageGroup, defaultTheme ? defaultTheme : theme));
  }, [theme]);

  return { imagePath };
}
