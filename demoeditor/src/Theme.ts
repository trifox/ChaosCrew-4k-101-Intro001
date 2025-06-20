import { defaultTheme } from 'react-admin';

export const theme = {
    ...defaultTheme,
    palette: {
        mode: 'light'
    },
    components: {
        ...defaultTheme.components,
        MuiTextField: {
            styleOverrides: {
                root: {
                    padding: '0px'
                }
            },
            defaultProps: {
                variant: 'outlined' as const
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                }
            },
            defaultProps: {
                variant: 'outlined' as const,
                margin: 'none' as const
            },
        },
    }
};