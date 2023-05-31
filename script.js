main();
function main() {
  choicedivGenerate();
  btnsubmit().then(() => {
    createtransdiv();
    hideChoice();
    failurecounterCreatediv();
  });
}

function choicedivGenerate() {
  let choicediv = document.createElement("div");
  choicediv.classList.add("choicediv");
  console.log(choicediv.innerHTML);
  let parent = document.querySelector(
    ".container-sm.d-flex.flex-column.justify-content-center"
  );
  console.log(parent);
  parent.appendChild(choicediv);
  let myform = document.querySelector("form");

  choicediv.appendChild(myform);
  myform.classList.remove("d-none");
}

function btnsubmit() {
  return new Promise((resolve) => {
    let btn = document.querySelector(".btn.btn-primary");
    btn.addEventListener("click", () => {
      selectradio()
        .then((rdvalue) => decide(rdvalue))
        .then(([x, y]) => boardGenerate([x, y]))
        .then((cards) => appendBackofCards(cards))
        .then((cards) => cardsEventListener(cards));
      resolve();
    });
  });
}

function selectradio() {
  return new Promise((resolve) => {
    console.log("i clicked the button and selected the radio");
    let chosenvalue = document.querySelector(
      'input[ name="flexRadioDefault"]:checked'
    ).value;
    console.log(`from select radio`);
    console.log(chosenvalue);
    resolve(chosenvalue);
  });
}

function decide(radiovalue) {
  return new Promise((resolve) => {
    let noofrows,
      noofcols = 3;

    console.log(typeof radiovalue);
    if (radiovalue === "1") {
      noofrows = 2;
    } else if (radiovalue === "2") {
      noofrows = 4;
    } else {
      noofrows = 6;
    }
    console.log("from decide");
    console.log([noofrows, noofcols]);

    resolve([noofrows, noofcols]);
  });
}
function boardGenerate([nr, nc]) {
  return new Promise((resolve) => {
    let cards = [];
    for (let i = 0; i < nr; i++) {
      let myrow = document.createElement("div");
      myrow.classList.add(
        "row",
        "align-content-center",
        "flex-fill",
        "justify-content-center"
      );
      let mycontainer = document.body.querySelector(
        ".container-sm.d-flex.flex-column.justify-content-center"
      );

      mycontainer.appendChild(myrow);
      for (let j = 0; j < nc; j++) {
        cards.push(appendcardtorow(myrow, nc));
      }
    }
    console.log("from board generator");
    console.log(cards);
    resolve(cards);
  });
}
function appendcardtorow(r, no) {
  let mycard = document.createElement("div");
  mycard.classList.add("col-3", "m-1");
  r.appendChild(mycard);
  appendfrbk(mycard);
  return mycard;
}
function appendfrbk(card) {
  let front = document.createElement("div");
  front.classList.add("front", "setbgfront");
  let back = document.createElement("div");
  back.classList.add("back");
  card.append(front, back);
}

function createtransdiv() {
  let mydiv = document.createElement("div");
  mydiv.classList.add("transdiv");
  document.body.appendChild(mydiv);
}

function cardsEventListener(arr) {
  let flipCounter = {
      value: 0,
    },
    wincounter = {
      value: 0,
    },
    failurecounter = {
      value: 0,
    };
  let prevcard; // define prevcard as a local variable
  arr.forEach((element) => {
    element.addEventListener("click", () => {
      // call flipdecide and pass the current event, flipCounter, and prevcard
      prevcard = flipdecide(
        event,
        flipCounter,
        failurecounter,
        wincounter,
        prevcard
      );
      console.log(`fail counter=${failurecounter.value}`);
      updateFailures(failurecounter.value);
      WinCounterCheck(wincounter.value, arr.length);
    });
  });
}

function flipdecide(event, fc, failc, winc, prevcard) {
  fc.value++; // increment the flipCounter value
  let currcard = event.target.parentElement; // get the current card element
  if (fc.value % 2 == 0) {
    // if the flipCounter is even, call evenchoice with the current and previous cards
    evenchoice(currcard, prevcard, failc, winc);
  } else {
    // if the flipCounter is odd, call oddchoice with the current card and update prevcard
    prevcard = oddchoice(currcard);
  }
  return prevcard; // return the updated prevcard value
}

