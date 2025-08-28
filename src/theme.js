import { teal } from "@mui/material/colors";
import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
// Create a theme instance.
const theme = extendTheme({
  trelloCustom: {
    appBarHeight: "70px",
    boardBarHeight: "58px",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: {
          main: "#fff",
        },
        third: {
          main: "#ff0000",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#fff",
        },
        secondary: {
          main: "#414141ff",
        },
      },
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        className: "default-button-class",
        style: { marginTop: 8, textTransform: "none" },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          // "&:hover": {
          //   ".MuiOutlinedInput-notchedOutline": {
          //     borderColor: theme.pnpm list @mui/materialalette.primary.main,
          //   },
          // },
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          // ".MuiOutlinedInput-notchedOutline": {
          //   borderColor: theme.palette.primary.main,
          // },
          "&:hover": {
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
        }),
      },
    },
  },
});

export default theme;
