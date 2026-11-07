const assert = require("assert");
const { criarSessao, embaralhar } = require("../quiz.js");

const perguntasExemplo = [
  { pergunta: "1+1?", opcoes: ["1", "2", "3"], correta: 1 },
  { pergunta: "Capital da França?", opcoes: ["Londres", "Paris", "Roma"], correta: 1 },
  { pergunta: "Cor do céu?", opcoes: ["Verde", "Azul", "Roxo"], correta: 1 },
];

const aleatorioFixo = function () { return 0; };

function semEmbaralhar(lista) {
  // mesmo aleatorio() usado dentro de criarSessao, para ordem previsível nos testes
  return criarSessao(lista, aleatorioFixo);
}

function testar(nome, fn) {
  try {
    fn();
    console.log("ok -", nome);
  } catch (erro) {
    console.error("FALHOU -", nome, "\n ", erro.message);
    process.exitCode = 1;
  }
}

testar("rejeita lista vazia", () => {
  assert.throws(() => criarSessao([]), /vazia/);
});

testar("embaralhar preserva os elementos", () => {
  const original = [1, 2, 3, 4, 5];
  const embaralhada = embaralhar(original, Math.random);
  assert.deepStrictEqual([...embaralhada].sort(), [...original].sort());
});

testar("perguntaAtual devolve a primeira pergunta na ordem embaralhada", () => {
  const ordemEsperada = embaralhar(perguntasExemplo, aleatorioFixo);
  const sessao = semEmbaralhar(perguntasExemplo);
  const p = sessao.perguntaAtual();
  assert.strictEqual(p.numero, 1);
  assert.strictEqual(p.total, 3);
  assert.strictEqual(p.pergunta, ordemEsperada[0].pergunta);
});

testar("responder certo conta acerto", () => {
  const sessao = semEmbaralhar(perguntasExemplo);
  const resposta = sessao.responder(1);
  assert.strictEqual(resposta.acertou, true);
  assert.strictEqual(resposta.correta, 1);
});

testar("responder errado nao conta acerto", () => {
  const sessao = semEmbaralhar(perguntasExemplo);
  sessao.responder(0);
  sessao.proxima();
  sessao.responder(1); // acerta a segunda
  sessao.proxima();
  sessao.responder(0); // erra a terceira
  assert.strictEqual(sessao.resultado().acertos, 1);
});

testar("nao deixa responder duas vezes", () => {
  const sessao = semEmbaralhar(perguntasExemplo);
  sessao.responder(1);
  assert.throws(() => sessao.responder(0), /já foi respondida/);
});

testar("nao deixa avancar sem responder", () => {
  const sessao = semEmbaralhar(perguntasExemplo);
  assert.throws(() => sessao.proxima(), /responda a pergunta/);
});

testar("rejeita opcao invalida", () => {
  const sessao = semEmbaralhar(perguntasExemplo);
  assert.throws(() => sessao.responder(99), /opção inválida/);
});

testar("termina apos a ultima pergunta", () => {
  const sessao = semEmbaralhar(perguntasExemplo);
  for (let i = 0; i < 3; i++) {
    sessao.responder(1);
    sessao.proxima();
  }
  assert.strictEqual(sessao.terminou(), true);
  assert.strictEqual(sessao.resultado().total, 3);
});

if (process.exitCode) {
  console.error("\nalguns testes falharam");
} else {
  console.log("\ntodos os testes passaram");
}
