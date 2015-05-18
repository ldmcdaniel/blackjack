//  --------------Variables--------------  //

var deckOfCards = "http://deckofcardsapi.com/api/";
var deckID;
var JSONP_PROXY = 'https://jsonp.afeld.me/?url=';
var playerScore = 0;
var playerAces = [];
var dealerScore = 0;
var dealerAces = [];

//  --------------Functions--------------  //

function getJSON(url, cb) {
  // THIS WILL ADD THE CROSS ORIGIN HEADERS
  var request = new XMLHttpRequest();
  request.open('GET', JSONP_PROXY + url);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      cb(JSON.parse(request.responseText));
    }
  };
	request.send();
}

function addToPlayerScore (card) {
  if (card.value === "KING" || card.value === "QUEEN" || card.value === "JACK") {
    playerScore += 10;
  } else if (Number(card.value) > 1) {
    playerScore += Number(card.value);
  } else {
    if (playerScore + 11 > 21) {
      playerScore += 1;
    } else if (playerScore + 11 === 21) {
      playerScore += 11;
    } else {
      playerAces.push(card.value);
    }
  }
  console.log('p: ' + playerScore + ' + ' + playerAces);
}

function addToDealerScore (card) {
  if (card.value === "KING" || card.value === "QUEEN" || card.value === "JACK") {
    dealerScore += 10;
  } else if (Number(card.value) > 1) {
    dealerScore += Number(card.value);
  } else {
    if (dealerScore + 11 > 21) {
      dealerScore += 1;
    } else if (dealerScore + 11 > 17) {
      dealerScore += 11;
    } else {
      dealerAces.push(card.value);
    }
  }
  return dealerScore;
  console.log('d: ' + dealerScore + ' + ' + dealerAces);
}

function newGame() {
  playerScore = 0;
  dealerScore = 0;
  $(".dealer").html('<img class="dealer-cards back" src="imgs/card-back-dealer.png">');
  $(".player").html('');
  $(".hit-me").show();
  $(".stand").show();
  getJSON(JSONP_PROXY + deckOfCards + 'shuffle/?deck_count=6', function (data) {
    deckID = data.deck_id;
    getJSON(JSONP_PROXY + deckOfCards + 'draw/' + deckID + '/?count=3', function (d) {
      d.cards.forEach(function (card, i) {
        if (i % 2 === 0) {
          $(".player").append("<img class='player-cards' src='" + card.image + "'</img>");
          addToPlayerScore(card);
          console.log("P: " + playerScore + ' + ' + playerAces);
        } else {
          $(".dealer").append("<img class='dealer-cards' src='" + card.image + "'</img>");
          addToDealerScore(card);
          console.log("D: " + dealerScore + ' + ' + dealerAces);
        }
      })
    }) 
  })
}

function dealerSecondCard() {
  getJSON(JSONP_PROXY + deckOfCards + 'draw/' + deckID + '/?count=1', function (d) {
    d.cards.forEach(function (card, i) {
      $(".dealer").append("<img class='dealer-cards' src='" + card.image + "'</img>");
      addToDealerScore(card);
      console.log("D: " + dealerScore + ' + ' + dealerAces);
    })
  })
}

//  --------------Playing the Game --------------  //

//get the cards

newGame();

$(".hit-me").click (function () {
  getJSON(JSONP_PROXY + deckOfCards + 'draw/' + deckID + '/?count=1', function (d) {
    d.cards.forEach(function (card, i) {
      $(".player").append("<img class='player-cards' src='" + card.image + "'</img>");
      addToPlayerScore(card);
      if (playerScore > 21) {
        $(".hit-me").hide();
        $(".stand").hide();
        $(".back").hide();
        dealerSecondCard();
      }
    })
  })
})

$(".stand").click (function () {
  alert("works");
  $(".hit-me").hide();
  $(".stand").hide();
  $(".back").hide();
  dealerSecondCard();
  if (dealerScore < 17) {
    dealerSecondCard();
  }
})

$(".new-game").click(newGame);