// LOGIN DO USUÁRIO
let currentUser = null;

function login() {
    const name = document.getElementById("username").value.trim();

    if (!name) return;

    currentUser = name;

    criarReceitasIniciais();

    document.getElementById("loginScreen").style.display = "none";

    renderReceitas();
}

// PEGAR E SALVAR AS RECEITAS NO NAVEGADOR
function getStorageKey() {
    return `receitas_lala_${currentUser}`;
}

function getReceitas() {
    if (!currentUser) return [];
    return JSON.parse(localStorage.getItem(getStorageKey())) || [];
}

function saveReceitas(receitas) {
    if (!currentUser) return;
    localStorage.setItem(getStorageKey(), JSON.stringify(receitas));
}

// ADICIONAR UMA NOVA RECEITA
function addReceita(receita) {
    const receitas = getReceitas();
    receitas.push(receita);
    saveReceitas(receitas);
}

// CRIA RECEITAS INICIAIS PARA NOVOS USUÁRIOS
function criarReceitasIniciais() {
    if (getReceitas().length > 0) return;

    const receitasIniciais = [
        {
            id: "1",
            titulo: "Brigadeiro da Lala",
            ingredientes: "1 lata de leite condensado, 2 colheres de chocolate em pó e 1 colher de manteiga",
            preparo: "Misture tudo na panela e mexa até desgrudar do fundo.",
            tempo: 15,
            categoria: "doces",
            imagem: "",
            favorito: false
        },
        {
            id: "2",
            titulo: "Sanduíche Especial da Lala",
            ingredientes: "Pão, queijo, presunto e alface",
            preparo: "Monte o sanduíche com todos os ingredientes.",
            tempo: 5,
            categoria: "salgados",
            imagem: "",
            favorito: false
        },
        {
            id: "3",
            titulo: "Suco de Morango da Lala",
            ingredientes: "10 morangos, água gelada e açúcar",
            preparo: "Bata tudo no liquidificador por 2 minutos.",
            tempo: 3,
            categoria: "bebidas",
            imagem: "",
            favorito: false
        },
        {
            id: "4",
            titulo: "Beijinho de Coco",
            ingredientes: "1 lata de leite condensado, 1 colher de manteiga e 100g de coco ralado",
            preparo: "Cozinhe em fogo baixo mexendo sempre até desgrudar da panela. Deixe esfriar e enrole.",
            tempo: 15,
            categoria: "doces",
            imagem: "",
            favorito: false
        },
        {
            id: "5",
            titulo: "Pipoca Doce de Cinema",
            ingredientes: "1 xícara de milho, 1/2 xícara de óleo, 1 xícara de açúcar e 4 colheres de água",
            preparo: "Coloque tudo na panela, mexa e tampe. Deixe estourar em fogo médio mexendo a panela fechada.",
            tempo: 10,
            categoria: "doces",
            imagem: "",
            favorito: false
        },
        {
            id: "6",
            titulo: "Misto Quente de Forno",
            ingredientes: "Pão de forma, requeijão, presunto, queijo mozarela e tomate",
            preparo: "Monte camadas de pão, requeijão, frios e tomates. Leve ao forno até o queijo derreter.",
            tempo: 15,
            categoria: "salgados",
            imagem: "",
            favorito: false
        },
        {
            id: "7",
            titulo: "Pão de Queijo de Frigideira",
            ingredientes: "1 ovo, 2 colheres de goma de tapioca, 1 colher de requeijão e sal",
            preparo: "Bata tudo com um garfo e despeje em uma frigideira antiaderente dourando os dois lados.",
            tempo: 5,
            categoria: "salgados",
            imagem: "",
            favorito: false
        },
        {
            id: "8",
            titulo: "Chocolate Quente Cremoso",
            ingredientes: "2 xícaras de leite, 3 colheres de chocolate em pó e 1 colher de amido de milho",
            preparo: "Dissolva o amido no leite, junte o chocolate e leve ao fogo mexendo até engrossar.",
            tempo: 8,
            categoria: "bebidas",
            imagem: "",
            favorito: false
        },
        {
            id: "9",
            titulo: "Pink Lemonade",
            ingredientes: "Suco de 2 limões, 1 xícara de água, açúcar e 2 colheres de xarope de groselha",
            preparo: "Misture o suco de limão com a água e açúcar. Adicione a groselha por último para dar a cor rosa.",
            tempo: 4,
            categoria: "bebidas",
            imagem: "",
            favorito: false
        },
        {
            id: "10",
            titulo: "Milkshake de Ovomaltine",
            ingredientes: "3 bolas de sorvete de creme, 1/2 xícara de leite e 4 colheres de Ovomaltine",
            preparo: "Bata o sorvete e o leite no liquidificador rapidamente. Misture o Ovomaltine com uma colher.",
            tempo: 5,
            categoria: "bebidas",
            imagem: "",
            favorito: false
        }
    ];

    saveReceitas(receitasIniciais);
}


// EDITAR UMA RECEITA JÁ EXISTENTE
function updateReceita(id, dados) {
    let receitas = getReceitas();

    receitas = receitas.map(r => {
        if (r.id === id) {
            // Se nenhuma imagem nova foi enviada, mantém a imagem que já existia
            const imagemFinal = dados.imagem ? dados.imagem : r.imagem;
            return { ...r, ...dados, imagem: imagemFinal };
        }
        return r;
    });

    saveReceitas(receitas);
}

