class Card {
  constructor() {
    this.backIndx = -1;
    this.clickedvalue = false;
    this.cardhtml = this.CardCreate();
  }

  clicked(bvalue) {
    this.clickedvalue = bvalue;
    this.cardhtml.setAttribute("clicked", this.clickedvalue);
  }
  setBackindx(no) {
    this.backIndx = no;
    this.cardhtml.setAttribute("imgvalue", this.backIndx);
  }
  CardCreate() {
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("col-3", "m-1");

    cardDiv.setAttribute("clicked", false);
    let front = document.createElement("div");
    front.classList.add("front", "setbgfront");
    cardDiv.appendChild(front);
    let back = document.createElement("div");
    back.classList.add("back");
    cardDiv.appendChild(back);
    return cardDiv;
  }
  rotate() {
    this.cardhtml.classList.add("rotate");
    this.clicked(true);
  }
  revrotate() {
    this.rotate();
    setTimeout(() => {
      console.log("i am herr");
      this.cardhtml.classList.remove("rotate");
    }, 500);
  }
}

class Row {
  constructor(noofcards) {
    this.noofcards = noofcards;
    this.cards = [];
    for (let i = 0; i < noofcards; i++) {
      let card = new Card();
      this.cards.push(card);
    }
    this.rowhtml = this.RowCreate();
  }

  RowCreate() {
    let rowDiv = document.createElement("div");
    rowDiv.classList.add(
      "row",
      "align-content-center",
      "flex-fill",
      "justify-content-center"
    );
    this.cards.forEach((card) => {
      rowDiv.appendChild(card.cardhtml);
    });
    return rowDiv;
  }
  GetcardsInRow() {
    return this.cards;
  }
}

//----------------------gameBoard Class--------------------------------//

class Gameboard {
  constructor() {
    this.winContainer = null;

    this.choiceContainer = new ChoiceClass();

    this.currcard = null;
    this.prevcard = null;
    this.flipcounter = 0;
    this.failurecounter = 0;
    this.wincounter = 0;
  }

  CreateGameBoard(noofrows, noofcols) {
    this.noofcards = noofrows * noofcols;
    this.noofrows = noofrows;
    this.failurecounterContainer = null;
    this.rows = [];
    for (let i = 0; i < noofrows; i++) {
      let row = new Row(noofcols);
      this.rows.push(row);
    }
    this.cards = this.GetcardsInBoard();
    this.currindexes = this.IndexCardCreate();
    this.boardhtml = this.BoardCreate();
    this.choiceContainer.hideChoiceDiv();
  }

  async decideSizeOfBoard() {
    const lvl = await this.choiceContainer.getlevel();
    console.log(lvl);
    console.log(this.choiceContainer);
    if (lvl === "1") {
      this.CreateGameBoard(2, 3);
    } else if (lvl === "2") {
      this.CreateGameBoard(4, 3);
    } else {
      this.CreateGameBoard(6, 3);
    }
  }

  BoardCreate() {
    this.createtransdiv();
    let parentdiv = document.querySelector(
      ".container-sm.d-flex.flex-column.justify-content-center.bg-secondary.gameboard"
    );
    console.log(this.rows);
    this.rows.forEach((row) => {
      parentdiv.appendChild(row.rowhtml);
    });
    this.shuffleCardIndexes();
    this.AssignimgsToCards();
    this.DisplayFailureCounter();
    this.handleClickingOnCards();

    return parentdiv;
  }

  DisplayFailureCounter() {
    let failurecont = document.querySelector(
      ".failurecounter.text-light.mo-gradient.text-lead"
    );
    failurecont.classList.remove("d-none");
    failurecont.innerText = `no of fails=  0`;

    this.failurecounterContainer = failurecont;
    console.log(" i created failure");
  }

