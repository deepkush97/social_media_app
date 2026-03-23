const swcDefaultConfig =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory().swcOptions;

export const module = {
  rules: [
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      use: {
        loader: 'swc-loader',
        options: swcDefaultConfig,
      },
    },
  ],
};
