const FALLBACK_FONT_STACK = `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`;

const theme = {
  colors: {
    primary: '#0070f3',
    white: '#ffffff',
    black: '#000000',
    text: {
      black: '#272b2f',
      lightGray: '#718898'
    },
    functional: {
      primary: '#4E608E',
      danger: '#FC686F'
    }
  },
  fonts: {
    sansSerif: {
      default: `'Roboto', ${FALLBACK_FONT_STACK}`,
      roboto: `'Roboto', sans-serif`,
      montserrat: `'Montserrat', sans-serif`
    }
  },
  admin: {
    sideNavWidth: 210
  }
};

export default theme;
