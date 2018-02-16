(function () {
    var cards = {},
        counter = 1,
        columnMap = Object.freeze({
            1: 'todo',
            2: 'inProgress',
            3: 'done'
        }),
        editCardModal = $('.todo-edit-modal'),
        todoContainerElem = $('.todo-container');

    var card = {
        cloneCard: function (id) {
            let divElement = document.createElement('div');
            divElement.id = id;
            divElement.className = "todo-card";
            divElement.setAttribute('draggable', 'true');
            var cardHeader = '<div class="todo-card-header">' +
                '<div class=todo-card-edit > Edit </div>' +
                '<div class=todo-card-delete> Delete </div>' +
                '</div>' +
                '<div class="todo-card-content">' +
                cards[id].content +
                '</div>';

            divElement.innerHTML = cardHeader;
            $(divElement).bind('dragstart', function (event) {
                event.originalEvent.dataTransfer.setData("text/plain", event.target.getAttribute('id'));
            });
            return divElement;
        },


        createCard: function (name) {
            let itemId = 'item' + counter;
            counter++;
            cards[itemId] = {
                content: name,
                belongsTo: columnMap[1]
            };
            store.updateLocalStorage();
            // todo.push(itemId);
            card.addCard(itemId, cards[itemId].content, cards[itemId].belongsTo);
        },

        addCard: (id, name, columnId) => {
            if (!columnId) {
                columnId = columnMap[1];
            }
            document.getElementById(columnId).appendChild(card.cloneCard(id));
        },

        cardBindings: function () {
            var columns = $('#todo, #inprogress, #done');
            columns.bind('dragover', function (event) {
                event.preventDefault();
            });
            columns.bind('drop', function (event) {
                event.preventDefault();
                var intermediateCard = event.originalEvent.dataTransfer.getData("text/plain");
                if ($(event.target).hasClass('column')) {
                    event.target.appendChild(document.getElementById(intermediateCard));
                }
                else {
                    $('#' + intermediateCard).insertBefore($(event.target).closest('.todo-card'));
                }
                //updating cards object
                cards[intermediateCard].belongsTo = $(event.target).closest('.column').attr('id');
                store.updateLocalStorage();

            });

            todoContainerElem.on('click', '.todo-card-delete', function (event) {
                const cardObj = $(this).closest('.todo-card');
                cardObj.remove();
                delete cards[cardObj.attr('id')];
                counter--;
                store.updateLocalStorage();
            })

            todoContainerElem.on('click', '.todo-card-edit', function (event) {
                var clickedCard = $(this).parent().parent();
                var currText = clickedCard.find('.todo-card-content').text();

                editCardModal.attr('data-originId', clickedCard.attr('id'));
                editCardModal.attr('data-originCurVal', currText);

                $('.todo-edit-modal .edit-card-text').val(currText);
                editCardModal.removeClass('hide-element');

            });

            editCardModal.on('click', '[data-dismiss = "todo-edit-modal" ]', function () {
                editCardModal.addClass('hide-element');
            })

            $('.todo-edit-modal').on('click', '[data-submit = "todo-edit-submit"]', function (event) {
                event.preventDefault();
                var modal = $(this).closest('.todo-edit-modal'),
                    card = $('#' + modal.attr('data-originId')),
                    cardContent = card.find('.todo-card-content'),
                    previousvalue = modal.attr('data-originCurVal'),
                    newVal = $('[data-value = "todo-edit-value"]').val();
                if (!newVal) { //checking empty value
                    cardContent.text(previousvalue);
                }
                else {
                    cardContent.text(newVal);
                    cards[card.attr('id')].content = newVal;
                    store.updateLocalStorage();
                }
                $('.todo-edit-modal').addClass('hide-element');
            })
        }

    };

    //local storage
    var store = {
        updateLocalStorage: function () {
            localStorage.setItem('cards', JSON.stringify(cards))
        },

        checkLocalStorage: function () {
            if (localStorage.getItem('cards')) {
                cards = JSON.parse(localStorage.getItem('cards'));
                counter = Object.keys(cards).length;
                redrawContainer();
            }
            else {
                store.updateLocalStorage();
            }
        }
    }


    card.cardBindings();
    store.checkLocalStorage();

    function redrawContainer(){

        for(let todoCard in cards){
            card.addCard(todoCard, cards[todoCard].content,cards[todoCard].belongsTo);
        }
    }


    window.todo = {
        createElement: card.createCard,
        printTodo: function () {
            console.log(cards);
        }
    }


}())