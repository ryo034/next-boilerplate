## インストール

```bash
$ npx create-next-app next-ts src
$ yarn run dev
```

## TypeScript 対応

```bash
$ yarn add -D typescript @types/react @types/react-dom @types/node
```

## scss

```bash
$ yarn add sass @zeit/next-sass node-sass
```

next.config.js

```js
const path = require("path");
const withSass = require("@zeit/next-sass");

module.exports = withSass({
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
  env: {
    TEST_VAR: process.env.TEST_VAR,
  },
  cssModules: true,
});
```

## フォーマッターなど

### ESLint

```bash
# ESLintをインストール
$ yarn add -D eslint
# ESLintとPrettierを連携
$ yarn add -D eslint-plugin-prettier eslint-config-prettier
# 規約
$ yarn add -D eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react babel-eslint
# TypeScript対応
$ yarn add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

まとめてインストール

```bash
$ yarn add -D eslint eslint-plugin-prettier eslint-config-prettier eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react babel-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### Prettier

```bash
# Prettierをインストール
$ yarn add -D prettier
```

### StyleLint

```bash
# StyleLintをインストール
$ yarn add -D stylelint
# StylelintとPrettierを連携
$ yarn add -D stylelint-prettier stylelint-config-prettier
# scss対応
$ yarn add -D stylelint-scss
# 設定
$ yarn add -D stylelint-config-standard
# 並び順
$ yarn add -D stylelint-order stylelint-config-recess-order
```

まとめてインストール

```bash
$ yarn add -D stylelint stylelint-prettier stylelint-config-prettier stylelint-scss stylelint-config-standard stylelint-order stylelint-config-recess-order
```

## 全部まとめて

```bash
$ yarn add -D typescript @types/react @types/react-dom @types/node sass @zeit/next-sass node-sass eslint eslint-plugin-prettier eslint-config-prettier eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react babel-eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier stylelint stylelint-prettier stylelint-config-prettier stylelint-scss stylelint-config-standard stylelint-order stylelint-config-recess-order
```

## material-ui

```bash
$ yarn add @material-ui/core
```

`material-ui`が SSR できないらしいので、SSR に対応できるように設定する

```bash
$ yarn add --dev babel-plugin-styled-components
```

.babelrc

```
{
  "presets": [ "next/babel" ],
  "plugins": [
    [
      "styled-components", { "ssr": true, "displayName": true, "preprocess": false }
    ]
  ]
}
```

\_app.tsx

```tsx
import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { ThemeProvider as MaterialUIThemeProvider } from "@material-ui/core/styles";
import { StylesProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Layout from "./components/page/layout";
import theme from "./components/theme";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <StylesProvider injectFirst>
      <MaterialUIThemeProvider theme={theme}>
        <StyledComponentsThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StyledComponentsThemeProvider>
      </MaterialUIThemeProvider>
    </StylesProvider>
  );
};

export default MyApp;
```

pages/\_document.tsx

```tsx
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import { ServerStyleSheet as StyledComponentSheets } from "styled-components";
import { ServerStyleSheets as MaterialUiServerStyleSheets } from "@material-ui/styles";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const styledComponentSheets = new StyledComponentSheets();
    const materialUiServerStyleSheets = new MaterialUiServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            styledComponentSheets.collectStyles(
              materialUiServerStyleSheets.collect(<App {...props} />)
            ),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {styledComponentSheets.getStyleElement()}
            {materialUiServerStyleSheets.getStyleElement()}
          </>
        ),
      };
    } finally {
      styledComponentSheets.seal();
    }
  }

  render() {
    return (
      <Html lang="ja">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```
