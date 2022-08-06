let cart = [];
let modalQt = 1;
let modalKey = 0;


const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// LISTAGEM DAS PIZZAS
pizzaJson.map((item, index)=> {
    let pizzaItem = c('.models .pizza-item').cloneNode(true); //CLONA O ITEM

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    
    //PREVENDO O CLICK NO PIZZA E ABRINDO O MODAL
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        //SAIR DO CLICK SETADA NO LINK A PARA A CLASSE .PIZZA-ITEM
        //PROCURA O ELEMENTO MAIS PROXIMO QUE TENHA .PIZZA-ITEM
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        //EXIBINDO AS INFORMAÇÕES DA PIZZA NO MODAL
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=> {
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });
        
        //SETANDO A QUANTIDADE INICIAL DE PIZZA NO CARRINHO SEMPRE PARA 1 
        c('.pizzaInfo--qt').innerHTML = modalQt;

        //ANIMAÇÃO DE EXIBIÇÃO DO MODAL EM CONJUNTO COM CSS
        c('.pizzaWindowArea').style.opacity = 0; //ESCONDE O MODAL COM OPACIDADE 0
        c('.pizzaWindowArea').style.display = 'flex'; //TIRANDO DO DISPLAY NONE PARA O DISPLAY FLEX
        setTimeout(()=> { //MOSTRA O MOSTRA O MODAL INDO COM A OPACIDADE DE 0 A 1 EM 200 MILISEGUNDOS PARA FUNCIONAR A ANIMAÇÃO LA DO CSS
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        
    });

    
    // PREENCHER AS INFORMAÇÕES EM PIZZA ITEM
    c('.pizza-area').append(pizzaItem); //MANDA PARA A DIV O ELEMENTO CLONADO
});


//EVENTOS DO MODAL
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=> {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=> {
    item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
    if(modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }  
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=> {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size, sizeIndex)=> {
    size.addEventListener('click', (e)=> {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });

});
c('.pizzaInfo--addButton').addEventListener('click', ()=> {
    //TAMANHO DA PIZZA - parseInt está transformando a quantidade que está como string em inteiro
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    //VERIFICANDO QUANDO TEM A MESMA PIZZA COM O MESMO ID E MESMO TAMANHO, PARA SE UNIREM E AUMENTAR APENAS A QUANTIDADE E NÃO FICAR REPETINDO.
    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=> item.identifier == identifier);

    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }

    updateCart();
    closeModal();
});


c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});


function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;


    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {

            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;


            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                if(cart[i].qt >1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].qt++;
                updateCart();
            });


            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}




//DICAS DE ALUNOS PARA TREINAMENTO


// Repositório : https://github.com/EnriqueSantos-dev/E-commerce-Interativo
// url do projeto : https://e-commerce-interativo.vercel.app/

// Link para a página hospedada no Github:
// https://mtaranto.github.io/pizzeria-project-js/

// Link para o projeto (repositório Gituhub):
// https://github.com/MTaranto/pizzeria-project-js

// github: https://github.com/ErickinMelo/Pokedex
// site: https://erickinmelo.github.io/Pokedex/


// GithHub Pages: https://leopoliveira.github.io/pizzaria/
// Repositório no GitHub: https://github.com/leopoliveira/pizzaria