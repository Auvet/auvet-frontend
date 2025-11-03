import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from '@/contexts/AuthContext';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

const theme = createTheme({
  primaryColor: 'brand',
  fontFamily: 'Poppins, sans-serif',
  fontFamilyMonospace: 'Poppins, monospace',
  headings: {
    fontFamily: 'Poppins, sans-serif',
  },
  colors: {
    brand: ['#fde7dc','#fbd1be','#f9bba1','#f7a584','#f58f67','#f47a4b','#f87537','#e06c32','#c8612d','#b15628'],
    accent: ['#fff8e6','#ffefc7','#ffe5a9','#ffdc8a','#ffd26c','#ffc94d','#ffbf2f','#e6aa2a','#cc9625','#b38220'],
  },
  components: {
    Button: {
      defaultProps: { color: 'brand' },
    },
    TextInput: {
      defaultProps: { radius: 'md' },
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Elemento root não encontrado');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);


