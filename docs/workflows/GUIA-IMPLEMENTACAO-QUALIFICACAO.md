# Guia de Implementação: Formulário de Qualificação no Workflow site.json

## Instrução Geral

Este guia contém os 6 novos nós que devem ser criados no workflow **site.json** do n8n.

**IMPORTANTE**: É recomendado fazer essas modificações no **editor visual do n8n**, não editando o JSON diretamente, para evitar problemas de IDs e conexões.

---

## Passo 1: Criar Nó `detectar_start` (Switch)

**Local**: Logo após o nó `config`

**Tipo**: Switch (n8n-nodes-base.switch)

**Configuração**:

```json
{
  "parameters": {
    "rules": {
      "values": [
        {
          "conditions": {
            "options": {
              "caseSensitive": true,
              "leftValue": "",
              "typeValidation": "strict",
              "version": 2
            },
            "conditions": [
              {
                "leftValue": "={{ $json.mensagem }}",
                "rightValue": "__start__",
                "operator": {
                  "type": "string",
                  "operation": "equals"
                }
              }
            ],
            "combinator": "and"
          },
          "renameOutput": true,
          "outputKey": "start"
        },
        {
          "conditions": {
            "options": {
              "caseSensitive": true,
              "leftValue": "",
              "typeValidation": "strict",
              "version": 2
            },
            "conditions": [
              {
                "leftValue": "={{ $('Webhook').item.json.body.data.form_id }}",
                "rightValue": "qualificacao_inicial",
                "operator": {
                  "type": "string",
                  "operation": "equals"
                }
              }
            ],
            "combinator": "and"
          },
          "renameOutput": true,
          "outputKey": "qualificacao_form"
        },
        {
          "conditions": {
            "options": {
              "caseSensitive": true,
              "leftValue": "",
              "typeValidation": "strict",
              "version": 2
            },
            "conditions": [
              {
                "leftValue": "true",
                "rightValue": "true",
                "operator": {
                  "type": "boolean",
                  "operation": "equals"
                }
              }
            ],
            "combinator": "and"
          },
          "renameOutput": true,
          "outputKey": "outros"
        }
      ]
    },
    "options": {}
  },
  "name": "detectar_start",
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3.2
}
```

**Conexões**:
- **Input**: Recebe de `config`
- **Outputs**:
  - `start` → `resposta_start_com_form`
  - `qualificacao_form` → `validar_bloqueadores`
  - `outros` → `mensagem_tipo` (fluxo normal existente)

---

## Passo 2: Criar Nó `resposta_start_com_form` (Edit/Set)

**Tipo**: Edit Fields (n8n-nodes-base.set)

**Configuração**:

