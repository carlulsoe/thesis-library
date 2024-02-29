type SimplifiedTouch = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type SimplifiedTouchEvent = {
  ctrlKey: boolean;
  touches: SimplifiedTouch[];
};

function simplifyTouchEvent(event: TouchEvent) {
  let touchList: SimplifiedTouch[] = [];
  for (let i = 0; i < event.touches.length; i++) {
    let item = event.touches.item(i)!;
    touchList[i] = {
      w: item.radiusX,
      h: item.radiusY,
      x: item.clientX - item.radiusX / 2,
      y: item.clientY - item.radiusY / 2,
    };
  }

  const simplifiedTouchEvent: SimplifiedTouchEvent = {
    ctrlKey: event.ctrlKey,
    touches: touchList,
  };
  return simplifiedTouchEvent;
}

function draw(touch: SimplifiedTouch, context: CanvasRenderingContext2D) {
  context.beginPath();
  context.arc(
    touch.x + touch.w / 2,
    touch.y + touch.h / 2,
    Math.max(touch.w, touch.h) / 2,
    0,
    2 * Math.PI
  );
  context.fill();
}

export function handleTouches(
  event: TouchEvent,
  context: CanvasRenderingContext2D
) {
  let simpleTouchEvent = simplifyTouchEvent(event);
  draw(simpleTouchEvent.touches[0]!, context);
}
