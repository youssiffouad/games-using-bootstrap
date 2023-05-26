//select all cards
let cards = document.querySelectorAll(".row .col-3 ");
console.log(cards);

//-------------randomly distibute 4 imgs across back face------------------

let noofimgs = 4;
let noofcards = 12;
//1- creating array of indesxes of 12 photos
let imgs = [];
let cuurindx = 1;
for (let i = 0; i < noofcards; i += 2) {
  if (cuurindx > noofimgs) {
    cuurindx = 1;
  }
  imgs[i] = cuurindx;
  imgs[i + 1] = cuurindx;
  cuurindx++;
}

//2-randomly distributing indexes (shuffling)
console.log(imgs);
console.log(imgs.length);
for (let i = imgs.length - 1; i > 0; i--) {
  let j = Math.floor(Math.random() * (i + 1));
  console.log(j);
  [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
}
console.log(imgs);

//3-placing imgs in back faces
for (let i = 0; i < imgs.length; i++) {
  console.log(cards[i].children[1]);
  cards[i].children[1].style.cssText = `
  background: url("logos/photo-0${imgs[i]}.jpg") center no-repeat;
  background-size: cover;
`;
}
