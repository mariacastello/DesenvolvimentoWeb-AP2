
document.addEventListener("DOMContentLoaded", () => {

    
    const exitButton = document.getElementById("exitButton");
    if (exitButton) {
        exitButton.addEventListener("click", () => {
            localStorage.removeItem('autenticado'); 
            location.replace("index.html"); 
        });
    }

    if ((window.location.pathname.endsWith("home.html") || window.location.pathname.endsWith("detalhes.html")) && localStorage.getItem('autenticado') !== 'true') {
        alert("Somente pessoas autorizadas tem acesso a essa página.");
        window.location.href = "index.html"; 
    }
    
    
});


function checkPassword() {
    const writtenPassword = document.getElementById('senha').value;
    const passwordHash = CryptoJS.MD5(writtenPassword).toString();

    if (passwordHash === "e8d95a51f3af4a3b134bf6bb680a213a") {
        localStorage.setItem('autenticado', 'true'); 
        window.location.href = "home.html";
    } else {
        alert("Senha incorreta!");
    }
}



function checkKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        checkPassword();
    }
}


const submitButton = document.querySelector('button');
if (submitButton) {
    submitButton.addEventListener("click", () => {
        checkPassword();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const buttonElencoFeminino = document.getElementById("ElencoFeminino");
    const buttonElencoMasculino = document.getElementById("ElencoMasculino");
    const buttonElencoAmbos = document.getElementById("ElencoCompleto");

    if (buttonElencoFeminino) buttonElencoFeminino.addEventListener("click", () => loadCast("feminino"));
    if (buttonElencoMasculino) buttonElencoMasculino.addEventListener("click", () => loadCast("masculino"));
    if (buttonElencoAmbos) buttonElencoAmbos.addEventListener("click", () => loadCast("all"));
});
    
    function loadCast(genero) {
        const elencoContainer = document.getElementById("elenco");
        const loadingElemento = document.createElement('p');
        loadingElemento.className = 'carregando';
        loadingElemento.textContent = 'Carregando...';
        elencoContainer.innerHTML = '';
        elencoContainer.appendChild(loadingElemento);    

        fetch(`https://botafogo-atletas.mange.li/${genero}`)
            .then(response => response.json())
            .then(data => {
                elencoContainer.removeChild(loadingElemento);
                data.forEach(jogador => {
                    const cardAtleta = document.createElement('div');
                    cardAtleta.className = 'atleta-card';
                    cardAtleta.dataset.playerId = jogador.id;

                    const imagemAtleta = document.createElement('img');
                    imagemAtleta.className = 'atleta-img';
                    imagemAtleta.src = jogador.imagem;

                    const detalhesAtleta = document.createElement('div');
                    detalhesAtleta.className = 'atleta-detalhes';
                    detalhesAtleta.innerHTML = `
                        <p>${jogador.nome_completo}</p>
                    `;

                    cardAtleta.appendChild(imagemAtleta);
                    cardAtleta.appendChild(detalhesAtleta);

                    elencoContainer.appendChild(cardAtleta);
                });
            })
            .catch(error => {
                console.error(`Erro ao buscar jogadores ${genero}:`, error);
            });
    }
;

document.addEventListener("DOMContentLoaded", function() {
    const elencoContainer = document.getElementById("elenco");
    
    if (elencoContainer) {
        elencoContainer.addEventListener("click", function(event) {
            const card = event.target.closest(".atleta-card");
            if (card) {
                const playerId = card.dataset.playerId;
                playerDetails(playerId);
            }
        });
    }

    function playerDetails(playerId) {
        window.location.href = `detalhes.html?jogador=${playerId}`;
    }
});  


document.addEventListener("DOMContentLoaded", () => {
    const returnButton = document.getElementById("returnButton");

    if (returnButton) {
        returnButton.addEventListener("click", () => {
            window.location.href = "home.html";
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const detailsContainer = document.querySelector('.details-container');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const playerId = urlParams.get('jogador');

    if (playerId && detailsContainer) {
        displayDetailsById(playerId);
    }

    function displayDetailsById(playerId) {
        fetch(`https://botafogo-atletas.mange.li/${encodeURIComponent(playerId)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na resposta da API: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (detailsContainer) {
                    detailsContainer.innerHTML = '';
                    const detalhesJogador = document.createElement('div');
                    detalhesJogador.className = 'detalhes-jogador';

                    detalhesJogador.innerHTML = `
                        <h2>${data.nome}</h2>
                        <h3>${data.posicao || 'N/A'}</h3>
                        </br>
                        <p>${data.descricao || 'N/A'}</p>
                        <p>Nome Completo: ${data.nome_completo || 'N/A'}</p>
                        <p>Nascimento: ${data.nascimento || 'N/A'}</p>
                        <p>Altura: ${data.altura || 'N/A'}</p>
                    `;
                    detailsContainer.appendChild(detalhesJogador);

                    const detalhesImagem = document.createElement('div');
                    detalhesImagem.className = 'detalhes-imagem';

                    detalhesImagem.innerHTML = `
                        <img src="${data.imagem || ''}" alt="${data.nome}">
                    `;
                    detailsContainer.appendChild(detalhesImagem);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar detalhes do jogador:', error);
            });
    }
});