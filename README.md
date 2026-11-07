# KHOADE Quiz

Quiz de múltipla escolha sobre tecnologia, rodando inteiramente no navegador: HTML, CSS e JavaScript puro, sem framework e sem build.

## Recursos

- 10 perguntas, em ordem embaralhada a cada partida
- Feedback imediato (certo/errado) e a resposta certa destacada
- Melhor resultado salvo no `localStorage` do navegador
- Tema escuro/claro automático

## Como jogar

Abra o `index.html` no navegador, ou sirva localmente (necessário para o `fetch` do `questions.json` funcionar em alguns navegadores):

```bash
python3 -m http.server 8000
```

e acesse `http://localhost:8000`.

## Adicionando perguntas

Edite `questions.json`. Cada pergunta é um objeto:

```json
{
  "pergunta": "Texto da pergunta?",
  "opcoes": ["Opção A", "Opção B", "Opção C"],
  "correta": 1
}
```

`correta` é o índice (começando em 0) da opção certa dentro de `opcoes`.

## Publicar no GitHub Pages

**Settings → Pages → Deploy from a branch → `main` / `(root)`**.

## Testes

A lógica do quiz (`quiz.js`) é separada da tela e roda em Node:

```bash
node tests/test_quiz.js
```

## Licença

MIT.