  UpdatefailureCounter(x) {
    this.failurecounter = x;
    this.failurecounterContainer.innerText = `no of fails=  ${this.failurecounter}`;
  }
  GetcardsInBoard() {
    let cards = [];
    this.rows.forEach((row) => {
      cards.push(...row.GetcardsInRow());
    });

    return cards;
  }

  IndexCardCreate() {
    let indexes = [];
    let imgindex = 1;

    for (let i = 0; i < this.noofcards; i += 2) {
      if (imgindex > 4) {
        imgindex = 1;
      }
      indexes[i] = imgindex;
      indexes[i + 1] = imgindex;
      imgindex++;
    }
    console.log("IndexCardCreate()");

    return indexes;
  }

  shuffleCardIndexes() {
    for (let i = this.currindexes.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));

      [this.currindexes[i], this.currindexes[j]] = [
        this.currindexes[j],
        this.currindexes[i],
      ];
    }
  }

  AssignimgsToCards() {
    for (let i = 0; i < this.noofcards; i++) {
      this.cards[i].setBackindx(this.currindexes[i]);

      this.cards[i].cardhtml.children[1].style.cssText = `
        background: url("logos/photo-0${this.currindexes[i]}.jpg") center no-repeat;
        background-size: cover;
      `;
    }
  }
  handleClickingOnCards() {
    this.cards.forEach((card) => {
      card.cardhtml.addEventListener("click", () => {
        if (!card.clickedvalue) {
          this.currcard = card;
          this.flipcounter++;
          console.log("i clicked  handleClickingOnCards()");
          console.log(card.cardhtml.getAttribute("clicked"));
          this.flipDecide();
        }
      });
    });
  }

  flipDecide() {
    console.log(` flipDecide() ${this.flipcounter}`);
    if (this.flipcounter % 2 == 0) {
      // if the flipCounter is even, call evenchoice with the current and previous cards
      this.evenchoice();
    } else {
      // if the flipCounter is odd, call oddchoice with the current card and update prevcard
      this.oddchoice();
    }
  }
  evenchoice() {
    this.disableclick();

    console.log(` evenchoice() `);
    console.log(this.currcard.cardhtml);
    console.log(this.prevcard.cardhtml);
    if (this.currcard.backIndx === this.prevcard.backIndx) {
      // if the current and previous cards have the same image value, rotate the current card
      this.currcard.rotate();

      this.wincounter += 2;
      console.log(this.wincounter);
      this.Wincheck();
    } else {
      // if the current and previous cards have different image values, reverse rotate both cards
      console.log("iam even notequal");
      this.currcard.revrotate();
      this.currcard.clicked(false);
      this.prevcard.revrotate();
      this.prevcard.clicked(false);

      this.UpdatefailureCounter(this.failurecounter + 1);
    }
    setTimeout(() => {
      this.enableclick();
    }, 500);
  }

  oddchoice() {
    this.currcard.rotate();
    this.prevcard = this.currcard;
  }

  Wincheck() {
    if (this.wincounter === this.noofcards) {
      this.dimBoard();
      this.winContainer = new WinClass();
      this.playAgain();
    }
  }
  playAgain() {
    let samelvlbtn = this.winContainer.winhtml.children[0];
    console.log(this.winContainer.winhtml);
    console.log(samelvlbtn);

    samelvlbtn.addEventListener("click", this.Revertall.bind(this));
    let selectlvlbtn = this.winContainer.winhtml.children[1];
    console.log(selectlvlbtn);

    selectlvlbtn.addEventListener(
      "click",
      function () {
        this.winContainer.HideWinDiv();
        this.BoardDelete();
        this.choiceContainer.DisplayChoiceDiv();
        this.decideSizeOfBoard();
        this.UpdatefailureCounter(0);
        this.wincounter = 0;
        this.shuffleCardIndexes();
        this.AssignimgsToCards();
        this.undimBoard();
        // this.cards.forEach((card) => {
        //   card.clicked(false);
        // });
      }.bind(this)
    );
  }
  enableclick() {
    let mydiv = document.querySelector(".transdiv");
    console.log("i enabled");
    mydiv.classList.remove("d-block");
  }
  Revertall() {
    console.log(" Revertall(");
    this.winContainer.HideWinDiv();
    this.viewBoard();
    this.enableclick();
    let revcards = document.querySelectorAll(".col-3.m-1.rotate");
    revcards.forEach((element, index) => {
      setTimeout(() => {
        element.classList.remove("rotate");
      }, (index + 1) * 100);
    });

    this.UpdatefailureCounter(0);
    this.wincounter = 0;
    this.shuffleCardIndexes();
    this.AssignimgsToCards();
    this.cards.forEach((card) => {
      card.clicked(false);
    });
  }

  dimBoard() {
    this.boardhtml.style.transition = "opacity 1s ease-in-out"; // transition property added
    this.boardhtml.style.opacity = "0.1"; // changed opacity value to decimal form
  }
  undimBoard() {
    this.boardhtml.style.opacity = "1"; // changed opacity value to decimal form
  }
  BoardDelete() {
    console.log("fdasjf");
    while (this.boardhtml.firstChild) {
      this.boardhtml.removeChild(this.boardhtml.firstChild);
    }
  }
  createtransdiv() {
    let mydiv = document.createElement("div");
    mydiv.classList.add("transdiv");
    document.body.appendChild(mydiv);
  }

  disableclick() {
    let mydiv = document.querySelector(".transdiv");
    mydiv.classList.add("d-block");
  }

  viewBoard() {
    this.boardhtml.style.opacity = "1"; // changed opacity value to decimal form
  }
}

