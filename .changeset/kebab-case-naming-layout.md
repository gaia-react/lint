---
"@gaia-react/lint": major
---

Breaking: the `styleHygiene` naming rules now enforce GAIA's kebab-case layout. Component and page folders are kebab-case, `components/ui/` holds flat kebab-case component files with `tests/` as its only subfolder, a route page is `pages/<path>/page.tsx` exporting `<Name>Page`, and hook files are `use-*.ts`. `canonical/filename-match-exported` applies a kebab transform to component and page `.tsx` files, so `theme-switch/index.tsx` exports `ThemeSwitch`; everywhere else it keeps exact matching. PascalCase component folders and camelCase hook files now fail lint, so rename them before upgrading.
