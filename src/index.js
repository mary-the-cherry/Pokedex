const pokemonListe = document.querySelector(".pokemonliste ul");
const pokemoncard = document.querySelector(".pokemoncard");
const pokemonCardFull = document.querySelector(".pokemoncardFullWrapper");
const btnSeachPokemon = document.querySelector("#btnSeachPokemon");
const inputPokemonSearch = document.querySelector("#inputPokemonSearch");
const btnPaginationPrev = document.querySelector("#pagination-item-prev");
const btnPaginationItem1 = document.querySelector("#pagination-item-one");
const btnPaginationItem2 = document.querySelector("#pagination-item-two");
const btnPaginationItem3 = document.querySelector("#pagination-item-three");
const btnPaginationNext = document.querySelector("#pagination-item-next");
const body = document.body;
var countingPokemons = 0;
var actualPage = 1;
var globalPokemonlist = [];


function jsUcfirst(string) {
    /*Function to convert the first letter to a capital letter*/

    return string.charAt(0).toUpperCase() + string.slice(1);
}

function fetchPokemonList() {
    /*Function to get list of pokemons, store this list on left side of the page*/

    fetch('https://pokeapi.co/api/v2/pokemon?limit=600')
        .then(response => response.json())
        .then(allpokemons => {
            allpokemons.results.forEach(pokemon => {
                //creat a list element for each pokemon and add to HTML ul element pokemonList 
                let pokemonListeName = document.createElement("li");
                pokemonListeName.innerHTML = `<p> ${jsUcfirst(pokemon.name)} </p>`
                pokemonListeName.addEventListener("click", function () {    //each li is a clickable element to open further details
                    let pokemonName = pokemon.name;
                    newPokemonPage(pokemonName);
                }, false)
                pokemonListe.appendChild(pokemonListeName);
                globalPokemonlist.push(pokemon);   //generate a global Array of all loaded pokemons

            })
        })
}

function fetchPokemonCardsDefault(url) {
    fetch(url)  //fetch pokemonlist
        .then(response => response.json())
        .then(function (pokemons) {
            //load all data of each pokemon
            pokemons.results.forEach(pokemon => getPokemon(pokemon))
        })
        .catch(err => console.log(err))
}
   
function getPokemon(pokemon) {
    /*function to fetch detailed information from a single pokemon,
     * create a card-deck and a card for the pokemon*/

    if (true) {
        fetch(pokemon.url)
            .then(response => response.json())
            .then(function (pokemondata) {

                //creat after each third card a new card-deck, increase counter for card-deck
                creatCardDeck(countingPokemons, pokemoncard);
                countingPokemons++;

                return pokemondata;
            })
            .then(pokemondata => { 
                //create a new pokemon card with fetched data
                createPokemonCard(pokemondata, pokemoncard);
            })
            .catch(err => console.log(err))
    }  
}

function creatCardDeck(countingPokemons, pokemoncard) {
    //creat after each third card a new card-deck
    if (countingPokemons % 3 === 0) {
        let cardDeck = document.createElement("div");
        cardDeck.className = "card-deck";
        pokemoncard.appendChild(cardDeck);
    }
}


function createPokemonCard(pokemondata, pokemoncard){
    // create card and add styling
    let card = document.createElement("div");
    card.className = "card";
    card.classList.add("cardstyle");

    //create card body
    let cardBody = document.createElement("div");

    // create title and add Pokemon name as title to card
    let cardTitle = document.createElement("div");
    cardTitle.className = "card-title";
    cardTitle.innerHTML = `<h3>${jsUcfirst(pokemondata.name)}</h3>`;
    cardBody.appendChild(cardTitle);

    // add data to card
    let cardText = document.createElement("div");
    cardText.className = "card-text";
    cardText.innerHTML = `<p> ID: <strong>${pokemondata.id}</strong> &nbsp &nbsp Order: <strong>${pokemondata.order}</strong> &nbsp &nbsp
                                    Base-Exp.: <strong>${pokemondata.base_experience}</strong> </p>`
    cardBody.append(cardText);

    //add card body to card
    card.appendChild(cardBody);

    // fetch pic, battle attributes and add to card
    let cardImg = document.createElement("img");
    cardImg.className = "card-img-top";
    getPokemonImage(pokemondata, cardImg, card);

    //append card to homepage
    pokemoncard.lastChild.appendChild(card);

    //add a EventListner to open more details of a pokemon on a click
    card.addEventListener("click", function () {
        let pokemonName = pokemondata.name;
        newPokemonPage(pokemonName);
        this.style.color = "red";
    }, false)
}

function getPokemonImage(pokemondata, cardImg, card) {
    /*get the image via fetch, define it as a blob and then add it to the card,
     * add some type attributes as text to the card*/

    //fetch pic and store in card-img
    fetch(pokemondata.sprites.other.dream_world.front_default)
        .then(response => response.blob())
        .then(blob => {
            let pokeImg = URL.createObjectURL(blob);
            cardImg.setAttribute('src', pokeImg);
            return cardImg;
        })
        .then(cardImg => card.appendChild(cardImg))
        .then(result => {
            //create a textfield with the Type of the pokemon and add it to the card
            createTypeField(pokemondata, card);
        })
        .catch(err => console.log(err))
}



