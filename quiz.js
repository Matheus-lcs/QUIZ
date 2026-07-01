import { pergunta } from './pergunta.js';

export class quiz {
    constructor(tema, perguntas = []) {
        this.tema = tema;
        this.perguntas = perguntas;
        this.index = 0;
        this.acertos = 0;
    }

    static fromData(data) {
        const perguntas = (data.perguntas || []).map(item => {
            return new pergunta(item.pergunta, item.alternativas, item.respostaCorreta);
        });

        return new quiz(data.tema || 'Quiz', perguntas);
    }

    get perguntaAtual() {
        return this.perguntas[this.index];
    }

    get totalPerguntas() {
        return this.perguntas.length;
    }

    get acabou() {
        return this.index >= this.totalPerguntas;
    }

    avancar() {
        if (!this.acabou) {
            this.index += 1;
        }
    }

    reset() {
        this.index = 0;
        this.acertos = 0;
    }
}