// APAGAR UMA RECEITA
function deleteReceita(id) {
    let receitas = getReceitas();
    receitas = receitas.filter(r => r.id !== id);
    saveReceitas(receitas);
    renderReceitas();
}

// FAVORITAR / DESFAVORITAR RECEITA
function toggleFavorito(id) {
    let receitas = getReceitas();

    receitas = receitas.map(r => {
        if (r.id === id) {
            return { ...r, favorito: !r.favorito };
        }
        return r;
    });

    saveReceitas(receitas);
    renderReceitas();
}

// TRANSFORMAR IMAGEM EM TEXTO PRA SALVAR (base64)
function convertImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

// MOSTRAR AS RECEITAS NA TELA
let page = 1;
const perPage = 4;

function getIcon(categoria) {
    if (categoria === "doces") return "🍩";
    if (categoria === "salgados") return "🥪";
    if (categoria === "bebidas") return "🧃";
    return "🍽️";
}

function renderReceitas() {
    const container = document.getElementById("recipesContainer");
    if (!container) return;
    
    const receitas = getReceitas();
    let filtradas = receitas;

    // filtro por categoria (sidebar) incluindo favoritos
    const categoriaAtiva = document.querySelector(".tab-btn.active")?.dataset.category;

    if (categoriaAtiva === "favoritos") {
        filtradas = filtradas.filter(r => r.favorito);
    } else if (categoriaAtiva && categoriaAtiva !== "todas") {
        filtradas = filtradas.filter(r => r.categoria === categoriaAtiva);
    }

    // paginação
    const start = (page - 1) * perPage;
    const end = start + perPage;

    container.innerHTML = "";

    if (filtradas.length === 0) {
        container.innerHTML = "<p style='font-size: 10px; padding: 10px;'>Nenhuma receita encontrada nesta categoria... 📋</p>";
        renderPagination(0);
        return;
    }

    filtradas.slice(start, end).forEach(receita => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");

        card.innerHTML = `
            <h3>${getIcon(receita.categoria)} ${receita.titulo}</h3>
            ${receita.imagem ? `<img src="${receita.imagem}" alt="${receita.titulo}">` : ""}
            <p><strong>Ingredientes:</strong> ${receita.ingredientes}</p>
            <p><strong>Preparo:</strong> ${receita.preparo}</p>
            <p>⏱ <strong>Tempo:</strong> ${receita.tempo} min</p>
            <button onclick="toggleFavorito('${receita.id}')">
                ${receita.favorito ? "❤️ Favorito" : "🤍 Favoritar"}
            </button>
            <button onclick="editReceita('${receita.id}')">✏️ Editar</button>
            <button onclick="deleteReceita('${receita.id}')">🗑 Excluir</button>
        `;
        container.appendChild(card);
    });

    renderPagination(filtradas.length);
}

// EDITAR UMA RECEITA 
function editReceita(id) {
    const receitas = getReceitas();
    const r = receitas.find(item => item.id === id);

    if (!r) return;

    document.getElementById("titulo").value = r.titulo;
    document.getElementById("ingredientes").value = r.ingredientes;
    document.getElementById("preparo").value = r.preparo;
    document.getElementById("tempo").value = r.tempo;
    document.getElementById("categoria").value = r.categoria;

    document.getElementById("formTitle").textContent = "Editar Receita ✏️";
    document.getElementById("recipeForm").dataset.editing = id;
    
    // Rola a página suavemente até o formulário de edição
    document.getElementById("recipeForm").scrollIntoView({ behavior: 'smooth' });
}

// PAGINAÇÃO
function renderPagination(total) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(total / perPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = `📖 ${i}`;
        if (i === page) {
            btn.style.background = "#da70d6";
            btn.style.color = "#fff";
        }
        btn.onclick = () => {
            page = i;
            renderReceitas();
        };
        pagination.appendChild(btn);
    }
}

// QUANDO ENVIA O FORMULÁRIO (salvar ou editar)
document.getElementById("recipeForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const file = document.getElementById("imagemReceita").files[0];
    let imagem = "";

    if (file) {
        imagem = await convertImage(file);
    }

    const editando = this.dataset.editing;

    const dadosReceita = {
        titulo: document.getElementById("titulo").value,
        ingredientes: document.getElementById("ingredientes").value,
        preparo: document.getElementById("preparo").value,
        tempo: document.getElementById("tempo").value,
        categoria: document.getElementById("categoria").value,
        imagem: imagem
    };

    if (editando) {
        updateReceita(editando, dadosReceita);
        delete this.dataset.editing;
        document.getElementById("formTitle").textContent = "Adicionar Receita";
    } else {
        const novaReceita = {
            id: Date.now().toString(),
            ...dadosReceita,
            favorito: false
        };
        addReceita(novaReceita);
    }

    this.reset();
    page = 1; // Volta para a primeira página para ver as alterações
    renderReceitas();
});

// CATEGORIAS (botões da lateral)
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        page = 1;
        renderReceitas();
    });
});

// EXPORTAR TUDO EM JSON
function exportJSON() {
    const data = getReceitas();
    if (data.length === 0) {
        alert("Não há receitas para exportar!");
        return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `livro-receitas-${currentUser}.json`;
    a.click();
}

// QUANDO A PÁGINA ABRE (Removida a chamada direta de renderizar sem login)
window.addEventListener("load", () => {
    // Apenas aguarda a ação de login do usuário agora.
});