```json
{
  "parameters": {
    "assignments": {
      "assignments": [
        {
          "name": "messages",
          "value": [
            {
              "text": "Olá! Sou a Dra. Ana, consultora da TirzepaLife 😊",
              "delay": 1000
            },
            {
              "text": "Para te orientar com segurança, preciso fazer algumas perguntas rápidas sobre sua saúde.",
              "delay": 1800
            },
            {
              "text": "São apenas 4 perguntas e leva menos de 1 minuto!",
              "delay": 1500
            }
          ],
          "type": "object"
        },
        {
          "name": "ui",
          "value": {
            "type": "form_card",
            "id": "qualificacao_inicial",
            "title": "Questionário de Elegibilidade",
            "description": "Para sua segurança, preciso fazer algumas perguntas rápidas antes de prosseguir.",
            "submitLabel": "Enviar Respostas",
            "fields": [
              {
                "name": "gestante_lactante",
                "label": "Você está grávida ou amamentando?",
                "type": "single_select",
                "required": true,
                "options": [
                  { "value": "sim", "label": "Sim" },
                  { "value": "nao", "label": "Não" }
                ]
              },
              {
                "name": "historico_tireoide",
                "label": "Você ou alguém da sua família teve câncer medular de tireoide ou NEM2?",
                "type": "single_select",
                "required": true,
                "helperText": "NEM2 = Neoplasia Endócrina Múltipla tipo 2",
                "options": [
                  { "value": "sim", "label": "Sim" },
                  { "value": "nao", "label": "Não" },
                  { "value": "nao_sei", "label": "Não sei" }
                ]
              },
              {
                "name": "uso_anterior_glp1",
                "label": "Você já usou algum medicamento similar antes?",
                "type": "single_select",
                "required": true,
                "helperText": "Ex.: Ozempic, Saxenda, Wegovy, Victoza",
                "options": [
                  { "value": "ozempic", "label": "Sim, Ozempic" },
                  { "value": "saxenda", "label": "Sim, Saxenda" },
                  { "value": "wegovy", "label": "Sim, Wegovy" },
                  { "value": "outro", "label": "Sim, outro" },
                  { "value": "nao", "label": "Não" }
                ]
              },
              {
                "name": "objetivo",
                "label": "Qual é o seu objetivo principal?",
                "type": "single_select",
                "required": true,
                "options": [
                  { "value": "emagrecimento", "label": "Emagrecimento" },
                  { "value": "apetite", "label": "Controle de apetite" },
                  { "value": "metabolico", "label": "Controle metabólico" },
                  { "value": "saude", "label": "Melhorar saúde geral" }
                ]
              }
            ]
          },
          "type": "object"
        }
      ]
    },
    "options": {}
  },
  "name": "resposta_start_com_form",
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.4
}
```

**Conexões**:
- **Input**: Recebe de `detectar_start` (output `start`)
- **Output**: Vai direto para `Respond to Webhook`

---

## Passo 3: Criar Nó `validar_bloqueadores` (Code - JavaScript)

**Tipo**: Code (n8n-nodes-base.code)

**Configuração**:

```javascript
// Extrai respostas do formulário
const form = $input.item.json.body.data.form;
const gestante = form.gestante_lactante === "sim";
const tireoide = form.historico_tireoide === "sim";
const tireoideDuvida = form.historico_tireoide === "nao_sei";

let status = "qualificado";
let tipo_bloqueio = null;

if (gestante) {
  status = "desqualificado_gestante";
  tipo_bloqueio = "gestante";
} else if (tireoide) {
  status = "desqualificado_tireoide";
  tipo_bloqueio = "tireoide";
} else if (tireoideDuvida) {
  status = "alerta_tireoide_incerto";
  tipo_bloqueio = null;
}

return {
  json: {
    gestante_lactante: gestante,
    historico_tireoide: tireoide,
    historico_tireoide_incerto: tireoideDuvida,
    uso_anterior_glp1: form.uso_anterior_glp1 !== "nao",
    objetivo: form.objetivo,
    status_validacao: status,
    tipo_bloqueio: tipo_bloqueio,
    desqualificado: status.startsWith("desqualificado"),
    form_original: form,
    remoteJid: $input.item.json.body.data.key.remoteJid
  }
};
```

**Configuração no n8n**:
- Mode: Run Once for All Items
- Language: JavaScript

**Conexões**:
- **Input**: Recebe de `detectar_start` (output `qualificacao_form`)
- **Output**: Vai para `switch_desqualificado`

---

## Passo 4: Criar Nó `switch_desqualificado` (Switch)

**Tipo**: Switch (n8n-nodes-base.switch)

**Configuração**:

```json
{
  "parameters": {
    "rules": {
      "values": [
        {
          "conditions": {
            "options": {
              "caseSensitive": true,
              "leftValue": "",
              "typeValidation": "strict",
              "version": 2
            },
            "conditions": [
              {
                "leftValue": "={{ $json.desqualificado }}",
                "rightValue": true,
                "operator": {
                  "type": "boolean",
                  "operation": "equals"
                }
              }
            ],
            "combinator": "and"
          },
          "renameOutput": true,
          "outputKey": "desqualificado"
        },
        {
          "conditions": {
            "options": {
              "caseSensitive": true,
              "leftValue": "",
              "typeValidation": "strict",
              "version": 2
            },
            "conditions": [
              {
                "leftValue": "={{ $json.desqualificado }}",
                "rightValue": false,
                "operator": {
                  "type": "boolean",
                  "operation": "equals"
                }
              }
            ],
            "combinator": "and"
          },
          "renameOutput": true,
          "outputKey": "qualificado"
        }
      ]
    },
    "options": {}
  },
  "name": "switch_desqualificado",
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3.2
}
```

**Conexões**:
- **Input**: Recebe de `validar_bloqueadores`
- **Outputs**:
  - `desqualificado` → `mensagem_desqualificacao`
  - `qualificado` → `mensagem_qualificado`

---

## Passo 5: Criar Nó `mensagem_desqualificacao` (Edit/Set)

**Tipo**: Edit Fields (n8n-nodes-base.set)

**Configuração**:

```json
{
  "parameters": {
    "assignments": {
      "assignments": [
        {
          "name": "messages",
          "value": "={{ (() => {\n  const tipo = $json.tipo_bloqueio;\n  \n  if (tipo === 'gestante') {\n    return [\n      { text: \"Obrigada por responder com sinceridade 💙\", delay: 1200 },\n      { text: \"Por segurança, a Tirzepatida não é recomendada durante a gestação ou amamentação, pois ainda não há estudos suficientes sobre possíveis efeitos.\", delay: 2500 },\n      { text: \"O ideal é conversar com seu obstetra para avaliar alternativas seguras nesse momento. Se quiser, posso te ajudar com dúvidas sobre alimentação e hábitos saudáveis!\", delay: 2200 }\n    ];\n  }\n  \n  if (tipo === 'tireoide') {\n    return [\n      { text: \"Obrigada por compartilhar isso comigo 💙\", delay: 1200 },\n      { text: \"Por precaução médica, quando há histórico pessoal ou familiar de câncer medular de tireoide ou NEM2, a Tirzepatida não é recomendada.\", delay: 2800 },\n      { text: \"Sugiro que você consulte um endocrinologista para uma avaliação personalizada e segura. Se tiver outras dúvidas sobre saúde metabólica, estou aqui!\", delay: 2400 }\n    ];\n  }\n  \n  return [\n    { text: \"Obrigada por responder 💙\", delay: 1000 },\n    { text: \"Por segurança, preciso que você converse com um médico antes de prosseguir.\", delay: 2000 }\n  ];\n})() }}",
          "type": "object"
        }
      ]
    },
    "options": {}
  },
  "name": "mensagem_desqualificacao",
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.4
}
```

**Conexões**:
- **Input**: Recebe de `switch_desqualificado` (output `desqualificado`)
- **Output**: Vai direto para `Respond to Webhook`

---

## Passo 6: Criar Nó `mensagem_qualificado` (Edit/Set)

**Tipo**: Edit Fields (n8n-nodes-base.set)

**Configuração**:

```json
{
  "parameters": {
    "assignments": {
      "assignments": [
        {
          "name": "messages",
          "value": "={{ (() => {\n  const tireoideDuvida = $json.historico_tireoide_incerto === true;\n  \n  if (tireoideDuvida) {\n    return [\n      { text: \"Obrigada pelas respostas! 😊\", delay: 1200 },\n      { text: \"Sobre o histórico de tireoide: como você não tem certeza, recomendo verificar isso com seu médico antes de começar qualquer tratamento, ok?\", delay: 2500 },\n      { text: \"Mas posso te encaminhar ao nosso especialista para tirar dúvidas e entender se faz sentido pra você.\", delay: 2000 },\n      { text: \"Você quer tirar uma dúvida rápida ou prefere já conversar sobre os próximos passos?\", delay: 1800 }\n    ];\n  }\n  \n  return [\n    { text: \"Perfeito! Obrigada pelas respostas 😊\", delay: 1200 },\n    { text: \"Pelo que você me contou, faz sentido conversarmos mais sobre o tratamento.\", delay: 1800 },\n    { text: \"Você quer tirar uma dúvida rápida ou prefere já falar sobre os próximos passos?\", delay: 1600 }\n  ];\n})() }}",
          "type": "object"
        }
      ]
    },
    "options": {}
  },
  "name": "mensagem_qualificado",
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.4
}
```