function oddchoice(curr) {
  rotate(curr); // rotate the current card
  return curr; // return the updated current card as the new prevcard
}

function evenchoice(curr, prev, miss, win) {
  disableclick(); // disable clicking onthe cards

  if (curr.getAttribute("imgvalue") === prev.getAttribute("imgvalue")) {
    // if the current and previous cards have the same image value, rotate the current card
    rotate(curr);
    console.log("iam even equal");
    console.log(curr);
    console.log(prev);
    win.value += 2;
    console.log(win.value);
  } else {
    // if the current and previous cards have different image values, reverse rotate both cards
    console.log("iam even notequal");
    revrotate(curr);
    revrotate(prev);
    miss.value++;
  }
  setTimeout(() => {
    enableclick();
  }, 500);
}

function disableclick() {
  let mydiv = document.querySelector(".transdiv");
  mydiv.classList.add("d-block");
}

function appendBackofCards(cardarr) {
  return new Promise((resolve) => {
    let noofcards = cardarr.length;
    createindxOfBack(noofcards)
      .then((indarr) => shuffleindxes(indarr))
      .then((indarr) => setindxAttribute(indarr, cardarr));
    resolve(cardarr);
  });
}

function createindxOfBack(nc) {
  return new Promise((resolve) => {
    let imgs = [];
    let imgindex = 1;

    for (let i = 0; i < nc; i += 2) {
      if (imgindex > 4) {
        imgindex = 1;
      }
      imgs[i] = imgindex;
      imgs[i + 1] = imgindex;
      imgindex++;
    }
    resolve(imgs);
  });
}

function shuffleindxes(imgs) {
  return new Promise((resolve) => {
    for (let i = imgs.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));

      [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
    }
    resolve(imgs);
  });
}

function setindxAttribute(indexarr, cards) {
  for (let i = 0; i < indexarr.length; i++) {
    cards[i].setAttribute("imgvalue", `${indexarr[i]}`);

    cards[i].children[1].style.cssText = `
      background: url("logos/photo-0${indexarr[i]}.jpg") center no-repeat;
      background-size: cover;
    `;
  }
}
function rotate(e) {
  e.classList.add("rotate");
}

function revrotate(e) {
  rotate(e);
  setTimeout(() => {
    console.log("i am herr");
    e.classList.remove("rotate");
  }, 500);
}
function enableclick() {
  let mydiv = document.querySelector(".transdiv");
  console.log("i enabled");
  mydiv.classList.remove("d-block");
}
function hideChoice() {
  let choicediv = document.querySelector(".choicediv");
  choicediv.classList.add("d-none");
}

function failurecounterCreatediv() {
  let mynav = document.querySelector(".navbar.navbar-expand-sm");
  let refernce = document.querySelector(".collapse.navbar-collapse");
  let failurecont = document.createElement("div");
  failurecont.classList.add(
    "failurecounter",
    "text-light",
    "mo-gradient",
    "text-lead"
  );
  failurecont.innerText = "no of fails=  0";
  mynav.insertBefore(failurecont, refernce);
}

function updateFailures(x) {
  let failurecont = document.querySelector(".failurecounter");
  failurecont.innerText = `no of fails=  ${x}`;
}

function WinCounterCheck(x, len) {
  if (x == len) {
    dimBoard();
    Displaywinmsg();
  }
}

function dimBoard() {
  let boardrows = document.querySelectorAll(
    ".row.align-content-center.flex-fill.justify-content-center"
  );
  boardrows.forEach((element) => {
    element.style.transition = "opacity 0.5s ease-in-out"; // transition property added
    element.style.opacity = "0.1"; // changed opacity value to decimal form
  });
}

function Displaywinmsg() {
  let windiv = document.createElement("div");
  windiv.classList.add("windiv", "text-light", "lead", "container-sm");
  windiv.innerText = "congrats u won";
  let parent = document.querySelector(".container-fluid.d-flex.flex-column");
  parent.appendChild(windiv);
}
