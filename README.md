# vscode-miniprettier

A minimalist zero config plugin for running Prettier in VSCode. It was inspired by my [own plugin for Atom][atom-miniprettier].

- no ESLint/TSLint/Stylelint integration
- zero config (you can set default options to format in projects that don't use Prettier or in independent files)

If you need those features, it's recommended to use the great [prettier-vscode]. 

## Installation

Just install through VSCode extensions, searching for "Prettier - Minimalist plugin".

## Which Prettier it uses

The extension will follow this order to find which Prettier version to use:

- in the `node_modules` of the workspace folder of the current file
- a version of Prettier installed globally
- the bundled Prettier version included in the extension

## Prettier options

If Prettier is installed in the workspace folder, the extension will use the options from the config file, via [`prettier.resolveConfig`][prettierResolveConfig] API. If no config file is found, it's meant to express that Prettier should just use its default options.

If Prettier is not installed (so it uses a globally installed version, or the bundled version), the extension won't try to find a config file and will fallback to the extensions settings.

These options can be configured with the `prettier.defaultOptions` setting:

```json
{
  "prettier.defaultSettings": {
    "singleQuote": true,
    "printWidth": 100,
    "trailingComma": "all"
  }
}
```

(see Prettier's [available options][prettieroptions])

This extensions won't try to guess which `parser` to use or anything, it relies on Prettier's own inference based on the file extension.

## Credits

Thanks to @t9md for inspiration in [mprettier].

## License

[MIT](./License)

[atom-miniprettier]: https://github.com/duailibe/atom-miniprettier
[mprettier]: https://github.com/t9md/mprettier
[prettier-vscode]: https://github.com/prettier/prettier-vscode
[prettieroptions]: https://prettier.io/docs/en/options.html
[prettierresolveconfig]: https://prettier.io/docs/en/api.html#prettierresolveconfigfilepath-options
