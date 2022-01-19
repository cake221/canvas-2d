import { JSON_DATA } from "@canvas-2d/canvas-json"

const textData = {
  background: "rgba(162, 211, 255, 0.5)",
  fill: "#606060",
  stroke: "red",
  text: "你h\nh啦fadfdf放到沙发上放到沙发\nfdfdfa\fdfdf",
  font: {
    fontSize: 20
  },
  strokeParam: {
    lineWidth: 2
  },
  shadow: {
    shadowBlur: 5,
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    shadowColor: "rgba(0, 0, 0, 0.8)"
  }
}

export const textJson: JSON_DATA = {
  assets: [],
  layers: [
    {
      type: "text",
      ...textData,
      origin: {
        x: 100,
        y: 100
      }
    },
    {
      type: "paragraph",
      ...textData,
      origin: {
        x: 100,
        y: 200
      },
      width: 100,
      height: 200
    }
  ],
  height: 500,
  width: 500,
  dpr: 10
}
