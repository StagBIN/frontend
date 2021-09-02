import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Tahoma, Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.1s linear;
  }

  .wmde-markdown code[class*="language-"], .wmde-markdown pre[class*="language-"] {
    color: ${({ theme }) => theme.text};
  }

  .wmde-markdown pre code {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
  `;
