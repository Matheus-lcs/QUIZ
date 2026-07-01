export class pergunta {
    constructor(pergunta, alternativas, respostaCorreta) {
        this.pergunta = pergunta;
        this.alternativas = alternativas;
        this.respostaCorreta = respostaCorreta;
    }

    isRespostaCorreta(indice) {
        return indice === this.respostaCorreta;
    }
}