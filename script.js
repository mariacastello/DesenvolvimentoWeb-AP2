document.addEventListener("DOMContentLoaded", function () {

    
    const btnSair = document.getElementById("btnSair");
    if (btnSair) {
        btnSair.addEventListener("click", function () {
            localStorage.removeItem('autenticado'); 
            location.replace("index.html"); 
        });
    }

    if ((window.location.pathname.endsWith("home.html") || window.location.pathname.endsWith("detalhes.html")) && localStorage.getItem('autenticado') !== 'true') {
        alert("Somente pessoas autorizadas tem acesso a essa página.");
        window.location.href = "index.html"; 
    }
    
    
});


function verificarSenhaERedirecionar() {
    const senhaDigitada = document.getElementById('senha').value;
    const senhaHash = CryptoJS.MD5(senhaDigitada).toString();

    if (senhaHash === "e8d95a51f3af4a3b134bf6bb680a213a") {
        localStorage.setItem('autenticado', 'true'); 
        window.location.href = "home.html";
    } else {
        alert("Senha incorreta!");
    }
}



function verificarTecla(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        verificarSenhaERedirecionar();
    }
}


const btnEnviar = document.querySelector('button');
if (btnEnviar) {
    btnEnviar.addEventListener("click", function () {
        verificarSenhaERedirecionar();
    });
}

document.addEventListener("DOMContentLoaded", function () {
   
    const btnElencoFeminino = document.getElementById("adicionarElencoFeminino");
    const btnElencoMasculino = document.getElementById("adicionarElencoMasculino");
    const btnElencoAmbos = document.getElementById("adicionarElencoCompleto");

  
    btnElencoFeminino.addEventListener("click", () => carregarElenco("feminino"));
    btnElencoMasculino.addEventListener("click", () => carregarElenco("masculino"));
    btnElencoAmbos.addEventListener("click", () => carregarElenco("all"));

    
    function carregarElenco(genero) {
        const elencoContainer = document.getElementById("elenco");
        const carregandoElemento = document.createElement('p');
        carregandoElemento.className = 'carregando';
        carregandoElemento.textContent = 'Carregando...';
        elencoContainer.innerHTML = '';
        elencoContainer.appendChild(carregandoElemento);    

        fetch(`https://botafogo-atletas.mange.li/${genero}`)
            .then(response => response.json())
            .then(data => {
                elencoContainer.removeChild(carregandoElemento);
                data.forEach(jogador => {
                    const cardAtleta = document.createElement('div');
                    cardAtleta.className = 'atleta-card';
                    cardAtleta.dataset.jogadorId = jogador.id;

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
});

document.addEventListener("DOMContentLoaded", function () {
    const elencoContainer = document.getElementById("elenco");
    
    elencoContainer.addEventListener("click", function (event) {
        const cardClicado = event.target.closest(".atleta-card");
        if (cardClicado) {
            const jogadorId = cardClicado.dataset.jogadorId;
            mostrarDetalhesJogadorPorId(jogadorId);
        }
    });

    function mostrarDetalhesJogadorPorId(jogadorId) {
        window.location.href = `detalhes.html?jogador=${jogadorId}`;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const btnVoltar = document.getElementById("btnVoltar");

    if (btnVoltar) {
        btnVoltar.addEventListener("click", function () {
            window.location.href = "home.html";
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const detalhesContainer = document.querySelector('.detalhes-container');

   
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const jogadorId = urlParams.get('jogador');

    
    if (jogadorId) {
        mostrarDetalhesPorId(jogadorId);
    }

    function mostrarDetalhesPorId(jogadorId) {
    
        fetch(`https://botafogo-atletas.mange.li/${encodeURIComponent(jogadorId)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na resposta da API: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                detalhesContainer.innerHTML = '';

                if (data && data.nome) {
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

                    detalhesContainer.appendChild(detalhesJogador);

                    const detalhesImagem = document.createElement('div');
                    detalhesImagem.className = 'detalhes-imagem';

                    detalhesImagem.innerHTML = `
                        <img src="${data.imagem || ''}" alt="${data.nome}">
                    `;
                    detalhesContainer.appendChild(detalhesImagem);
                } 
            })
    }
});