const { initPlugin } = require("cypress-plugin-snapshots/plugin")
const task = require("cypress-skip-and-only-ui")

module.exports = (on, config) => {
  initPlugin(on, config)
  on("task", task)
  return config
}