**Conexões**:
- **Input**: Recebe de `switch_desqualificado` (output `qualificado`)
- **Output**: Vai direto para `Respond to Webhook`

---

## Resumo das Conexões

```
config
  ↓
detectar_start
  ├─ start → resposta_start_com_form → Respond to Webhook
  ├─ qualificacao_form → validar_bloqueadores
  │                         ↓
  │                    switch_desqualificado
  │                         ├─ desqualificado → mensagem_desqualificacao → Respond to Webhook
  │                         └─ qualificado → mensagem_qualificado → Respond to Webhook
  └─ outros → mensagem_tipo (fluxo normal)
```

---

## Checklist de Implementação

- [ ] Criar nó `detectar_start` (Switch)
- [ ] Criar nó `resposta_start_com_form` (Edit/Set)
- [ ] Criar nó `validar_bloqueadores` (Code)
- [ ] Criar nó `switch_desqualificado` (Switch)
- [ ] Criar nó `mensagem_desqualificacao` (Edit/Set)
- [ ] Criar nó `mensagem_qualificado` (Edit/Set)
- [ ] Conectar `config` → `detectar_start`
- [ ] Conectar outputs de `detectar_start` conforme diagrama
- [ ] Conectar `validar_bloqueadores` → `switch_desqualificado`
- [ ] Conectar outputs de `switch_desqualificado` conforme diagrama
- [ ] Testar fluxo `__start__`
- [ ] Testar fluxo de desqualificação (gestante)
- [ ] Testar fluxo de desqualificação (tireoide)
- [ ] Testar fluxo de qualificação com alerta (não sei)
- [ ] Testar fluxo de qualificação completa
- [ ] Salvar e ativar workflow

---

## Notas Importantes

1. **Posições**: As posições (position: [x, y]) no canvas podem ser ajustadas visualmente no n8n
2. **IDs**: Os IDs dos nós serão gerados automaticamente pelo n8n
3. **Testagem**: Use o botão "Test Workflow" do n8n para testar com dados mock antes de ativar
4. **Backup**: Faça backup do workflow atual antes de fazer modificações

---

## Dados de Teste

### Teste 1: __start__ (deve retornar formulário)
```json
{
  "body": {
    "data": {
      "key": {
        "remoteJid": "web_12345@s.whatsapp.net",
        "fromMe": false,
        "id": "test123"
      },
      "pushName": "Visitante Web",
      "message": {
        "conversation": "__start__"
      },
      "messageType": "conversation"
    }
  }
}
```

### Teste 2: Formulário com gestante=sim (deve desqualificar)
```json
{
  "body": {
    "data": {
      "key": {
        "remoteJid": "web_12345@s.whatsapp.net",
        "fromMe": false,
        "id": "test456"
      },
      "form_id": "qualificacao_inicial",
      "form": {
        "gestante_lactante": "sim",
        "historico_tireoide": "nao",
        "uso_anterior_glp1": "nao",
        "objetivo": "emagrecimento"
      }
    }
  }
}
```

### Teste 3: Formulário qualificado (deve prosseguir)
```json
{
  "body": {
    "data": {
      "key": {
        "remoteJid": "web_12345@s.whatsapp.net",
        "fromMe": false,
        "id": "test789"
      },
      "form_id": "qualificacao_inicial",
      "form": {
        "gestante_lactante": "nao",
        "historico_tireoide": "nao",
        "uso_anterior_glp1": "ozempic",
        "objetivo": "emagrecimento"
      }
    }
  }
}
```
