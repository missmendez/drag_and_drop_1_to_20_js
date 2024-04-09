// https://javascript.info/mouse-drag-and-drop
// https://javascript.info/pointer-events

function playFireworks() {
  setTimeout(() => {
    confetti({
      particleCount: 77,
      spread: 70,
      origin: { x: 0.50, y: 0.6 },
    });
  }, 0);
}

function lerp(s, e, t) {
  if (t < 0) t = 0;
  if (t > 1) t = 1;
  return s + (e - s) * t;
}

function makeDraggable(elem, isTheCorrectValue) {
  elem.ondragstart = () => false;

  elem.beingDraggedByPointer = undefined;

  elem.onpointerdown = function(event) {
    if (elem.beingDraggedByPointer != undefined) return false;

    // retarget all pointer events (until pointerup) to elem
    elem.setPointerCapture(event.pointerId);
    elem.beingDraggedByPointer = event.pointerId;

    let originalLeft = elem.getBoundingClientRect().left;
    let originalTop = elem.getBoundingClientRect().top;
    elem.style.left = originalLeft + 'px';
    elem.style.top = originalTop + 'px';
    elem.style.position = 'absolute';
    elem.style.zIndex = 1000;
    // document.body.append(elem);

    let lastTimestamp = document.timeline.currentTime / 1000;
    let evt = event;
    // console.log(originalLeft, originalTop);

    let req = requestAnimationFrame(move);

    function isOverRightSpotAndItsThisBoxsTurn(x, y) {
      return false;
    }

    function hightlightBoxOverCursor(x, y) {
      elem.hidden = true;
      let elemBelow = document.elementFromPoint(x, y);
      elem.hidden = false;

      if (elemBelow.matches(".grid .col")) {
        elemBelow.classList.add("mouseoverHighlight");
      } else {
        // clear all mouse over highlights
        for (x of document.querySelectorAll(".mouseoverHighlight")) {
          x.classList.remove("mouseoverHighlight");
        }
      }
    }

    function move(currentTimestamp) {
      let currentLeft = elem.getBoundingClientRect().left;
      let currentTop = elem.getBoundingClientRect().top;

      let newLeft = evt.clientX - elem.getBoundingClientRect().width/2;
      let newTop = evt.clientY - elem.getBoundingClientRect().height/2;

      // let currentTimestamp = document.timeline.currentTime / 1000;
      currentTimestamp /= 1000;
      let timeDiff = currentTimestamp - lastTimestamp;

      elem.style.left = lerp(currentLeft, newLeft, timeDiff * 20) + 'px';
      elem.style.top = lerp(currentTop, newTop, timeDiff * 20) + 'px';

      hightlightBoxOverCursor(evt.clientX, evt.clientY);

      if (isOverRightSpotAndItsThisBoxsTurn(evt.clientX, evt.clientY)) {
      } else {
      }

      lastTimestamp = currentTimestamp;
      if (Math.abs(newLeft - currentLeft) > 0.1 || Math.abs(newTop - currentTop) > 0.1) {
        req = requestAnimationFrame(move);
      }
    }

    function moveBack(currentTimestamp) {
      let currentLeft = elem.getBoundingClientRect().left;
      let currentTop = elem.getBoundingClientRect().top;

      let newLeft = originalLeft;
      let newTop = originalTop;

      // let currentTimestamp = document.timeline.currentTime / 1000;
      currentTimestamp /= 1000;
      let timeDiff = currentTimestamp - lastTimestamp;

      elem.style.left = lerp(currentLeft, newLeft, timeDiff * 20) + 'px';
      elem.style.top = lerp(currentTop, newTop, timeDiff * 20) + 'px';

      lastTimestamp = currentTimestamp;
      if (Math.abs(newLeft - currentLeft) > 0.1 || Math.abs(newTop - currentTop) > 0.1) {
        req = requestAnimationFrame(moveBack);
      } else {
        // clean up
        elem.style.position = 'static';
        elem.style.zIndex = 'auto';
        elem.beingDragged = false;
        elem.beingDraggedByPointer = undefined;
      }
    }

    function moveToBlank(currentTimestamp) {
      let currentLeft = elem.getBoundingClientRect().left;
      let currentTop = elem.getBoundingClientRect().top;

      let blank = document.getElementById("blank").getBoundingClientRect();
      let newLeft = blank.left;
      let newTop = blank.top;

      // let currentTimestamp = document.timeline.currentTime / 1000;
      currentTimestamp /= 1000;
      let timeDiff = currentTimestamp - lastTimestamp;

      elem.style.left = lerp(currentLeft, newLeft, timeDiff * 5) + 'px';
      elem.style.top = lerp(currentTop, newTop, timeDiff * 5) + 'px';

      document.getElementById("blank").classList.remove("highlight");

      lastTimestamp = currentTimestamp;
      if (Math.abs(newLeft - currentLeft) > 1 || Math.abs(newTop - currentTop) > 1) {
        req = requestAnimationFrame(moveToBlank);
      } else {
        // clean up
        elem.classList.add("hidden");
        document.getElementById("blank").innerHTML = elem.innerText;
        document.getElementById("blank").classList.add("solved");
        playFireworks();
      }
    }

    // start tracking pointer moves
    elem.onpointermove = function(event) {
      if (elem.beingDraggedByPointer != event.pointerId) return false;

      evt = event;
      cancelAnimationFrame(req);
      req = requestAnimationFrame(move);
    };

    // on pointer up finish tracking pointer moves
    elem.onpointerup = function(event) {
      if (elem.beingDraggedByPointer != event.pointerId) return false;

      elem.onpointermove = null;
      elem.onpointerup = null;
      // ...also process the "drag end" if needed
      cancelAnimationFrame(req);
      lastTimestamp = document.timeline.currentTime;

      // clear all mouse over highlights
      for (x of document.querySelectorAll(".mouseoverHighlight")) {
        x.classList.remove("mouseoverHighlight");
      }

      if (isTheCorrectValue && isOverRightSpotAndItsThisBoxsTurn(event.clientX, event.clientY)) {
        req = requestAnimationFrame(moveToBlank);
      } else {
        req = requestAnimationFrame(moveBack);
      }
    };
  };
}

document.addEventListener("DOMContentLoaded", (e) => {
  for (elem of document.querySelectorAll(".options .col")) {
    makeDraggable(elem, false);
  }
});