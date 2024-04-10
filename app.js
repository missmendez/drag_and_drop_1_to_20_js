// https://javascript.info/mouse-drag-and-drop
// https://javascript.info/pointer-events

let currentNum = 1;

function restart() {
  currentNum = 1;

  let options = [
    `<div class="optionContainer"> <div id="option1" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 1 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option2" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 2 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option3" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 3 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option4" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 4 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option5" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 5 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option6" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 6 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option7" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 7 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option8" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 8 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option9" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 9 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option10" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 10 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option11" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 11 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option12" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 12 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option13" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 13 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option14" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 14 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option15" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 15 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option16" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 16 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option17" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 17 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option18" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 18 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option19" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 19 </text> </svg> </div> </div>`,
    `<div class="optionContainer"> <div id="option20" class="col"> <svg width="100%" height="100%"> <text x="50%" y="50%"> 20 </text> </svg> </div> </div>`,
  ];

  function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

  shuffle(options);

  let row1 = "";
  for (let i = 0; i < 10; i++) row1 += options[i];
  let row2 = "";
  for (let i = 10; i < 20; i++) row2 += options[i];

  document.getElementById("row1").innerHTML = row1;
  document.getElementById("row2").innerHTML = row2;

  for (elem of document.querySelectorAll(".options .col")) {
    makeDraggable(elem);
  }

  for (elem of document.querySelectorAll(".darker")) elem.classList.remove("darker");
  for (elem of document.querySelectorAll(".highlighted")) elem.classList.remove("highlighted");

  document.getElementById("blank1").classList.add("highlighted");
  document.getElementById("blank1").classList.add("darker");
}

function nextNum() {
  document.querySelectorAll(".col.highlighted")[0].classList.remove("highlighted");

  currentNum++;

  if (currentNum <= 20) {
    document.getElementById("blank" + currentNum).classList.add("highlighted", "darker")
  } else {
    playFireworks();
  }
}


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

function makeDraggable(elem) {
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
      elem.hidden = true;
      let elemBelow = document.elementFromPoint(x, y);
      elem.hidden = false;
      let elemNum = elem.id.split("option")[1];
      let blankNum = elemBelow.id.split("blank")[1];
      let res = elemBelow.matches(".grid .col.highlighted") && elemNum == blankNum;
      // console.log(res);

      return res;
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

      let blank = document.querySelectorAll(".grid .col.highlighted")[0].getBoundingClientRect();
      let newLeft = blank.left + (blank.width - elem.getBoundingClientRect().width)/2;
      let newTop = blank.top + (blank.height - elem.getBoundingClientRect().height)/2;

      // let currentTimestamp = document.timeline.currentTime / 1000;
      currentTimestamp /= 1000;
      let timeDiff = currentTimestamp - lastTimestamp;

      elem.style.left = lerp(currentLeft, newLeft, timeDiff * 20) + 'px';
      elem.style.top = lerp(currentTop, newTop, timeDiff * 20) + 'px';

      lastTimestamp = currentTimestamp;
      if (Math.abs(newLeft - currentLeft) > 1 || Math.abs(newTop - currentTop) > 1) {
        req = requestAnimationFrame(moveToBlank);
      } else {
        // clean up
        elem.classList.add("completed");

        // get ready for next move
        nextNum();
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

      if (isOverRightSpotAndItsThisBoxsTurn(event.clientX, event.clientY)) {
        req = requestAnimationFrame(moveToBlank);
      } else {
        req = requestAnimationFrame(moveBack);
      }
    };
  };
}

function resizeToFit() {
   function isElementInViewPort(element){
    let rect = element.getBoundingClientRect();
    // get the height of the window
    let viewPortBottom = window.innerHeight || document.documentElement.clientHeight;
    // get the width of the window
    let viewPortRight = window.innerWidth || document.documentElement.clientWidth;
  
    let isTopInViewPort = rect.top >= 0,
        isLeftInViewPort = rect.left >= 0,
        isBottomInViewPort = rect.bottom <= viewPortBottom,
        isRightInViewPort = rect.right <= viewPortRight;
  
    // check if element is completely visible inside the viewport
    return (isTopInViewPort && isLeftInViewPort && isBottomInViewPort && isRightInViewPort);
  }

  function allVisible() {
    for (elem of document.querySelectorAll(".col")) {
      if (!isElementInViewPort(elem)) return false;
    }

    return true;
  }

  let vw = 4.5;
  let vh = 6;
  document.getElementsByTagName("main")[0].style.fontSize = `min(${vw}vw, ${vh}vh)`;

  if (!allVisible()) {
    while (!allVisible()) {
      vw *= 0.95;
      vh *= 0.95;
      document.getElementsByTagName("main")[0].style.fontSize = `min(${vw}vw, ${vh}vh)`;
    }

    vw *= 0.9;
    vh *= 0.9;
    document.getElementsByTagName("main")[0].style.fontSize = `min(${vw}vw, ${vh}vh)`;
  }
}

function fixAbsolutePositions() {
  for (elem of document.querySelectorAll(".completed")) {
    let n = parseInt(elem.id.split("option")[1]);
    let blank = document.getElementById("blank" + n).getBoundingClientRect();
    let newLeft = blank.left + (blank.width - elem.getBoundingClientRect().width)/2;
    let newTop = blank.top + (blank.height - elem.getBoundingClientRect().height)/2;

    elem.style.left = newLeft + "px";
    elem.style.top = newTop + "px";
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  restart();

  window.screen.orientation.onchange = () => {
    setTimeout(resizeToFit, 1000);
    setTimeout(fixAbsolutePositions, 1500);
  }

  resizeToFit();

  document.getElementById("restartButton").onclick = restart;
});

window.addEventListener("resize", (e) => {
  fixAbsolutePositions();
});