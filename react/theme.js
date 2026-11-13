// =====================================================================
// BOODOO React — Theme & Density Context Provider
// Bridges host CSS variables and manages density (normal / compact)
// =====================================================================

import React, { createContext, useContext, useMemo } from 'react';

export const ThemeContext = createContext({
  density: 'normal',
  direction: 'ltr',
  theme: {},
});

export function useBoodooTheme() {
  return useContext(ThemeContext);
}

export function useDirection() {
  const { direction } = useContext(ThemeContext);
  return direction || 'ltr';
}

export function BoodooProvider({
  children,
  density = 'normal',
  direction = 'ltr',
  dir,
  theme = {},
  className = '',
  style = {},
  ...props
}) {
  const activeDir = dir || direction;
  const dynamicStyles = useMemo(() => {
    const s = { ...style };
    if (theme.primary) s['--boodoo-primary'] = theme.primary;
    if (theme.surface) s['--boodoo-surface'] = theme.surface;
    if (theme.text) s['--boodoo-text'] = theme.text;
    if (theme.radius) s['--boodoo-radius'] = theme.radius;
    return s;
  }, [theme, style]);

  const densityClass = density === 'compact' ? 'boodoo-density-compact' : '';
  const dirClass = activeDir === 'rtl' ? 'dir-rtl' : 'dir-ltr';
  const mergedClass = ['boodoo', densityClass, dirClass, className].filter(Boolean).join(' ');

  const contextValue = useMemo(
    () => ({ density, direction: activeDir, theme }),
    [density, activeDir, theme]
  );

  return React.createElement(
    ThemeContext.Provider,
    { value: contextValue },
    React.createElement(
      'div',
      {
        className: mergedClass,
        dir: activeDir,
        'data-density': density,
        style: dynamicStyles,
        ...props,
      },
      children
    )
  );
}
