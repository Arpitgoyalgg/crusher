const path = require("path");
const VirtualModulesPlugin = require("webpack-virtual-modules");
const injectedScriptSource = require("playwright-core/lib/generated/injectedScriptSource");

const virtualModules = new VirtualModulesPlugin({
	"node_modules/playwright-evaluator.js": `
  let pwQuerySelector;
  (() => {
    ${injectedScriptSource.source}
    const injected = new pwExport(1, false, []);
    window.injected = injected;
    pwQuerySelector = (selector, root) => {
      const parsed = injected.parseSelector(selector);
      return injected.querySelector(parsed, root);
    };
  })();
  module.exports = { querySelector: pwQuerySelector };`,
});

module.exports = {
	entry: "./src/index.ts",
	target: "web",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	plugins: [virtualModules],
};
