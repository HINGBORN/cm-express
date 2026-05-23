
// Estado dos carrosséis por produto.
window.carrosseis = {};

// Abre ou fecha o painel de especificações do produto.
function toggleSpecs(id) {
    document.getElementById(id).classList.toggle('specs-open');
}

// Navega entre as imagens do carrossel de um produto.
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