import { useState, useEffect } from 'react';
import { styleManager } from '../utils/styleManager';

export const useColorPalette = () => {
  const [colorPalette, setColorPalette] = useState('KEA_LABS');

  useEffect(() => {
    const fetchColorPalette = async () => {
      const palette = await styleManager.getColorPalette();
      setColorPalette(palette);
    };
    
    fetchColorPalette();
    
    const unsubscribe = styleManager.subscribe(setColorPalette);
    return unsubscribe;
  }, []);

  return colorPalette;
};