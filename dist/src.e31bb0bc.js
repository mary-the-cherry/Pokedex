// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})(
  {
    'index.js': [
      function (require, module, exports) {
        var pokemonListe = document.querySelector('.pokemonliste ul');
        var pokemoncard = document.querySelector('.pokemoncard');
        var pokemonCardFull = document.querySelector('.pokemoncardFullWrapper');
        var btnSeachPokemon = document.querySelector('#btnSeachPokemon');
        var inputPokemonSearch = document.querySelector('#inputPokemonSearch');
        var btnPaginationPrev = document.querySelector('#pagination-item-prev');
        var btnPaginationItem1 = document.querySelector('#pagination-item-one');
        var btnPaginationItem2 = document.querySelector('#pagination-item-two');
        var btnPaginationItem3 = document.querySelector(
          '#pagination-item-three'
        );
        var btnPaginationNext = document.querySelector('#pagination-item-next');
        var body = document.body;
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
            .then(function (response) {
              return response.json();
            })
            .then(function (allpokemons) {
              allpokemons.results.forEach(function (pokemon) {
                //creat a list element for each pokemon and add to HTML ul element pokemonList
                var pokemonListeName = document.createElement('li');
                pokemonListeName.innerHTML = '<p> '.concat(
                  jsUcfirst(pokemon.name),
                  ' </p>'
                );
                pokemonListeName.addEventListener(
                  'click',
                  function () {
                    //each li is a clickable element to open further details
                    var pokemonName = pokemon.name;
                    newPokemonPage(pokemonName);
                  },
                  false
                );
                pokemonListe.appendChild(pokemonListeName);
                globalPokemonlist.push(pokemon); //generate a global Array of all loaded pokemons
              });
            });
        }

        function fetchPokemonCardsDefault(url) {
          fetch(url) //fetch pokemonlist
            .then(function (response) {
              return response.json();
            })
            .then(function (pokemons) {
              //load all data of each pokemon
              pokemons.results.forEach(function (pokemon) {
                return getPokemon(pokemon);
              });
            })
            .catch(function (err) {
              return console.log(err);
            });
        }

        function getPokemon(pokemon) {
          /*function to fetch detailed information from a single pokemon,
           * create a card-deck and a card for the pokemon*/
          if (true) {
            fetch(pokemon.url)
              .then(function (response) {
                return response.json();
              })
              .then(function (pokemondata) {
                //creat after each third card a new card-deck, increase counter for card-deck
                creatCardDeck(countingPokemons, pokemoncard);
                countingPokemons++;
                return pokemondata;
              })
              .then(function (pokemondata) {
                //create a new pokemon card with fetched data
                createPokemonCard(pokemondata, pokemoncard);
              })
              .catch(function (err) {
                return console.log(err);
              });
          }
        }

        function creatCardDeck(countingPokemons, pokemoncard) {
          //creat after each third card a new card-deck
          if (countingPokemons % 3 === 0) {
            var cardDeck = document.createElement('div');
            cardDeck.className = 'card-deck';
            pokemoncard.appendChild(cardDeck);
          }
        }

        function createPokemonCard(pokemondata, pokemoncard) {
          // create card and add styling
          var card = document.createElement('div');
          card.className = 'card';
          card.classList.add('cardstyle'); //create card body

          var cardBody = document.createElement('div'); // create title and add Pokemon name as title to card

          var cardTitle = document.createElement('div');
          cardTitle.className = 'card-title';
          cardTitle.innerHTML = '<h3>'.concat(
            jsUcfirst(pokemondata.name),
            '</h3>'
          );
          cardBody.appendChild(cardTitle); // add data to card

          var cardText = document.createElement('div');
          cardText.className = 'card-text';
          cardText.innerHTML = '<p> ID: <strong>'
            .concat(pokemondata.id, '</strong> &nbsp &nbsp Order: <strong>')
            .concat(
              pokemondata.order,
              '</strong> &nbsp &nbsp\n                                    Base-Exp.: <strong>'
            )
            .concat(pokemondata.base_experience, '</strong> </p>');
          cardBody.append(cardText); //add card body to card

          card.appendChild(cardBody); // fetch pic, battle attributes and add to card

          var cardImg = document.createElement('img');
          cardImg.className = 'card-img-top';
          getPokemonImage(pokemondata, cardImg, card); //append card to homepage

          pokemoncard.lastChild.appendChild(card); //add a EventListner to open more details of a pokemon on a click

          card.addEventListener(
            'click',
            function () {
              var pokemonName = pokemondata.name;
              newPokemonPage(pokemonName);
              this.style.color = 'red';
            },
            false
          );
        }

        function getPokemonImage(pokemondata, cardImg, card) {
          /*get the image via fetch, define it as a blob and then add it to the card,
           * add some type attributes as text to the card*/
          //fetch pic and store in card-img
          fetch(pokemondata.sprites.other.dream_world.front_default)
            .then(function (response) {
              return response.blob();
            })
            .then(function (blob) {
              var pokeImg = URL.createObjectURL(blob);
              cardImg.setAttribute('src', pokeImg);
              return cardImg;
            })
            .then(function (cardImg) {
              return card.appendChild(cardImg);
            })
            .then(function (result) {
              //create a textfield with the Type of the pokemon and add it to the card
              createTypeField(pokemondata, card);
            })
            .catch(function (err) {
              return console.log(err);
            });
        }

        function createTypeField(pokemondata, card) {
          //add all pokemontypes in an extra field below the img
          //create textfield and add classes
          var cardTextAttributes = document.createElement('div');
          cardTextAttributes.className = 'card-text';
          cardTextAttributes.classList.add('cardAttributeField'); //add all types of the pokemon in a p-element

          var pokemonType = document.createElement('p');
          pokemondata.types.forEach(function (pokemontype) {
            pokemonType.innerHTML += '<span> '.concat(
              jsUcfirst(pokemontype.type.name),
              ' </span>'
            );
            cardTextAttributes.appendChild(pokemonType);
          }); //add textfield to card

          card.appendChild(cardTextAttributes);
        }

        function newPokemonPage(pokemonName) {
          //opens a extra big card with addional information of the pokemon
          //merge the url for a certain pokemon
          var urlPokemon = 'https://pokeapi.co/api/v2/pokemon/' + pokemonName; //fetch the data of the pokemon

          fetch(urlPokemon)
            .then(function (response) {
              return response.json();
            })
            .then(function (pokemon) {
              //create a new card with detailed indormation
              createFullCard(pokemon);
            });
          document
            .querySelector('.close')
            .addEventListener('click', function () {
              pokemonCardFull.style.display = 'none';
              body.style.overflow = 'auto';
            });
        }

        function createFullCard(pokemon) {
          /*Design of a new card with detailed information of a pokemon
           * with name,point,type,effects,fightskills,weight,height*/
          //add Name and points to card
          document.querySelector(
            '#pokemoncardFullName'
          ).textContent = jsUcfirst(pokemon.name);
          document.querySelector(
            '#pokemoncardFullNumbers'
          ).innerHTML = 'ID: <strong>'
            .concat(pokemon.id, '</strong> &nbsp &nbsp Order: <strong>')
            .concat(
              pokemon.order,
              '</strong> &nbsp &nbsp\n                                    Base-Exp.: <strong>'
            )
            .concat(pokemon.base_experience, '</strong>'); //loop through all types and add to a array, add array to HTML document

          var types = [];
          pokemon.types.forEach(function (type) {
            return types.push(jsUcfirst(type.type.name));
          });
          document.querySelector('#pokemoncardFullType').innerHTML =
            '<strong>Type:</strong> ' + types.join(', '); //loop through all abilities and add to a array, add array to HTML document

          var abilities = [];
          pokemon.abilities.forEach(function (ability) {
            return abilities.push(jsUcfirst(ability.ability.name));
          });
          document.querySelector('#pokemoncardEffects').innerHTML =
            '<strong>Abilities:</strong> ' + abilities.join(', '); //loop through all stats and add to a array, add array to HTML document

          var stats = [];
          pokemon.stats.forEach(function (stat) {
            return stats.push(jsUcfirst(stat.stat.name));
          });
          document.querySelector('#pokemoncardFullKampf').innerHTML =
            '<strong>Fightskills:</strong> ' + stats.join(', '); //add height and weight

          document.querySelector(
            '#pokemoncardFullWeight'
          ).innerHTML = '<strong>Weight:</strong> '.concat(
            pokemon.weight,
            ' g'
          );
          document.querySelector(
            '#pokemoncardFullHeight'
          ).innerHTML = '<strong>Height:</strong> '.concat(
            pokemon.height,
            ' cm'
          ); //add image as blob to card and make card visible

          fetch(pokemon.sprites.other.dream_world.front_default)
            .then(function (response) {
              return response.blob();
            })
            .then(function (blob) {
              var pokeImg = URL.createObjectURL(blob);
              document
                .querySelector('#pokemoncardFullImg')
                .setAttribute('src', pokeImg);
              return pokeImg;
            })
            .then(function (pokeImg) {
              pokemonCardFull.style.display = 'block';
              pokemonCardFull.style.overflow = 'auto';
              body.style.overflow = 'hidden';
            })
            .catch(function (err) {
              return console.log(err);
            });
        }

        function searchPokemon() {
          /* Search for Pokemons which includes value of the Search input */
          console.log('search');
          var inputPokemonValue = inputPokemonSearch.value
            .toLowerCase()
            .replace(/\s/g, ''); //to lower case and without whitespaces

          defaultPage(); //without input value the default list of the first 20 pokemons is load

          if (inputPokemonValue === '') {
            fetchPokemonCardsDefault(
              'https://pokeapi.co/api/v2/pokemon?limit=20'
            );
            document
              .querySelectorAll('.pagination li')
              .forEach(function (paginationItem) {
                return paginationItem.classList.remove('active');
              }); //set pagination to default and first item active

            btnPaginationItem1.textContent = 1;
            btnPaginationItem2.textContent = 2;
            btnPaginationItem3.textContent = 3;
            btnPaginationItem1.parentNode.classList.add('active'); //enalble view of pagination

            document.querySelector('.pokemonPagintion').style.display = 'block';
          } else {
            globalPokemonlist
              .filter(function (pokemon) {
                return pokemon.name.includes(inputPokemonValue);
              })
              .forEach(function (pokemon) {
                //get pokemons which fulfill filter
                getPokemon(pokemon);
              }); //disable view of pagination

            document.querySelector('.pokemonPagintion').style.display = 'none';
          }
        }

        function defaultPage() {
          /*sets everything to a status,that a plain page for new pokemon cards is loaded*/
          pokemoncard.innerHTML = "<div class='card-deck'><div>"; //clear pokemoncards

          countingPokemons = 0; //clear counting of pokemons
        }

        function paginationItemLoad(page) {
          /*Load pokemons with a predefined offset */
          var url = 'https://pokeapi.co/api/v2/pokemon?limit=20&offset=' + page; //generate adjusted url

          defaultPage(); //clear all pokemoncards

          fetchPokemonCardsDefault(url); //fetch the pokemons and cread new cards

          document
            .querySelectorAll('.pagination li')
            .forEach(function (paginationItem) {
              return paginationItem.classList.remove('active');
            });
          window.scrollTo(0, 0); //scroll to top of the documemt
        }

        function paginationPrev() {
          /* Jumps three pages to the front of all pokemons / one page contains 20 pokemons */
          btnPaginationItem1.textContent =
            Number(btnPaginationItem1.textContent) - 3; //adjust PaginationItem Number -3

          btnPaginationItem2.textContent =
            Number(btnPaginationItem2.textContent) - 3; //adjust PaginationItem Number -3

          btnPaginationItem3.textContent =
            Number(btnPaginationItem3.textContent) - 3; //adjust PaginationItem Number -3

          btnPaginationNext.parentNode.classList.remove('disabled'); //removes disabled class of Pagination Next Button

          var page = Number(btnPaginationItem3.textContent) * 20 - 20; //calculate offset of pokemons

          paginationItemLoad(page); //Load new page

          btnPaginationItem3.parentElement.classList.add('active'); // Set pagination Item active --> always item 3

          if (btnPaginationItem1.textContent === '1') {
            btnPaginationPrev.parentNode.classList.add('disabled'); //if pagination is at start, prev button is disabled
          }

          window.scrollTo(0, 0); //scroll to top of the document
        }

        function paginationNext() {
          /* Jumps three pages back of all pokemons / one page contains 20 pokemons */
          btnPaginationItem1.textContent =
            Number(btnPaginationItem1.textContent) + 3; //adjust PaginationItem Number +3

          btnPaginationItem2.textContent =
            Number(btnPaginationItem2.textContent) + 3; //adjust PaginationItem Number +3

          btnPaginationItem3.textContent =
            Number(btnPaginationItem3.textContent) + 3; //adjust PaginationItem Number +3

          btnPaginationPrev.parentNode.classList.remove('disabled'); //removes disabled class of Pagination Prev Button

          var page = Number(btnPaginationItem1.textContent) * 20 - 20; //calculate offset of pokemons

          paginationItemLoad(page); //Load new page

          btnPaginationItem1.parentElement.classList.add('active'); // Set pagination Item active --> always item 1

          if (btnPaginationItem2.textContent === '29') {
            btnPaginationNext.parentNode.classList.add('disabled'); //if pagination is on end, next button is disabled
          }

          window.scrollTo(0, 0); //scroll to top
        }
        /*-------------------Main Program--------------------*/
        //Defaultpage

        fetchPokemonList();
        fetchPokemonCardsDefault('https://pokeapi.co/api/v2/pokemon?limit=20'); //Eventlistener Search Button

        btnSeachPokemon.addEventListener('click', searchPokemon); //Eventlistener Search Input and press Enter Button

        inputPokemonSearch.addEventListener('keyup', function (event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            searchPokemon();
          }
        }); //Eventlistener Pagination Prev: Jumps three pages to the front and adjusts the Pagination Items

        btnPaginationPrev.addEventListener('click', function () {
          if (!this.classList.contains('disabled')) {
            //just possible to use if button is not disabled
            paginationPrev(); //call function to jump three pages to the front
          }
        }); //Eventlistener Pagination Page : Page 1 --> Loads the first 20 pokemons

        btnPaginationItem1.addEventListener(
          'click',
          function () {
            if (!this.parentElement.classList.contains('active')) {
              //Just change when item is not active
              var page = Number(this.textContent) * 20 - 20; //Adjust url to offset

              paginationItemLoad(page); //Load Page regarding offset

              this.parentElement.classList.add('active'); //Set this item active
            }
          },
          false
        ); //Eventlistener Pagination Page : Page 2 --> Loads the second 20 pokemons

        btnPaginationItem2.addEventListener(
          'click',
          function () {
            if (!this.parentElement.classList.contains('active')) {
              //Just change when item is not active
              var page = Number(this.textContent) * 20 - 20; //Adjust url to offset

              paginationItemLoad(page); //Load Page regarding offset

              this.parentElement.classList.add('active'); //Set this item active
            }
          },
          false
        ); //Eventlistener Pagination Page : Page 3 --> Loads the third 20 pokemons

        btnPaginationItem3.addEventListener(
          'click',
          function () {
            if (!this.parentElement.classList.contains('active')) {
              //Just change when item is not active
              var page = Number(this.textContent) * 20 - 20; //Adjust url to offset

              paginationItemLoad(page); //Load Page regarding offset

              this.parentElement.classList.add('active'); //Set this item active
            }
          },
          false
        ); //Eventlistener Pagination Next: Jumps three pages back and adjusts the Pagination Items

        btnPaginationNext.addEventListener('click', function () {
          if (!this.classList.contains('disabled')) {
            //just possible to use if button is not disabled
            paginationNext(); //call function to jump three pages back
          }
        });
      },
      {},
    ],
    '../node_modules/parcel-bundler/src/builtins/hmr-runtime.js': [
      function (require, module, exports) {
        var global = arguments[3];
        var OVERLAY_ID = '__parcel__error__overlay__';
        var OldModule = module.bundle.Module;

        function Module(moduleName) {
          OldModule.call(this, moduleName);
          this.hot = {
            data: module.bundle.hotData,
            _acceptCallbacks: [],
            _disposeCallbacks: [],
            accept: function (fn) {
              this._acceptCallbacks.push(fn || function () {});
            },
            dispose: function (fn) {
              this._disposeCallbacks.push(fn);
            },
          };
          module.bundle.hotData = null;
        }

        module.bundle.Module = Module;
        var checkedAssets, assetsToAccept;
        var parent = module.bundle.parent;

        if (
          (!parent || !parent.isParcelRequire) &&
          typeof WebSocket !== 'undefined'
        ) {
          var hostname = '' || location.hostname;
          var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
          var ws = new WebSocket(
            protocol + '://' + hostname + ':' + '59319' + '/'
          );

          ws.onmessage = function (event) {
            checkedAssets = {};
            assetsToAccept = [];
            var data = JSON.parse(event.data);

            if (data.type === 'update') {
              var handled = false;
              data.assets.forEach(function (asset) {
                if (!asset.isNew) {
                  var didAccept = hmrAcceptCheck(
                    global.parcelRequire,
                    asset.id
                  );

                  if (didAccept) {
                    handled = true;
                  }
                }
              }); // Enable HMR for CSS by default.

              handled =
                handled ||
                data.assets.every(function (asset) {
                  return asset.type === 'css' && asset.generated.js;
                });

              if (handled) {
                console.clear();
                data.assets.forEach(function (asset) {
                  hmrApply(global.parcelRequire, asset);
                });
                assetsToAccept.forEach(function (v) {
                  hmrAcceptRun(v[0], v[1]);
                });
              } else if (location.reload) {
                // `location` global exists in a web worker context but lacks `.reload()` function.
                location.reload();
              }
            }

            if (data.type === 'reload') {
              ws.close();

              ws.onclose = function () {
                location.reload();
              };
            }

            if (data.type === 'error-resolved') {
              console.log('[parcel] ✨ Error resolved');
              removeErrorOverlay();
            }

            if (data.type === 'error') {
              console.error(
                '[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack
              );
              removeErrorOverlay();
              var overlay = createErrorOverlay(data);
              document.body.appendChild(overlay);
            }
          };
        }

        function removeErrorOverlay() {
          var overlay = document.getElementById(OVERLAY_ID);

          if (overlay) {
            overlay.remove();
          }
        }

        function createErrorOverlay(data) {
          var overlay = document.createElement('div');
          overlay.id = OVERLAY_ID; // html encode message and stack trace

          var message = document.createElement('div');
          var stackTrace = document.createElement('pre');
          message.innerText = data.error.message;
          stackTrace.innerText = data.error.stack;
          overlay.innerHTML =
            '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
            '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
            '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
            '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' +
            message.innerHTML +
            '</div>' +
            '<pre>' +
            stackTrace.innerHTML +
            '</pre>' +
            '</div>';
          return overlay;
        }

        function getParents(bundle, id) {
          var modules = bundle.modules;

          if (!modules) {
            return [];
          }

          var parents = [];
          var k, d, dep;

          for (k in modules) {
            for (d in modules[k][1]) {
              dep = modules[k][1][d];

              if (
                dep === id ||
                (Array.isArray(dep) && dep[dep.length - 1] === id)
              ) {
                parents.push(k);
              }
            }
          }

          if (bundle.parent) {
            parents = parents.concat(getParents(bundle.parent, id));
          }

          return parents;
        }

        function hmrApply(bundle, asset) {
          var modules = bundle.modules;

          if (!modules) {
            return;
          }

          if (modules[asset.id] || !bundle.parent) {
            var fn = new Function(
              'require',
              'module',
              'exports',
              asset.generated.js
            );
            asset.isNew = !modules[asset.id];
            modules[asset.id] = [fn, asset.deps];
          } else if (bundle.parent) {
            hmrApply(bundle.parent, asset);
          }
        }

        function hmrAcceptCheck(bundle, id) {
          var modules = bundle.modules;

          if (!modules) {
            return;
          }

          if (!modules[id] && bundle.parent) {
            return hmrAcceptCheck(bundle.parent, id);
          }

          if (checkedAssets[id]) {
            return;
          }

          checkedAssets[id] = true;
          var cached = bundle.cache[id];
          assetsToAccept.push([bundle, id]);

          if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
            return true;
          }

          return getParents(global.parcelRequire, id).some(function (id) {
            return hmrAcceptCheck(global.parcelRequire, id);
          });
        }

        function hmrAcceptRun(bundle, id) {
          var cached = bundle.cache[id];
          bundle.hotData = {};

          if (cached) {
            cached.hot.data = bundle.hotData;
          }

          if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
            cached.hot._disposeCallbacks.forEach(function (cb) {
              cb(bundle.hotData);
            });
          }

          delete bundle.cache[id];
          bundle(id);
          cached = bundle.cache[id];

          if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
            cached.hot._acceptCallbacks.forEach(function (cb) {
              cb();
            });

            return true;
          }
        }
      },
      {},
    ],
  },
  {},
  ['../node_modules/parcel-bundler/src/builtins/hmr-runtime.js', 'index.js'],
  null
);
//# sourceMappingURL=/src.e31bb0bc.js.map
