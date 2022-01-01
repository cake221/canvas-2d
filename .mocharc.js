module.exports = {
  colors: true,
  spec: ["packages/**/__tests__/*.test.ts"],
  reporter: ["mochawesome"],
  require: ["ts-node/register"]
}
