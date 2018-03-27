import blue from 'material-ui/colors/blue'
import { createMuiTheme } from 'material-ui/styles'
import red from 'material-ui/colors/red'
export const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#8187ff',
            main: '#3d5afe',
            dark: '#0031ca',
            contrastText: '#fff',
        },
        secondary: {
            light: '#83ffff',
            main: '#3dfee1',
            dark: '#00caaf',
            contrastText: '#000000',
        },
    },
});