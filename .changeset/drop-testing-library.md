---
"@gaia-react/lint": major
---

Removed: the `testing-library` block and the `eslint-plugin-testing-library` dependency. GAIA tests run in Vitest browser mode (`vitest-browser-react`, `page` locators), where Testing Library's rules no longer apply and `prefer-screen-queries` false-positives on `page.getByRole`. Delete any `eslint-disable` comments that name a `testing-library/*` rule. The jest-dom rules stay, because stories still assert with the jest-dom matchers that `storybook/test` re-exports.
