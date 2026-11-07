/**
 * Lógica do KHOADE Quiz, separada do DOM para ser testável em Node e no navegador.
 * No navegador, este arquivo é carregado com <script> e expõe `KhoadeQuiz` em `window`.
 * Em Node (testes), é importado com require().
 */
(function (global) {
  "use strict";

  function embaralhar(lista, aleatorio) {
    aleatorio = aleatorio || Math.random;
    var copia = lista.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(aleatorio() * (i + 1));
      var tmp = copia[i];
      copia[i] = copia[j];
      copia[j] = tmp;
    }
    return copia;
  }

  /**
   * Cria uma sessão de quiz. `perguntas` é o array vindo de questions.json.
   * `aleatorio` é injetável para testes determinísticos (padrão: Math.random).
   */
  function criarSessao(perguntas, aleatorio) {
    if (!Array.isArray(perguntas) || perguntas.length === 0) {
      throw new Error("a lista de perguntas não pode ser vazia");
    }
    var ordem = embaralhar(perguntas, aleatorio);
    var indice = 0;
    var acertos = 0;
    var respondida = false;

    function perguntaAtual() {
      if (indice >= ordem.length) return null;
      var p = ordem[indice];
      return { pergunta: p.pergunta, opcoes: p.opcoes, numero: indice + 1, total: ordem.length };
    }

    function responder(opcaoEscolhida) {
      if (respondida) throw new Error("esta pergunta já foi respondida");
      if (indice >= ordem.length) throw new Error("o quiz já terminou");
      var p = ordem[indice];
      if (opcaoEscolhida < 0 || opcaoEscolhida >= p.opcoes.length) {
        throw new Error("opção inválida: " + opcaoEscolhida);
      }
      respondida = true;
      var acertou = opcaoEscolhida === p.correta;
      if (acertou) acertos++;
      return { acertou: acertou, correta: p.correta };
    }

    function proxima() {
      if (!respondida && indice < ordem.length) {
        throw new Error("responda a pergunta atual antes de avançar");
      }
      indice++;
      respondida = false;
      return perguntaAtual();
    }

    function terminou() {
      return indice >= ordem.length;
    }

    function resultado() {
      return { acertos: acertos, total: ordem.length };
    }

    return {
      perguntaAtual: perguntaAtual,
      responder: responder,
      proxima: proxima,
      terminou: terminou,
      resultado: resultado,
    };
  }

  var KhoadeQuiz = { criarSessao: criarSessao, embaralhar: embaralhar };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = KhoadeQuiz;
  } else {
    global.KhoadeQuiz = KhoadeQuiz;
  }
})(typeof window !== "undefined" ? window : globalThis);
