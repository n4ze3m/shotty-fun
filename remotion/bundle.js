const {bundle} = require('@remotion/bundler');
const path = require('path');

const main = async () => {
    const bundleLocation = await bundle({
        entryPoint: path.resolve("./src/index.ts"),
        webpackOverride: (config) => config,
        outDir: path.resolve("./dist"),
      });

      console.log(bundleLocation);
}

main();