function createTypeField(pokemondata, card) {
    //add all pokemontypes in an extra field below the img

    //create textfield and add classes
    let cardTextAttributes = document.createElement("div");
    cardTextAttributes.className = "card-text";
    cardTextAttributes.classList.add("cardAttributeField");

    //add all types of the pokemon in a p-element
    let pokemonType = document.createElement("p");
    pokemondata.types.forEach(pokemontype => {
        pokemonType.innerHTML += `<span> ${jsUcfirst(pokemontype.type.name)} </span>`;
        cardTextAttributes.appendChild(pokemonType);
    });

    //add textfield to card
    card.appendChild(cardTextAttributes);
}

function newPokemonPage(pokemonName) {
    //opens a extra big card with addional information of the pokemon

    //merge the url for a certain pokemon
    let urlPokemon = "https://pokeapi.co/api/v2/pokemon/" + pokemonName;

    //fetch the data of the pokemon
    fetch(urlPokemon)
        .then(response => response.json())
        .then(pokemon => {
            //create a new card with detailed indormation
            createFullCard(pokemon);
        });

        document.querySelector(".close").addEventListener("click", function () {
            pokemonCardFull.style.display = "none";
            body.style.overflow = "auto";
        });
}

function createFullCard(pokemon) {
    /*Design of a new card with detailed information of a pokemon
     * with name,point,type,effects,fightskills,weight,height*/

    //add Name and points to card
    document.querySelector("#pokemoncardFullName").textContent = jsUcfirst(pokemon.name);
    document.querySelector("#pokemoncardFullNumbers").innerHTML = `ID: <strong>${pokemon.id}</strong> &nbsp &nbsp Order: <strong>${pokemon.order}</strong> &nbsp &nbsp
                                    Base-Exp.: <strong>${pokemon.base_experience}</strong>`;

    //loop through all types and add to a array, add array to HTML document
    let types = [];
    pokemon.types.forEach(type => types.push(jsUcfirst(type.type.name)));
    document.querySelector("#pokemoncardFullType").innerHTML = "<strong>Type:</strong> " + types.join(', ');

    //loop through all abilities and add to a array, add array to HTML document
    let abilities = [];
    pokemon.abilities.forEach(ability => abilities.push(jsUcfirst(ability.ability.name)));
    document.querySelector("#pokemoncardEffects").innerHTML = "<strong>Abilities:</strong> " + abilities.join(', ');

    //loop through all stats and add to a array, add array to HTML document
    let stats = [];
    pokemon.stats.forEach(stat => stats.push(jsUcfirst(stat.stat.name)));
    document.querySelector("#pokemoncardFullKampf").innerHTML = "<strong>Fightskills:</strong> " + stats.join(', ');

    //add height and weight
    document.querySelector("#pokemoncardFullWeight").innerHTML = `<strong>Weight:</strong> ${pokemon.weight} g`;
    document.querySelector("#pokemoncardFullHeight").innerHTML = `<strong>Height:</strong> ${pokemon.height} cm`;

    //add image as blob to card and make card visible
    fetch(pokemon.sprites.other.dream_world.front_default)
        .then(response => response.blob())
        .then(blob => {
            let pokeImg = URL.createObjectURL(blob);
            document.querySelector("#pokemoncardFullImg").setAttribute('src', pokeImg);
            return pokeImg;
        })
        .then(pokeImg => {
            pokemonCardFull.style.display = "block";
            pokemonCardFull.style.overflow = "auto";
            body.style.overflow = "hidden";

        })
        .catch(err => console.log(err))
}

function searchPokemon() {
    /* Search for Pokemons which includes value of the Search input */

    console.log('search');
    let inputPokemonValue = inputPokemonSearch.value.toLowerCase().replace(/\s/g, '');  //to lower case and without whitespaces
    defaultPage();

    //without input value the default list of the first 20 pokemons is load
    if (inputPokemonValue === "") {
        fetchPokemonCardsDefault('https://pokeapi.co/api/v2/pokemon?limit=20');
        document.querySelectorAll(".pagination li").forEach(paginationItem => paginationItem.classList.remove("active"));

        //set pagination to default and first item active
        btnPaginationItem1.textContent = 1;        
        btnPaginationItem2.textContent = 2;       
        btnPaginationItem3.textContent = 3;        
        btnPaginationItem1.parentNode.classList.add('active');

        //enalble view of pagination
        document.querySelector(".pokemonPagintion").style.display = "block";

    }
    else {
        globalPokemonlist.filter(pokemon => pokemon.name.includes(inputPokemonValue)).forEach(pokemon => {
            //get pokemons which fulfill filter
            getPokemon(pokemon);
        });
        //disable view of pagination
        document.querySelector(".pokemonPagintion").style.display = "none";
    }
}

function defaultPage() {
/*sets everything to a status,that a plain page for new pokemon cards is loaded*/

    pokemoncard.innerHTML = "<div class='card-deck'><div>";                             //clear pokemoncards
    countingPokemons = 0;                                                               //clear counting of pokemons
}

