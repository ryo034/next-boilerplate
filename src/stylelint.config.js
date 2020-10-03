// https://toragramming.com/programming/nuxt-js/nuxt-stylelint-prettier-vscode-format-scss-on-save/
module.exports = {
  extends: [
    // Google や Airbnb のスタイルガイドなどが含まれた一般的なスタイル規則
    'stylelint-config-standard',
    // SCSS 用ルールセット
    // 'stylelint-config-recommended-scss',
    // stylelint-config-で適応したルールとprettierが競合するルールを後ろからオフにする
    // そのためstylelint-prettier/recommendedは必ず最後に記述する
    'stylelint-config-prettier',
    'stylelint-config-recess-order',
    'stylelint-prettier/recommended'
  ],
  rules: {
    'no-descending-specificity': null
  }
};
