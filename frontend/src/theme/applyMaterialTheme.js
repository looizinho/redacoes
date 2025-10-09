import { argbFromHex, themeFromSourceColor, applyTheme } from '@material/material-color-utilities';

const DEFAULT_SOURCE_COLOR = '#6750A4';
const MEDIA_QUERY = '(prefers-color-scheme: dark)';

const isBrowserEnvironment = () => typeof window !== 'undefined' && typeof document !== 'undefined';

export function applyMaterialTheme(options = {}) {
  if (!isBrowserEnvironment()) {
    return;
  }

  const { sourceColor = DEFAULT_SOURCE_COLOR, customColors = [] } = options;
  const theme = themeFromSourceColor(argbFromHex(sourceColor), customColors);
  const root = document.documentElement;
  const darkMatcher = window.matchMedia(MEDIA_QUERY);

  const updateScheme = (isDark) => {
    applyTheme(theme, {
      target: root,
      dark: isDark,
      brightnessSuffix: true,
    });

    root.style.colorScheme = isDark ? 'dark' : 'light';
  };

  updateScheme(darkMatcher.matches);

  const handleChange = (event) => {
    updateScheme(event.matches);
  };

  if (typeof darkMatcher.addEventListener === 'function') {
    darkMatcher.addEventListener('change', handleChange);
  } else if (typeof darkMatcher.addListener === 'function') {
    darkMatcher.addListener(handleChange);
  }

  return { theme, apply: updateScheme };
}

export default applyMaterialTheme;
