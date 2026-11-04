// =====================================================================
// BOODOO React — Theme & Density Context Provider
// Bridges host CSS variables and manages density (normal / compact)
// =====================================================================

import React, { createContext, useContext, useMemo } from 'react';

export const ThemeContext = createContext({
  density: 'normal',
  theme: {},
});

export function useBoodooTheme() {
  return useContext(ThemeContext);
}

export function BoodooProvider({
  children,
  density = 'normal',
  theme = {},
  className = '',
  style = {},
  ...props
}) {
  const dynamicStyles = useMemo(() => {
    const s = { ...style };
    if (theme.primary) s['--boodoo-primary'] = theme.primary;
    if (theme.surface) s['--boodoo-surface'] = theme.surface;
    if (theme.text) s['--boodoo-text'] = theme.text;
    if (theme.radius) s['--boodoo-radius'] = theme.radius;
    return s;
  }, [theme, style]);

  const densityClass = density === 'compact' ? 'boodoo-density-compact' : '';
  const mergedClass = ['boodoo', densityClass, className].filter(Boolean).join(' ');

  const contextValue = useMemo(() => ({ density, theme }), [density, theme]);

  return React.createElement(
    ThemeContext.Provider,
    { value: contextValue },
    React.createElement(
      'div',
      {
        className: mergedClass,
        'data-density': density,
        style: dynamicStyles,
        ...props,
      },
      children
    )
  );
}

