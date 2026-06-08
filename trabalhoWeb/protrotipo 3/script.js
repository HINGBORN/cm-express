
// Armazena o estado dos carrosséis de cada produto individual.
window.carrosseis = {};

// Armazena o estado e as imagens do carrossel principal (hero).
window.heroCarousel = {
    indexAtual: 0,
    imagens: ['Camera/cam1.jpg', 'Camera/cam2.jpg', 'Camera/cam3.jpg', 'Camera/cam4.jpg', 
              'Camera/cam5.jpg', 'Camera/cam6.jpg', 'Camera/cam7.jpg', 'Camera/cam8.jpg', 
              'Camera/cam9.jpg', 'Camera/cam10.jpg', 'Camera/cam11.jpg']
};

// Função para controlar o carrossel hero
window.mudarCarrosselHero = function (param) {
    const carousel = window.heroCarousel;
    
    // Se for um número entre 0-10, é um índice direto dos pontos
    if (typeof param === 'number' && param >= 0 && param < carousel.imagens.length) {
        carousel.indexAtual = param;
    } 
    // Se for 'prev', vai para anterior
    else if (param === 'prev') {
        carousel.indexAtual--;
        if (carousel.indexAtual < 0) {
            carousel.indexAtual = carousel.imagens.length - 1;
        }
    }
    // Se for 'next', vai para próxima
    else if (param === 'next') {
        carousel.indexAtual++;
        if (carousel.indexAtual >= carousel.imagens.length) {
            carousel.indexAtual = 0;
        }
    }
    
    const imgElement = document.getElementById('heroCarouselImg');
    const counterElement = document.getElementById('heroCarouselCounter');
    
    if (!imgElement) return;
    
    imgElement.style.opacity = '0.7';
    setTimeout(() => {
        imgElement.src = carousel.imagens[carousel.indexAtual];
        imgElement.style.opacity = '1';
    }, 150);
    
    if (counterElement) {
        counterElement.innerText = `${carousel.indexAtual + 1} / ${carousel.imagens.length}`;
    }
    
    atualizarIndicadores();
};

// Atualiza os indicadores de pontos
function atualizarIndicadores() {
    const dotsContainer = document.getElementById('heroCarouselDots');
    const carousel = window.heroCarousel;
    
    dotsContainer.innerHTML = carousel.imagens.map((_, index) => 
        `<button onclick="mudarCarrosselHero(${index})" 
                 class="w-2 h-2 rounded-full transition-all ${index === carousel.indexAtual ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/75'}"
                 aria-label="Ir para imagem ${index + 1}"></button>`
    ).join('');
}

// Abre ou fecha o painel de especificações do produto.
// Cada card tem um bloco escondido que aparece ao clicar em "Ver Especificações".
function toggleSpecs(id) {
    const elementoAlvo = document.getElementById(id);
    
    if (elementoAlvo) {
        const jaEstaAberto = elementoAlvo.classList.contains('specs-open');
        
        document.querySelectorAll('.specs-transition').forEach(div => {
            div.classList.remove('specs-open');
        });
        
        if (!jaEstaAberto) {
            elementoAlvo.classList.add('specs-open');
        }
    }
}

// Navega entre as imagens do carrossel de um produto.
// Os produtos com várias fotos recebem botões "anterior" e "próximo" dinamicamente.
window.mudarFoto = function (id, direcao) {
    const carrossel = window.carrosseis[id];
    if (!carrossel) return;

    carrossel.indexAtual += direcao;

    // Faz o loop entre a primeira e a última imagem.
    if (carrossel.indexAtual >= carrossel.imagens.length) {
        carrossel.indexAtual = 0;
    } else if (carrossel.indexAtual < 0) {
        carrossel.indexAtual = carrossel.imagens.length - 1;
    }

    const imgElement = document.getElementById(`img-${id}`);
    const contadorElement = document.getElementById(`contador-${id}`);

    // Mantém a transição visual suave ao trocar a imagem.
    imgElement.style.opacity = '0.5';
    setTimeout(() => {
        imgElement.src = carrossel.imagens[carrossel.indexAtual];
        imgElement.style.opacity = '1';
    }, 150);

    if (contadorElement) {
        contadorElement.innerText = `${carrossel.indexAtual + 1} / ${carrossel.imagens.length}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Executa após o carregamento do HTML para montar o comportamento do site.

    // Inicializa o carrossel hero e os indicadores de navegação.
    atualizarIndicadores();

    // Cria os controles de navegação para cards com múltiplas fotos.
    document.querySelectorAll('.product-card').forEach((card, index) => {
        // Localiza a imagem principal do card com os dados das fotos.
        const imgElement = card.querySelector('img[data-fotos]');
        if (!imgElement) return;

        // Gera um id estável para o carrossel do produto.
        const id = index + 1;
        imgElement.id = `img-${id}`;

        // Converte a string de fotos em um array limpo.
        const fotosTexto = imgElement.getAttribute('data-fotos');
        const fotosArray = fotosTexto.split(',').map(link => link.trim()).filter(link => link !== "");

        // Insere botões de navegação e contador quando há mais de uma imagem.
        if (fotosArray.length > 1) {
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

    // Renderiza os ícones do Lucide após montar o DOM.
    lucide.createIcons();

    // Filtra os produtos com base no texto digitado pelo usuário.
    const searchInput = document.getElementById('searchInput');
    const msgVazia = document.getElementById('mensagem-vazia');

    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
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
            if (msgVazia && gridHasProducts) {
                msgVazia.style.display = encontrouAlgo ? 'none' : 'block';
            }
        });
    }

    // Alterna o tema claro/escuro e salva a preferência do usuário.
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            // Alterna a classe dark no HTML.
            document.documentElement.classList.toggle('dark');

            // Persiste a preferência do usuário no localStorage.
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('color-theme', 'dark');
            } else {
                localStorage.setItem('color-theme', 'light');
            }
        });
    }
});

// Exibe ou oculta o botão de retorno ao topo conforme o scroll.
const btnTopo = document.getElementById('btnTopo');
if (btnTopo) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnTopo.classList.remove('opacity-0', 'invisible', 'translate-y-4');
            btnTopo.classList.add('opacity-100', 'visible', 'translate-y-0');
        } else {
            btnTopo.classList.add('opacity-0', 'invisible', 'translate-y-4');
            btnTopo.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
    });
    btnTopo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // ----------------------------------------------------
// 5. MODAIS DE TERMOS E PRIVACIDADE
// ----------------------------------------------------
function abrirTermos() { 
    document.getElementById('modalTermos').classList.remove('hidden'); 
}

function abrirPrivacidade() { 
    document.getElementById('modalPrivacidade').classList.remove('hidden'); 
}

function fecharModais() { 
    document.getElementById('modalTermos').classList.add('hidden'); 
    document.getElementById('modalPrivacidade').classList.add('hidden'); 
}
}