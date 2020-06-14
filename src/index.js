const quotesURL = "http://localhost:3000/quotes"
const likesURL = "http://localhost:3000/likes"
const quoteListUl = document.querySelector('#quote-list');
const newQuoteForm = document.querySelector('#new-quote-form');

document.addEventListener("DOMContentLoaded", () => {
    renderQuotes();
    newQuoteForm.addEventListener("submit", function(e) {
        e.preventDefault();
        form = e.target;
        post(form);
    });
});

function renderQuotes() {
    quoteListUl.innerHTML = ""
    fetchQuotes()
    .then((quotes =>
        quotes.forEach(quote => {
            renderQuote(quote);
        })
    ));
    }
    
    function fetchQuotes() {
        return fetch(`${quotesURL}?_embed=likes`)
        .then(function (response) {
            return response.json();
        })
        .catch(function(error) {
            alert("The fetch for quotes didn't work");
            console.log(error.message);
        });
    }

    function renderQuote(quote) {
        const quoteLi = document.createElement("li");
        quoteLi.setAttribute("class","quote-card");
        quoteLi.dataset.id = quote.id;

        const blockquote = document.createElement("blockquote");
        blockquote.setAttribute("class", "blockquote");

        const quoteP = document.createElement("p");
        quoteP.setAttribute("class", "mb-0");
        quoteP.innerText = quote.quote;
        
        const footer = document.createElement("footer");
        footer.setAttribute("class", "blockquote-footer");
        footer.innerText = quote.author

        const likeButton = document.createElement("button");
        likeButton.setAttribute("class", "btn-success");
        likeButton.innerText = "Likes:"

        likeButton.addEventListener("click", function(e) {
            e.preventDefault();
            const quoteInQuestionLi = e.target.parentNode.parentNode;
            postLike(quoteInQuestionLi);
        });

        const span = document.createElement("span");
        span.innerText = "0";

        likeButton.appendChild(span);

        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "btn-danger");
        deleteButton.innerText = "Delete"

        deleteButton.addEventListener("click", function(e) {
          e.preventDefault();
              const quoteInQuestionLi = e.target.parentNode.parentNode;
              deleteReserved(quoteInQuestionLi)
              .then(quoteInQuestionLi.remove());
        });


        blockquote.appendChild(quoteP);
        blockquote.appendChild(footer);
        blockquote.appendChild(likeButton);
        blockquote.appendChild(deleteButton);

        quoteLi.appendChild(blockquote);

        quoteListUl.appendChild(quoteLi);
    }

function post(form) {
    // will come from the event listener target
    const formData = {
      quote : form.quote.value,
      author : form.author.value
    };
     
    const configObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    };
     
    fetch(quotesURL, configObject)
      .then(function(response) {
        return response.json();
      })
      .then(function() {
        renderQuotes();
      })
      .catch(function(error) {
        alert("Adding a new quote didn't work :(");
        console.log(error.message);
      });
}

function deleteReserved (quote) {
    // edit ^TARGET for relevant source of data for PATCH
    const configObject = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    };
    
    return fetch(`${quotesURL}/${quote.dataset.id}`, configObject)
    .then(resp => resp.json())
    .catch(function(error) {
        alert("Deleting this quote didn't work");
        console.error(error.message);
    });
}

function postLike(quoteToBeLiked) {
    // will come from the event listener target
    const quoteInt = parseInt(quoteToBeLiked.dataset.id);
    const LikesData = {
      quoteId : quoteInt
    };
     
    const configObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(LikesData)
    };
     
    fetch(likesURL, configObject)
      .then(function(response) {
        return response.json();
      })
      .catch(function(error) {
        alert("THIS DIDN'T WORK, BE MORE SPECIFIC");
        console.log(error.message);
      });
}