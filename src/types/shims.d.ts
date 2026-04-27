declare module 'eslint-plugin-you-dont-need-lodash-underscore' {
  type LooseRules = Record<string, unknown>;
  const plugin: {
    configs: {
      all: {rules: LooseRules};
      compatible: {rules: LooseRules};
    };
    rules: LooseRules;
  };
  export default plugin;
}
