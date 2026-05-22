/* =========================================
   ARQUIVO: script.js
   Projeto Básico (Estático) - Com Carrossel Automático
========================================= */

// Variável global para armazenar as fotos de cada card
window.carrosseis = {};

// Função de abrir/fechar as especificações
function toggleSpecs(id) { 
    document.getElementById(id).classList.toggle('specs-open'); 
}

// Função que passa as fotos pro lado
window.mudarFoto = function(id, direcao) {
    const carrossel = window.carrosseis[id];
    if(!carrossel) return;

    carrossel.indexAtual += direcao;
    
    // Faz a volta (se for a última volta pra primeira, e vice versa)
    if(carrossel.indexAtual >= carrossel.imagens.length) {
        carrossel.indexAtual = 0;
    } else if(carrossel.indexAtual < 0) {
        carrossel.indexAtual = carrossel.imagens.length - 1;
    }

    const imgElement = document.getElementById(`img-${id}`);
    const contadorElement = document.getElementById(`contador-${id}`);

    // Animação de fade
    imgElement.style.opacity = '0.5';
    setTimeout(() => {
        imgElement.src = carrossel.imagens[carrossel.indexAtual];
        imgElement.style.opacity = '1';
    }, 150);

    if(contadorElement) {
        contadorElement.innerText = `${carrossel.indexAtual + 1} / ${carrossel.imagens.length}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // MÁGICA DO CARROSSEL: Cria os botões automaticamente
    // ----------------------------------------------------
    document.querySelectorAll('.product-card').forEach((card, index) => {
        // Acha a imagem que tem o "data-fotos"
        const imgElement = card.querySelector('img[data-fotos]');
        if(!imgElement) return;

        // Dá um ID único para a imagem (ex: img-1, img-2)
        const id = index + 1;
        imgElement.id = `img-${id}`;
        
        // Pega os links, separa por vírgula e tira os espaços
        const fotosTexto = imgElement.getAttribute('data-fotos');
        const fotosArray = fotosTexto.split(',').map(link => link.trim()).filter(link => link !== "");

        // Se tiver mais de 1 foto, cria as setinhas!
        if(fotosArray.length > 1) {
            window.carrosseis[id] = { indexAtual: 0, imagens: fotosArray };

            const container = imgElement.parentElement;
            container.insertAdjacentHTML('beforeend', `
                <button onclick="mudarFoto(${id}, -1)" class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i data-lucide="chevron-left" class="w-5 h-5"></i>
                </button>
                <button onclick="mudarFoto(${id}, 1)" class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i data-lucide="chevron-right" class="w-5 h-5"></i>
                </button>
                <div id="contador-${id}" class="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">1 / ${fotosArray.length}</div>
            `);
        }
    });

    // Inicia os ícones
    lucide.createIcons();

    // ----------------------------------------------------
    // Sistema de Busca
    // ----------------------------------------------------
    const searchInput = document.getElementById('searchInput');
    const msgVazia = document.getElementById('mensagem-vazia');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.product-card');
            let encontrouAlgo = false;
            
            cards.forEach(card => {
                if (card.getAttribute('data-search').includes(searchTerm)) {
                    card.style.display = 'flex'; 
                    encontrouAlgo = true;
                } else {
                    card.style.display = 'none'; 
                }
            });
            
            const gridHasProducts = document.querySelectorAll('.product-card').length > 0;
            if(msgVazia && gridHasProducts) {
                msgVazia.style.display = encontrouAlgo ? 'none' : 'block';
            }
        });
    }

    // ----------------------------------------------------
    // Alternador de Tema (Modo Escuro / Claro)
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            // Alterna a classe dark no HTML
            document.documentElement.classList.toggle('dark');
            
            // Salva a preferência
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('color-theme', 'dark');
            } else {
                localStorage.setItem('color-theme', 'light');
            }
        });
    }
});