//----------------------Memory Game Container----------------------------------//

// class MemoryGameContainer {
//   constructor() {
//     this.choiceContainer = new ChoiceClass();
//     this.Board = null;
//   }

//   CreateGameBoard(x, y) {
//     let gb = new Gameboard(x, y);
//     this.Board = gb;
//     this.choiceContainer.hideChoiceDiv();
//   }

//   async decideSizeOfBoard() {
//     const lvl = await this.choiceContainer.getlevel();
//     console.log(lvl);
//     console.log(this.choiceContainer);
//     if (lvl === "1") {
//       this.CreateGameBoard(2, 3);
//     } else if (lvl === "2") {
//       this.CreateGameBoard(4, 3);
//     } else {
//       this.CreateGameBoard(6, 3);
//     }
//   }
// }

//-----------------Choice Class------------------------------------------------------//

class ChoiceClass {
  constructor() {
    this.choicehtml = this.DisplayChoiceDiv();
  }
  DisplayChoiceDiv() {
    let choicediv = document.querySelector(".choicediv");
    choicediv.classList.remove("d-none");
    return choicediv;
  }
  hideChoiceDiv() {
    this.choicehtml.classList.add("d-none");
  }
  getlevel() {
    return new Promise((resolve) => {
      let btn = document.querySelector("form .btn.btn-primary");

      btn.addEventListener("click", () => {
        console.log(" i am clicked");
        resolve(this.getselectradio());
      });
    });
  }

  getselectradio() {
    console.log("getselectradio()");
    this.chosenlvl = document.querySelector(
      'input[ name="flexRadioDefault"]:checked'
    ).value;
    console.log(this.chosenlvl);
    return this.chosenlvl;
  }
}

//--------------------------Win Class----------------------------//

class WinClass {
  constructor() {
    this.winhtml = this.DisplayWindiv();
  }
  DisplayWindiv() {
    let windiv = document.querySelector(".windiv");

    windiv.classList.remove("hide");
    // windiv.classList.add("display");
    return windiv;
  }
  HideWinDiv() {
    console.log("ay kalam");
    this.winhtml.classList.add("hide");
    this.winhtml.classList.remove("display");
  }
}
function main() {
  const g1 = new Gameboard();
  g1.decideSizeOfBoard();
}

main();
