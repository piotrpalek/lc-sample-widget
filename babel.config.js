module.exports = {
  ignore: [
    /\/core-js/,
  ],

  sourceType: "unambiguous",

  presets: [
    [
      "@babel/env",
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
          ie: "11",
        },
        useBuiltIns: "usage",
        modules: false
      },
    ],
  ]
}