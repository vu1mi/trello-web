import { teal } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
const APP_BAR_HEIGHT = '58px';
const BOARD_BAR_HEIGHT = '60px';
const BOARD_CONTENT_HEIGHT = `calc( 100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`;
const COLUMN_HEADER_HEIGHT = '50px';
const COLUMN_FOOTER_HEIGHT = '50px';
const theme = createTheme({
  trelloCustom: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    column_header_height: COLUMN_HEADER_HEIGHT,
    column_footer_height: COLUMN_FOOTER_HEIGHT,
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: teal[500], blank: '#d7f9f6', lightbold: '#98f1e8' },
        secondary: { main: '#fff' },
        bgcolor: { main: '#1976d2' },
  
        input:{
          outline:'blue'
        },
          text: {
            primary: '#000',
            secondary: '#666',
            title: '#1976d2',
          },
      },
    },
    dark: {
      palette: {
        primary: { main: '#fff' },
        secondary: { main: '#b0b0b0' },
         bgcolor: { main: '#34495e' },
         input:{
          outline:'#fff'
        },
          text: {
            primary: '#ffffff',
            secondary: '#dcdcdc',
            title: '#1976d2',
          },
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          marginTop: 8,
          textTransform: 'none',
          borderWidth: 0.5,
          '&:hover ': {
            borderWidth: 1,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {},
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.input.outline,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.input.outline
          },
          '.Mui-focused  .MuiOutlinedInput-notchedOutline':{
            borderColor: theme.palette.input.outline
          }


        }),
      },
    },
  },
});

export default theme;
