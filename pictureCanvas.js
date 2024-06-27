class PictureCanvas {
    constructor(picture, pointerDown) {
      this.picture = picture;
      this.dom = elt("canvas", {
        onmousedown: event => this.mouse(event, pointerDown),
        ontouchstart: event => this.touch(event, pointerDown)
      });
      this.syncState(picture);
    }
  
    syncState(picture) {
      if (this.picture == picture) return;
      this.picture = picture;
      drawPicture(this.picture, this.dom, scale);
    }
  }
  
  function drawPicture(picture, canvas, scale) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    let cx = canvas.getContext("2d");
    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
  
  function pointerPosition(pos, domNode) {
    let rect = domNode.getBoundingClientRect();
    return { x: Math.floor((pos.clientX - rect.left) / scale), y: Math.floor((pos.clientY - rect.top) / scale) };
  }
  