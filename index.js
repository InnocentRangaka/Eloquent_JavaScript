import { PictureCanvas } from './scripts/pictureCanvas.js'
import { Picture, elt } from './scripts/picture.js'
import { baseTools, ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton } from './scripts/controls.js'
import { draw, rectangle, fill, pick } from './scripts/drawing.js'

const startState = {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
  done: [],
  doneAt: 0
};

const baseControls = [ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton];

function historyUpdateState(state, action) {
  if (action.undo == true) {
    if (state.done.length == 0) return state;
    return {
      ...state,
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0
    };
  } else if (action.picture && state.doneAt < Date.now() - 1000) {
    return {
      ...state,
      ...action,
      done: [state.picture, ...state.done],
      doneAt: Date.now()
    };
  } else {
    return { ...state, ...action };
  }
}

class PixelEditor {
  constructor(state, config) {
    let { tools, controls, dispatch } = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return pos => onMove(pos, this.state);
    });

    this.controls = controls.map(
      Control => new Control(state, config)
    );

    this.dom = elt("div", {}, this.canvas.dom, elt("br"),
      ...this.controls.reduce(
        (a, c) => a.concat(" ", c.dom), []
      ));
  }

  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}

function startPixelEditor({ state = startState, tools = baseTools, controls = baseControls }) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    }
  });

  return app.dom;
}

const pixelEditorElement = document.body.querySelector("#PixelEditor")

pixelEditorElement.appendChild(startPixelEditor({}));
const canvasElement = pixelEditorElement.querySelector('canvas');
canvasElement.setAttribute('width', '600px');
canvasElement.setAttribute('height', '300px');
canvasElement.setAttribute('style', 'color: #f0f0f0');


////////////// Testing /////////////////////////
