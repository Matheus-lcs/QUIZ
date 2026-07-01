import { quiz } from './quiz.js';

const temaTitulo = document.getElementById('tema-titulo');
const contador = document.getElementById('contador');
const barraProgresso = document.getElementById('barra-progresso');
const perguntaTexto = document.getElementById('pergunta-texto');
const alternativasLista = document.getElementById('alternativas');
const placar = document.getElementById('placar');
const btnProxima = document.getElementById('btn-proxima');
const telaQuiz = document.getElementById('tela-quiz');
const telaFinal = document.getElementById('tela-final');
const resultadoFinal = document.getElementById('resultado-final');
const btnReiniciar = document.getElementById('btn-reiniciar');

let quizApp = null;
let respostaSelecionada = null;

window.addEventListener('DOMContentLoaded', iniciarQuiz);

async function iniciarQuiz() {
    try {
        const dados = await carregarPerguntas();
        quizApp = quiz.fromData(dados);

        btnProxima.addEventListener('click', avancarPergunta);
        btnReiniciar.addEventListener('click', reiniciarQuiz);

        renderizarPergunta();
    } catch (erro) {
        perguntaTexto.textContent = 'Não foi possível carregar o quiz. Abra o projeto por um servidor local e tente novamente.';
        console.error(erro);
    }
}

async function carregarPerguntas() {
    const resposta = await fetch('./perguntas-respostas.json');
    if (!resposta.ok) {
        throw new Error('Falha ao carregar perguntas');
    }

    return resposta.json();
}

function renderizarPergunta() {
    if (!quizApp) {
        return;
    }

    if (quizApp.acabou) {
        mostrarTelaFinal();
        return;
    }

    mostrarTelaQuiz();

    const perguntaAtual = quizApp.perguntaAtual;

    temaTitulo.textContent = quizApp.tema;
    contador.textContent = `Pergunta ${quizApp.index + 1} de ${quizApp.totalPerguntas}`;
    barraProgresso.style.width = `${(quizApp.index / quizApp.totalPerguntas) * 100}%`;
    perguntaTexto.textContent = perguntaAtual.pergunta;
    placar.textContent = `Pontuação: ${quizApp.acertos}`;

    alternativasLista.innerHTML = '';
    respostaSelecionada = null;
    btnProxima.disabled = true;

    perguntaAtual.alternativas.forEach((texto, indice) => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'list-group-item list-group-item-action';
        botao.textContent = texto;
        botao.dataset.indice = String(indice);

        botao.addEventListener('click', () => selecionarAlternativa(indice, botao));
        alternativasLista.appendChild(botao);
    });
}

function selecionarAlternativa(indice, botao) {
    respostaSelecionada = indice;
    btnProxima.disabled = false;

    alternativasLista.querySelectorAll('button').forEach(item => {
        item.classList.remove('active');
    });

    botao.classList.add('active');
}

function avancarPergunta() {
    if (respostaSelecionada === null || !quizApp) {
        return;
    }

    const correta = quizApp.perguntaAtual.isRespostaCorreta(respostaSelecionada);
    if (correta) {
        quizApp.acertos += 1;
    }

    quizApp.avancar();

    if (quizApp.acabou) {
        mostrarTelaFinal();
    } else {
        renderizarPergunta();
    }
}

function reiniciarQuiz() {
    if (!quizApp) {
        return;
    }

    quizApp.reset();
    renderizarPergunta();
}

function mostrarTelaQuiz() {
    telaQuiz.classList.remove('d-none');
    telaFinal.classList.add('d-none');
}

function mostrarTelaFinal() {
    telaQuiz.classList.add('d-none');
    telaFinal.classList.remove('d-none');
    resultadoFinal.textContent = `${quizApp.acertos} de ${quizApp.totalPerguntas}`;
}