function paginationItemLoad(page) {
    /*Load pokemons with a predefined offset */
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=' + page;              //generate adjusted url
    defaultPage();                                                                      //clear all pokemoncards
    fetchPokemonCardsDefault(url);                                                      //fetch the pokemons and cread new cards
    document.querySelectorAll(".pagination li").forEach(paginationItem => paginationItem.classList.remove("active"));
    window.scrollTo(0, 0);                                                              //scroll to top of the documemt
}

function paginationPrev() {
    /* Jumps three pages to the front of all pokemons / one page contains 20 pokemons */

    btnPaginationItem1.textContent = Number(btnPaginationItem1.textContent) - 3;        //adjust PaginationItem Number -3
    btnPaginationItem2.textContent = Number(btnPaginationItem2.textContent) - 3;        //adjust PaginationItem Number -3
    btnPaginationItem3.textContent = Number(btnPaginationItem3.textContent) - 3;        //adjust PaginationItem Number -3
    btnPaginationNext.parentNode.classList.remove('disabled');                          //removes disabled class of Pagination Next Button
    let page = (Number(btnPaginationItem3.textContent) * 20) - 20;                      //calculate offset of pokemons
    paginationItemLoad(page);                                                           //Load new page
    btnPaginationItem3.parentElement.classList.add('active');                           // Set pagination Item active --> always item 3   
    if (btnPaginationItem1.textContent === '1') {
        btnPaginationPrev.parentNode.classList.add('disabled');                         //if pagination is at start, prev button is disabled
    }
    window.scrollTo(0, 0);                                                              //scroll to top of the document
}

function paginationNext() {
    /* Jumps three pages back of all pokemons / one page contains 20 pokemons */

    btnPaginationItem1.textContent = Number(btnPaginationItem1.textContent) + 3;        //adjust PaginationItem Number +3
    btnPaginationItem2.textContent = Number(btnPaginationItem2.textContent) + 3;        //adjust PaginationItem Number +3
    btnPaginationItem3.textContent = Number(btnPaginationItem3.textContent) + 3;        //adjust PaginationItem Number +3
    btnPaginationPrev.parentNode.classList.remove('disabled');                          //removes disabled class of Pagination Prev Button
    let page = (Number(btnPaginationItem1.textContent) * 20) - 20;                      //calculate offset of pokemons
    paginationItemLoad(page);                                                           //Load new page
    btnPaginationItem1.parentElement.classList.add('active');                           // Set pagination Item active --> always item 1
    if (btnPaginationItem2.textContent === '29') {
        btnPaginationNext.parentNode.classList.add('disabled');                         //if pagination is on end, next button is disabled
    }
    window.scrollTo(0, 0);                                                              //scroll to top
}


/*-------------------Main Program--------------------*/

//Defaultpage
fetchPokemonList();
fetchPokemonCardsDefault('https://pokeapi.co/api/v2/pokemon?limit=20');

//Eventlistener Search Button
btnSeachPokemon.addEventListener("click", searchPokemon);

//Eventlistener Search Input and press Enter Button
inputPokemonSearch.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchPokemon();
    }
});

//Eventlistener Pagination Prev: Jumps three pages to the front and adjusts the Pagination Items 
btnPaginationPrev.addEventListener("click", function () {
    if (!this.classList.contains('disabled')) {             //just possible to use if button is not disabled
        paginationPrev();                                   //call function to jump three pages to the front
    }
}); 

//Eventlistener Pagination Page : Page 1 --> Loads the first 20 pokemons
btnPaginationItem1.addEventListener("click", function () {
    if (!this.parentElement.classList.contains("active")) { //Just change when item is not active
        let page = (Number(this.textContent) * 20) - 20;    //Adjust url to offset
        paginationItemLoad(page);                           //Load Page regarding offset
        this.parentElement.classList.add('active');         //Set this item active
    }
}, false);

//Eventlistener Pagination Page : Page 2 --> Loads the second 20 pokemons
btnPaginationItem2.addEventListener("click", function () {  
    if (!this.parentElement.classList.contains("active")) { //Just change when item is not active
        let page = (Number(this.textContent) * 20) - 20;    //Adjust url to offset
        paginationItemLoad(page);                           //Load Page regarding offset
        this.parentElement.classList.add('active');         //Set this item active
    }
}, false);

//Eventlistener Pagination Page : Page 3 --> Loads the third 20 pokemons
btnPaginationItem3.addEventListener("click", function () {  
    if (!this.parentElement.classList.contains("active")) { //Just change when item is not active
        let page = (Number(this.textContent) * 20) - 20;    //Adjust url to offset
        paginationItemLoad(page);                           //Load Page regarding offset
        this.parentElement.classList.add('active');         //Set this item active
    }
}, false);

//Eventlistener Pagination Next: Jumps three pages back and adjusts the Pagination Items 
btnPaginationNext.addEventListener("click", function () {
    if (!this.classList.contains('disabled')) {             //just possible to use if button is not disabled
        paginationNext();                                   //call function to jump three pages back
    }
}); 





