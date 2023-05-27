//----------dynamic generation of one row inside container-----------------
let mycontainer = document.body.querySelector(
  ".container-sm.d-flex.flex-column.justify-content-center"
);

function generaterow(x, y) {
  for (let i = 0; i < x; i++) {
    console.log(`row${i}`);
    let myrow = document.createElement("div");
    myrow.classList.add(
      "row",
      "align-content-center",
      "flex-fill",
      "justify-content-center"
    );
    mycontainer.appendChild(myrow);
    for (let j = 0; j < y; j++) {
      appendcardtorow(myrow, y);
      console.log(`card${j}`);
    }
  }
}

//-------------------dynamic generation of cards inside row----------------
function appendcardtorow(r, no) {
  let mycard = document.createElement("div");
  mycard.classList.add("col-3", "m-1");
  r.appendChild(mycard);
  appendfrbk(mycard);
}

//-------caliing of generation fns----------
generaterow(6, 3);

//--------appending front and back faces to cards--------------
function appendfrbk(card) {
  let front = document.createElement("div");
  front.classList.add("front", "setbgfront");
  let back = document.createElement("div");
  back.classList.add("back");
  card.append(front, back);
}

//select all cards
let cards = document.querySelectorAll(".row .col-3 ");

//-------------randomly distibute 4 imgs across back face------------------

let noofimgs = 4;
let noofcards = 18;
//1- creating array of indesxes of 12 photos
let imgs = [];
let imgindex = 1;
for (let i = 0; i < noofcards; i += 2) {
  if (imgindex > noofimgs) {
    imgindex = 1;
  }
  imgs[i] = imgindex;
  imgs[i + 1] = imgindex;
  imgindex++;
}

//2-randomly distributing indexes (shuffling)

for (let i = imgs.length - 1; i > 0; i--) {
  let j = Math.floor(Math.random() * (i + 1));

  [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
}

//3-placing imgs in back faces and putting index of img as atttribute for cards
for (let i = 0; i < imgs.length; i++) {
  cards[i].setAttribute("imgvalue", `${imgs[i]}`);

  cards[i].children[1].style.cssText = `
  background: url("logos/photo-0${imgs[i]}.jpg") center no-repeat;
  background-size: cover;
`;
}

//---------implementing logic of game---------------
let flipcounter = 0;
let curr;
let prev;
let mydiv;
createtransdiv();
for (let i = 0; i < noofcards; i++) {
  cards[i].addEventListener("click", function () {
    curr = this;
    console.log(curr);
    console.log(prev);

    flipcounter++;

    flipcountercheck();
    prev = curr;
  });
}
function flipcountercheck() {
  if (flipcounter % 2 == 0) {
    evencheck();
  } else {
    oddcheck();
  }
}

function evencheck() {
  disableclick();
  if (curr.getAttribute("imgvalue") === prev.getAttribute("imgvalue")) {
    rotate(curr);
    console.log("iam even equal");
  } else {
    console.log("iam even notequal");
    revrotate(curr);
    revrotate(prev);
  }
  setTimeout(() => {
    enableclick();
  }, 1000);
}
function rotate(e) {
  e.classList.add("rotate");
}

function revrotate(e) {
  rotate(e);
  setTimeout(() => {
    console.log("i am herr");
    e.classList.remove("rotate");
    enableclick();
  }, 500);
}

function oddcheck() {
  console.log("iam odd");
  rotate(curr);
}

function createtransdiv() {
  mydiv = document.createElement("div");
  mydiv.classList.add("transdiv");
  document.body.appendChild(mydiv);
}

function disableclick() {
  mydiv.style.display = "block";
}

function enableclick() {
  mydiv.style.display = "none";
}
