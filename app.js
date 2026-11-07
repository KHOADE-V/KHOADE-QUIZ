(function () {
  "use strict";

  var STORAGE_KEY = "khoade-quiz-melhor";

  var telaInicio = document.getElementById("tela-inicio");
  var telaJogo = document.getElementById("tela-jogo");
  var telaFim = document.getElementById("tela-fim");
  var melhorResultadoEl = document.getElementById("melhor-resultado");
  var progressoEl = document.getElementById("progresso");
  var perguntaTextoEl = document.getElementById("pergunta-texto");
  var opcoesEl = document.getElementById("opcoes");
  var feedbackEl = document.getElementById("feedback");
  var btnProxima = document.getElementById("btn-proxima");
  var resultadoTextoEl = document.getElementById("resultado-texto");

  var sessao = null;

  function lerMelhor() {
    try {
      var valor = localStorage.getItem(STORAGE_KEY);
      return valor ? JSON.parse(valor) : null;
    } catch (error) {
      return null;
    }
  }

  function salvarMelhor(acertos, total) {
    try {
      var atual = lerMelhor();
      if (!atual || acertos > atual.acertos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ acertos: acertos, total: total }));
      }
    } catch (error) {
      /* sem armazenamento disponível: só não salva o recorde */
    }
  }

  function mostrarTela(tela) {
    [telaInicio, telaJogo, telaFim].forEach(function (t) {
      t.hidden = t !== tela;
    });
  }

  function renderizarPergunta() {
    var p = sessao.perguntaAtual();
    progressoEl.textContent = "Pergunta " + p.numero + " de " + p.total;
    perguntaTextoEl.textContent = p.pergunta;
    feedbackEl.hidden = true;
    btnProxima.hidden = true;

    opcoesEl.innerHTML = "";
    p.opcoes.forEach(function (texto, indice) {
      var botao = document.createElement("button");
      botao.className = "opcao";
      botao.type = "button";
      botao.textContent = texto;
      botao.addEventListener("click", function () {
        responderPergunta(indice, botao);
      });
      opcoesEl.appendChild(botao);
    });
  }

  function responderPergunta(indiceEscolhido, botaoEscolhido) {
    var resposta = sessao.responder(indiceEscolhido);
    var botoes = Array.prototype.slice.call(opcoesEl.querySelectorAll(".opcao"));
    botoes.forEach(function (botao, indice) {
      botao.disabled = true;
      if (indice === resposta.correta) botao.classList.add("certa");
      else if (botao === botaoEscolhido) botao.classList.add("errada");
    });

    feedbackEl.hidden = false;
    feedbackEl.className = "feedback " + (resposta.acertou ? "certo" : "errado");
    feedbackEl.textContent = resposta.acertou ? "Acertou!" : "Não foi dessa vez.";
    btnProxima.hidden = false;
  }

  function avancar() {
    sessao.proxima();
    if (sessao.terminou()) {
      var resultado = sessao.resultado();
      salvarMelhor(resultado.acertos, resultado.total);
      resultadoTextoEl.textContent = "Você acertou " + resultado.acertos + " de " + resultado.total + ".";
      mostrarTela(telaFim);
    } else {
      renderizarPergunta();
    }
  }

  function comecar(perguntas) {
    sessao = KhoadeQuiz.criarSessao(perguntas);
    mostrarTela(telaJogo);
    renderizarPergunta();
  }

  function iniciarComBusca() {
    fetch("questions.json")
      .then(function (resposta) { return resposta.json(); })
      .then(comecar)
      .catch(function () {
        perguntaTextoEl.textContent = "Não consegui carregar as perguntas (questions.json).";
        mostrarTela(telaJogo);
      });
  }

  document.getElementById("btn-comecar").addEventListener("click", iniciarComBusca);
  document.getElementById("btn-reiniciar").addEventListener("click", function () {
    mostrarTela(telaInicio);
    atualizarMelhor();
  });
  btnProxima.addEventListener("click", avancar);

  function atualizarMelhor() {
    var melhor = lerMelhor();
    if (melhor) {
      melhorResultadoEl.hidden = false;
      melhorResultadoEl.textContent = "Seu melhor resultado: " + melhor.acertos + "/" + melhor.total;
    }
  }

  atualizarMelhor();
})();
