# PRD — Segue Nota

> **Versão:** 5.0 · **Data:** 03/11/2026 · **Produto:** Segue Nota · **Empresa:** M2S Tech Ltda
> **Status:** aprovado para início do desenvolvimento (com pendências registradas na seção 21)

---

## 0. CONTROLE DO DOCUMENTO

### 0.1 Fontes de referência

| Fonte | Local | Uso |
|---|---|---|
| Documentação técnica do NF Tracker (legado) | `E:\M2S\NF_tracker\DOCUMENTACAO_TECNICA.md` | Conhecimento do domínio, algoritmos e limitações do sistema atual |
| Documentação oficial da API ADN (swaggers + manual) | `E:\M2S\NF_tracker\Ducumentação API NFSe\` | Contrato da API nacional. **Exceto** a API de DANFSe, que está defasada |
| Especificação de geração do DANFSe | `E:\M2S\NF_tracker\gerar_danfse_pdf.py` | Referência de layout e regras da NT-008 (v1.02, 14/07/2026) para gerar o PDF |
| Código legado do NF Tracker | `E:\M2S\NF_tracker\*.py` | Consulta apenas |

### 0.2 Regras sobre o código legado

- O repositório `E:\M2S\NF_tracker` é **somente leitura**. Nenhum arquivo pode ser criado, alterado ou removido nele.
- O Segue Nota será desenvolvido **do zero**, em repositório próprio (`E:\seguenota`).
- O código legado é Python; o Segue Nota é TypeScript (web) e .NET (agente). A lógica de negócio do legado deve ser **reimplementada a partir da especificação**, não copiada.
- Segredos, chaves e credenciais do legado (`.env`, valores fixos no código) **não podem ser reaproveitados** nem copiados para o novo projeto.

### 0.3 Principais mudanças em relação à V4

1. Certificado **A3 removido do escopo** (melhoria futura).
2. Modelo de certificado definido: **cada CNPJ monitorado possui exatamente um certificado A1 próprio**, instalado no computador do cliente; procuração e representação ficam fora do escopo.
3. **DANFSe gerado pela plataforma a partir do XML**, conforme a NT-008, sem depender da API de DANFSe (sobrestada) nem do agente.
4. Definidos a semântica do período da sincronização inicial, a competência fechada e os documentos extemporâneos.
5. Definidos o mapeamento de eventos fiscais em situações da nota e o modelo de dados fiscal mínimo.
6. Regra de exclusividade: **cada CNPJ é sincronizado por um único agente**.
7. Agente Windows: candidato preferencial **.NET 10 (LTS)**, a confirmar na prova de conceito.
8. Escopo do MVP, decisões registradas e pendências explícitas.
9. Seções renumeradas e padronizadas.

---

## 1. CONTEXTO E PROBLEMA

Empresas e escritórios de contabilidade enfrentam dificuldades para consultar, capturar, organizar e acompanhar Notas Fiscais de Serviço Eletrônicas (NFS-e), especialmente quando administram múltiplos CNPJs e grandes volumes de documentos.

A obtenção de XMLs pelo Portal Nacional pode exigir operações manuais repetitivas, o que torna a rotina fiscal demorada e sujeita a falhas. Além disso:

- documentos podem ser disponibilizados no Ambiente de Dados Nacional (ADN) depois da emissão;
- a competência fiscal pode ser diferente da data de emissão;
- notas podem ser canceladas ou substituídas depois de capturadas.

Essas situações dificultam a conferência fiscal e geram documentos não identificados, informações desatualizadas, retrabalho e inconsistências nos fechamentos contábeis.

As soluções existentes nem sempre dão visibilidade sobre a atualização dos documentos, as falhas de captura e as alterações posteriores. Muitas dependem de consultas manuais, o que dificulta o acompanhamento contínuo.

O **NF Tracker** atual (desktop, Python) já automatiza o download de XMLs por período e a conversão em Excel. Porém, ele:

- depende de execução manual e de instalação desktop;
- exige escolher o certificado a cada operação;
- não faz monitoramento contínuo;
- não oferece gestão centralizada de múltiplos contribuintes.

**Problema central:** falta uma solução acessível, automatizada e confiável que centralize os documentos fiscais, reduza a intervenção humana, acompanhe novas notas e eventos fiscais e mantenha as informações atualizadas para a conferência e o fechamento contábil.

---

## 2. SOLUÇÃO PROPOSTA

O **Segue Nota** será uma plataforma SaaS de gestão e monitoramento de NFS-e, voltada principalmente a escritórios contábeis e a empresas que precisam centralizar, automatizar e acompanhar seus documentos fiscais.

A solução substitui a interface desktop por uma aplicação web, com:

- gestão de múltiplos CNPJs;
- consultas fiscais;
- acompanhamento das sincronizações;
- identificação de eventos;
- geração de relatórios e de DANFSe.

O objetivo é transformar o NF Tracker de uma ferramenta de download sob demanda em uma **plataforma de acompanhamento fiscal recorrente**.

### 2.1 Arquitetura híbrida

| Componente | Responsabilidade |
|---|---|
| **Interface Web** | Autenticação, gestão de organizações e empresas, consultas, visualização de documentos, dashboards, relatórios, exportações, geração de DANFSe e acompanhamento das sincronizações |
| **Backend SaaS** | Usuários, organizações e permissões; recebimento, processamento e indexação dos XMLs; controle de tarefas de sincronização; cobrança; notificações; disponibilização de dados à interface |
| **Agente Local Windows** | Única peça que se comunica com a API ADN. Usa por mTLS os certificados A1 instalados no computador do cliente, executa as sincronizações e envia os XMLs ao backend |

### 2.2 Princípios arquiteturais (não negociáveis)

1. **Certificados nunca saem do computador do cliente.** Certificados, senhas e chaves privadas não são enviados, armazenados nem processados pelo backend. O backend conhece apenas metadados (thumbprint, CNPJ do titular, emissor e validade).
2. **Toda chamada à API ADN é feita pelo agente.** O backend não tem certificado e não chama o ADN. Por isso, funcionalidades que dependem de consulta ao ADN exigem o agente online (ver 2.3).
3. **O que pode ser feito a partir do XML já armazenado é feito no backend**, sem depender do agente: consultas, filtros, dashboards, exportações e geração de DANFSe.
4. **A comunicação é sempre iniciada pelo agente** (saída HTTPS). Nenhuma porta de entrada é aberta no computador do cliente.
5. **O cursor de NSU só avança depois que o backend confirma a persistência** dos documentos.
6. **Isolamento multi-tenant** garantido no banco (RLS) e validado no backend.

> **Decisão registrada:** a DOCUMENTACAO_TECNICA.md (§3.2 e §12) sugere enviar o certificado A1 a um cofre no servidor. **Essa abordagem está rejeitada.** O Segue Nota usa exclusivamente o agente local.

### 2.3 Funcionalidades que dependem do agente online

| Funcionalidade | Depende do agente? |
|---|---|
| Sincronização inicial, incremental e retroativa | Sim |
| Reconsulta de eventos de uma nota (`/NFSe/{chave}/Eventos`) | Sim |
| Consulta, filtros, dashboards, exportação de XML e Excel | Não |
| Geração de DANFSe (PDF) | Não (gerado a partir do XML) |

Quando o agente estiver offline, a interface deve deixar isso claro e manter as tarefas pendentes na fila até a reconexão.

---

## 3. ESCOPO

### 3.1 Dentro do escopo do MVP

- Autenticação, organizações, usuários e perfis de acesso (seção 5).
- Cadastro de empresas (CNPJs) e vínculo com o certificado A1 e com o agente.
- Agente Windows com instalação, ativação, inicialização automática, sincronização e diagnóstico.
- Sincronização inicial por competência, incremental contínua e carga retroativa sob demanda.
- Recebimento, armazenamento e indexação de NFS-e emitidas e recebidas, e de seus eventos.
- Situação fiscal das notas a partir dos eventos (cancelamento, substituição etc.).
- Competências: organização, fechamento e documentos extemporâneos.
- Consulta com busca e filtros avançados.
- Dashboards operacionais e fiscais.
- Exportação de XMLs (individual e em lote) e de Excel.
- Geração de DANFSe (PDF), individual e em lote.
- Notificações por e-mail e na plataforma.
- Assinaturas via Stripe com trial e cobrança por CNPJ ativo.
- Painel do administrador da plataforma.
- Landing page com SEO técnico (Etapa 1 da seção 15).
- Requisitos de LGPD e segurança da seção 14.

### 3.2 Fora do escopo (pode virar melhoria futura)

- **Certificado A3** (token, cartão ou nuvem). Será avaliado se houver demanda.
- **Consulta por procuração ou representação** (certificado de um CNPJ consultando outro).
- **Upload de certificado** para o servidor (rejeitado; ver 2.2).
- **API pública** para integração de terceiros.
- **Plano Corporativo** com condições negociadas.
- Emissão de NFS-e (o Segue Nota só **captura e acompanha** notas).
- Automação via Selenium ou scraping de portais municipais fora do padrão nacional.
- Aplicativo mobile nativo (a interface web é responsiva).
- Agente para macOS ou Linux.

---

## 4. PERSONAS

### 4.1 Escritórios de contabilidade (público principal)

Escritórios de pequeno, médio e grande porte que administram documentos fiscais de diversos clientes. **Na prática do mercado, os certificados A1 dos clientes ficam instalados nos computadores do escritório**, e esse é o cenário principal que o agente deve atender.

Necessidades:

- gerenciar múltiplos CNPJs em uma única plataforma;
- reduzir atividades manuais e repetitivas;
- acompanhar notas emitidas, recebidas, canceladas e substituídas;
- identificar documentos de competências anteriores disponibilizados depois;
- obter relatórios consolidados para conferência e fechamento;
- monitorar falhas de sincronização e vencimento de certificados.

### 4.2 Empresas e departamentos fiscais

Empresas que acompanham as próprias NFS-e e disponibilizam informações a equipes administrativas, financeiras e contábeis.

Necessidades:

- consultar notas emitidas e recebidas;
- organizar documentos por competência e período;
- automatizar a atualização dos dados fiscais;
- exportar XMLs, planilhas e DANFSe;
- acompanhar cancelamentos e outras alterações.

---

## 5. PERFIS DE USUÁRIO E PERMISSÕES

### 5.1 Administrador da Plataforma (M2S Tech)

- Gerencia organizações, assinaturas, planos, preços e períodos de avaliação.
- Monitora a disponibilidade e o funcionamento da plataforma e dos agentes (indicadores agregados).
- Acompanha indicadores operacionais, de utilização e de falhas.
- Administra as configurações globais.
- **Não tem acesso irrestrito aos documentos fiscais dos clientes.** Um acesso excepcional para suporte exige autorização da organização, tem prazo e escopo limitados e fica registrado em auditoria.

### 5.2 Administrador da Organização

- Gerencia os CNPJs da organização (incluir, desativar, reativar).
- Convida, cadastra e desativa usuários, e define permissões por empresa.
- Gerencia agentes (ativar, revogar) e os vínculos de certificado com CNPJ.
- Configura o monitoramento, as sincronizações e o fechamento de competências.
- Acessa todos os documentos, dashboards e relatórios da organização.
- Acompanha a assinatura, o faturamento e os limites do plano.

### 5.3 Operador Fiscal / Contábil

Atua nas empresas às quais tem acesso:

- consulta NFS-e;
- solicita sincronizações e cargas retroativas;
- acompanha o processamento;
- identifica cancelamentos, substituições e inconsistências;
- fecha e reabre competências (se tiver a permissão);
- gera relatórios, DANFSe e exportações.

Não pode alterar configurações da organização, a assinatura ou permissões de outros usuários.

### 5.4 Usuário de Consulta

- Acessa apenas os CNPJs autorizados.
- Consulta documentos, indicadores e relatórios.
- Exporta e gera DANFSe somente quando tiver essa permissão.
- Não cadastra empresas, não administra usuários e não altera sincronizações.

### 5.5 Regras gerais de acesso

- Um usuário pode pertencer a **mais de uma organização** (ex.: um contador que atende vários escritórios) e alterna entre elas por um seletor. Cada vínculo tem perfil próprio.
- Dentro de uma organização, um usuário pode ter acesso a todas as empresas ou a uma lista específica.
- As permissões são verificadas **no backend e no banco (RLS)**. Manipular requisições nunca pode dar acesso a dados de outra organização ou empresa.
- O modelo de perfis deve ser extensível: perfis e permissões granulares ficam em tabelas, não fixos no código.

---

## 6. REQUISITOS FUNCIONAIS

Os requisitos são numerados (RF-xx) para facilitar o rastreamento durante o desenvolvimento.

### RF-01 — Autenticação e conta
- Cadastro com e-mail e senha e confirmação de e-mail (Supabase Auth).
- Login, logout, recuperação de senha.
- Convite de usuários por e-mail, com aceite e definição de senha.
- Autenticação em dois fatores (TOTP) disponível para todos e **recomendada para administradores**.
- Sessões revogáveis; encerrar todas as sessões.

### RF-02 — Organizações e empresas
- Criar organização no cadastro, como parte do onboarding.
- Cadastrar empresas por CNPJ, com validação dos dígitos verificadores e enriquecimento opcional da razão social a partir do certificado ou dos XMLs.
- Estados de uma empresa: `pendente_vinculo` → `ativa` → `desativada` (com reativação).
- Desativar uma empresa interrompe novas sincronizações e mantém o histórico (ver RF-13 e seção 14).

### RF-03 — Agente local e certificados
- Download do instalador do agente pela plataforma.
- Ativação do agente por **código de ativação de uso único**, gerado por um administrador da organização e com validade curta.
- O agente lista os certificados **A1** instalados (repositórios `CurrentUser\My` e `LocalMachine\My`) com capacidade de autenticação de cliente, e envia **somente metadados**: thumbprint, CNPJ do titular, razão social, emissor, início e fim da validade.
- Na web, o administrador vincula cada empresa (CNPJ) a um certificado listado por um agente.
- **Regra 1 — um certificado por CNPJ:** cada CNPJ tem exatamente um certificado ativo, e o **CNPJ do titular do certificado precisa ser igual ao CNPJ da empresa**. O vínculo é recusado se forem diferentes.
- **Regra 2 — um agente por CNPJ:** cada CNPJ é sincronizado por um único agente por vez. Trocar de agente exige transferência explícita, que encerra as tarefas do agente anterior.
- **Renovação de certificado:** quando um novo certificado do mesmo CNPJ aparecer no agente, a plataforma oferece a substituição do vínculo. O cursor de NSU é mantido.
- Alertas de vencimento (ver RF-12) e situação de cada certificado: válido, vencendo, vencido ou indisponível no agente.

### RF-04 — Sincronização inicial
- Na primeira sincronização de um CNPJ, o usuário escolhe a **competência inicial** (mês/ano). Padrão sugerido: 3 meses antes do mês atual.
- O agente localiza o NSU inicial por sondagem exponencial seguida de busca binária sobre `DataHoraGeracao` (algoritmo descrito em 7.4).
- A partir desse NSU, o agente baixa **tudo até o presente** e passa automaticamente para o modo incremental. Não existe "data final" na carga inicial.
- Os documentos aparecem **progressivamente** na interface enquanto a carga avança, com indicador de progresso (NSU atual, documentos recebidos, competência mais recente processada).

### RF-05 — Sincronização incremental contínua
- Depois da carga inicial, o agente consulta periodicamente o ADN a partir do último NSU confirmado.
- O intervalo é configurável por organização, respeitando o mínimo do plano. Padrão sugerido: 60 minutos, a validar na prova de conceito.
- Botão **"Sincronizar agora"** por empresa (sujeito a limite de frequência para não provocar bloqueio por excesso de requisições no ADN).

### RF-06 — Carga retroativa sob demanda
- O usuário pode pedir documentos de competências **anteriores** ao início do monitoramento.
- O agente localiza o NSU correspondente e baixa o intervalo até o NSU onde o monitoramento começou, ignorando documentos já recebidos.
- A carga retroativa é uma tarefa separada, com acompanhamento próprio, e não interrompe a sincronização incremental.

### RF-07 — Documentos fiscais
- Centralizar NFS-e **emitidas** e **recebidas** e seus **eventos**.
- Classificação (ver 6.2 das regras fiscais):
  - **emitida** quando o CNPJ da empresa é o emitente ou o prestador;
  - **recebida** quando é o tomador;
  - **intermediada** quando é o intermediário.
- Situação fiscal calculada a partir dos eventos (seção 7.3).
- Vínculo entre a nota substituída e a substituta (`chSubstda`), navegável nos dois sentidos.
- Tela de detalhe da nota: dados estruturados, linha do tempo de eventos, XML original para download e botão de DANFSe.
- Botão **"Reconsultar eventos"** (requer o agente online; ver 2.3).

### RF-08 — Busca e filtros
Filtros combináveis:
- empresa (um ou vários CNPJs);
- tipo (emitida, recebida, intermediada);
- prestador e tomador (documento ou nome);
- número da NFS-e, número da DPS, chave de acesso;
- data de emissão, competência, data de disponibilização no ADN;
- situação fiscal, município de incidência, código de serviço;
- faixa de valor;
- extemporânea (sim ou não).

Requisitos da tabela:
- ordenação, paginação no servidor e personalização de colunas;
- filtros salvos por usuário;
- a URL reflete os filtros, para compartilhar.

### RF-09 — Competências
- Visão por competência e empresa: quantidades, valores e situação.
- **Fechamento de competência:** o usuário com permissão marca a competência de uma empresa como **fechada**. O sistema registra quem fechou e quando. A competência pode ser reaberta, com registro em auditoria.
- **Documento extemporâneo:** qualquer documento ou evento recebido depois do fechamento da sua competência fica marcado como extemporâneo, gera alerta (RF-12) e aparece em destaque na competência.
- Os indicadores das competências afetadas são recalculados automaticamente quando chegam documentos ou eventos novos.

### RF-10 — Dashboards
- **Fiscal:** quantidade e valor de notas emitidas e recebidas por competência e empresa, cancelamentos, substituições, extemporâneas e ISS retido.
- **Operacional:** situação de cada agente (online, offline, com erro, desatualizado), última comunicação, última sincronização bem-sucedida por CNPJ, tarefas em andamento ou com falha, certificados vencendo.
- O painel deve **distinguir "agente conectado" de "documentos atualizados"**: um agente online cujo CNPJ não sincroniza há X horas aparece como pendência.

### RF-11 — Exportações e DANFSe
- **XML:** download individual ou em lote (ZIP), de acordo com os filtros aplicados. O ZIP é organizado por empresa, tipo e competência.
- **Excel (.xlsx):**
  - planilhas de notas, de eventos e de canceladas e substituídas;
  - colunas fixas de negócio (seção 10.3) e, opcionalmente, a **"exportação completa"**, com todos os campos do XML achatados em colunas, preservando o diferencial do conversor do NF Tracker;
  - valores monetários em formato numérico, não texto.
- **DANFSe (PDF):** geração individual ou em lote (ZIP), conforme a seção 11.
- Exportações grandes rodam de forma **assíncrona**: o usuário recebe uma notificação com link de download temporário (URL assinada com expiração).
- Toda exportação fica registrada em auditoria (quem, quando, filtros e quantidade).

### RF-12 — Notificações
- Canais: **na plataforma** (central de notificações) e **e-mail**.
- Eventos notificáveis:
  - falha de sincronização persistente;
  - agente offline por mais de N horas (configurável);
  - certificado vencendo (30, 15 e 7 dias) e vencido;
  - nota cancelada ou substituída;
  - documento extemporâneo em competência fechada;
  - exportação concluída;
  - problemas de assinatura (trial terminando, pagamento recusado).
- Cada usuário escolhe, por tipo de evento, quais notificações recebe e por qual canal.
- Os e-mails **nunca** contêm o conteúdo de documentos fiscais, apenas o resumo e o link para a plataforma.
- Há opção de resumo diário em vez de alertas individuais.

### RF-13 — Assinaturas e planos
Ver a seção 13.

### RF-14 — Onboarding
Fluxo guiado:
1. criar a organização;
2. baixar e instalar o agente;
3. ativar o agente com o código;
4. revisar os certificados detectados;
5. cadastrar as empresas e vincular os certificados;
6. escolher a competência inicial;
7. iniciar a primeira sincronização.

O objetivo é que o usuário veja as primeiras notas **em minutos**. O progresso do onboarding fica visível até ser concluído.

### RF-15 — Painel do administrador da plataforma
- Organizações, assinaturas, situação e uso (CNPJs ativos, volume de documentos, armazenamento).
- Catálogo comercial: planos, preços, descontos e trial (seção 13.6).
- Saúde da plataforma: agentes por versão, falhas agregadas, filas, erros do ADN.
- Versão mínima exigida do agente.
- Fluxo de acesso excepcional de suporte (seção 5.1).

### RF-16 — Auditoria
Registrar, em trilha imutável e consultável pelo administrador da organização:
- login;
- mudanças de permissão;
- vínculo e revogação de agentes e certificados;
- fechamento e reabertura de competências;
- exportações e geração de DANFSe em lote;
- desativação de empresas;
- acessos de suporte.

---

## 7. REGRAS DE NEGÓCIO FISCAIS

### 7.1 Datas de um documento

| Data | Origem | Uso |
|---|---|---|
| **Emissão** | `infDPS/dhEmi` | Exibição e filtro |
| **Processamento da NFS-e** | `infNFSe/dhProc` | Exibição (é a "data/hora de emissão da NFS-e" no DANFSe) |
| **Competência** | `infDPS/dCompet` | **Organização principal** das notas, indicadores e fechamento |
| **Disponibilização no ADN** | `DataHoraGeracao` (resposta da API) | Localização do NSU e detecção de extemporâneos |
| **Recebimento na plataforma** | Gerada pelo backend | Auditoria e indicadores operacionais |

Todas as datas são armazenadas em UTC (`timestamptz`), exceto a competência (`date`, primeiro dia do mês). A exibição usa o fuso **America/Sao_Paulo**. A competência deriva do valor informado no XML e **nunca** de uma conversão de fuso.

### 7.2 Classificação

Seja `C` o CNPJ da empresa monitorada:

- **Emitida:** `C` = `emit/CNPJ` ou `prest/CNPJ`.
- **Recebida:** `C` = `toma/CNPJ`.
- **Intermediada:** `C` = `interm/CNPJ`.
- Um mesmo documento pode pertencer a **duas empresas da mesma organização** (ex.: uma emite e a outra recebe). Nesse caso ele é armazenado uma vez e vinculado às duas, com a classificação própria de cada uma.
- A leitura do XML deve **ignorar namespaces** e tolerar variações de versão e de município, buscando pelo nome local da tag (como no legado).

### 7.3 Eventos e situação fiscal

O ADN informa `TipoEvento` em cada documento do tipo `EVENTO`. Mapeamento inicial (a validar com o leiaute nacional durante o desenvolvimento):

| TipoEvento (ADN) | Efeito na situação da nota |
|---|---|
| `CANCELAMENTO` | **Cancelada** |
| `CANCELAMENTO_POR_SUBSTITUICAO` | **Substituída** (vincular à substituta) |
| `SOLICITACAO_CANCELAMENTO_ANALISE_FISCAL` | **Cancelamento em análise** |
| `CANCELAMENTO_DEFERIDO_ANALISE_FISCAL` | **Cancelada** |
| `CANCELAMENTO_INDEFERIDO_ANALISE_FISCAL` | Volta à situação anterior (**Autorizada**) |
| `CANCELAMENTO_POR_OFICIO` | **Cancelada (de ofício)** |
| `BLOQUEIO_POR_OFICIO` / `DESBLOQUEIO_POR_OFICIO` | Marca e desmarca **Bloqueada** |
| `CONFIRMACAO_*`, `REJEICAO_*`, `CONFIRMACAO_TACITA`, `ANULACAO_REJEICAO` | Não alteram a situação; registram a **manifestação** (prestador, tomador, intermediário) |
| `INCLUSAO_NFSE_DAN`, `TRIBUTOS_NFSE_RECOLHIDOS` | Informativos (linha do tempo) |

Regras:
- A situação é **derivada da sequência de eventos**, ordenada por data e hora do evento, e não do `cStat` gravado no XML da nota, que reflete apenas a autorização original.
- Um evento pode chegar **antes** da nota a que se refere. Nesse caso, ele fica pendente e é aplicado quando a nota chegar.
- Toda mudança de situação fica registrada na linha do tempo da nota e pode gerar notificação.
- Como reforço (comportamento do legado), eventos sem `TipoEvento` são classificados pelo código do evento (`e1xxxxx`) e por "cancel" em `xDesc` ou `xMotivo`.

### 7.4 Localização de NSU, margens e deduplicação

- A API ADN **não filtra por data**: o NSU é o único mecanismo de paginação (lotes de até 50 documentos).
- **Localização do NSU inicial:**
  1. sondagem exponencial (10, 100, 1.000, …) até achar `DataHoraGeracao ≥ alvo`;
  2. busca binária no intervalo encontrado (até 20 iterações);
  3. recuo de segurança de 50 NSUs.
- **Alvo da carga inicial:** primeiro dia da competência inicial **menos uma margem de segurança** configurável (padrão 5 dias). Documentos recebidos com competência anterior à inicial são armazenados normalmente, com a marca "anterior ao início do monitoramento".
- **404 no ADN:** só é aceito como fim da fila depois de 3 confirmações (a API devolve 404 transitório sob carga).
- **Deduplicação:**
  - chave única `(empresa, NSU)` para o documento distribuído;
  - chave única por `ChaveAcesso` para a NFS-e;
  - chave única `(chave da NFS-e, tipo, sequencial)` para eventos.
  - O reenvio de um documento existente é aceito e ignorado (operação idempotente).

### 7.5 Extemporâneos

Um documento ou evento é **extemporâneo** quando é recebido depois que a competência a que pertence foi fechada (RF-09). Também é exibido o indicador informativo "**disponibilizado X dias após o fim da competência**", calculado com `DataHoraGeracao`.

---

## 8. INTEGRAÇÃO COM A API ADN (CONTRATO TÉCNICO)

Fonte oficial: swaggers e manual em `E:\M2S\NF_tracker\Ducumentação API NFSe\`.

| Item | Valor |
|---|---|
| Base produção | `https://adn.nfse.gov.br/contribuintes` |
| Base homologação (produção restrita) | `https://adn.producaorestrita.nfse.gov.br/contribuintes` |
| Distribuição por NSU | `GET /DFe/{NSU}?lote=true&cnpjConsulta={CNPJ}` |
| Eventos de uma nota | `GET /NFSe/{ChaveAcesso}/Eventos` |
| Autenticação | mTLS com certificado e-CNPJ A1 do próprio CNPJ consultado |
| Resposta | `LoteDistribuicaoNSUResponse`: `StatusProcessamento` (`DOCUMENTOS_LOCALIZADOS` / `NENHUM_DOCUMENTO_LOCALIZADO` / `REJEICAO`), `LoteDFe[]`, `Alertas[]`, `Erros[]` |
| Item do lote | `NSU`, `ChaveAcesso`, `TipoDocumento` (`NFSE`, `EVENTO`, `DPS`, `PEDIDO_REGISTRO_EVENTO`, `CNC`), `TipoEvento`, `DataHoraGeracao`, `ArquivoXml` |
| Formato do XML | `ArquivoXml` = Base64(GZip(XML)) |
| API de DANFSe (`/danfse/{chave}`) | **Não usar** — sobrestada em 03/08/2026 (ver seção 11) |

**Tratamento de erros (política validada em produção no legado, como ponto de partida):**

| Condição | Tratamento |
|---|---|
| HTTP 429 | Pausa longa (3 a 10 min) com backoff e respeito a `Retry-After`, se houver |
| HTTP 408 / 5xx | Retentativa com backoff (a partir de 10 a 30 s) |
| 404 `NENHUM_DOCUMENTO_LOCALIZADO` | Fim da fila, confirmado 3 vezes |
| HTTP 400 / `REJEICAO` | Registrar `Erros[].Codigo/Descricao`, marcar a tarefa como falha e não repetir automaticamente |
| Erro de rede ou timeout | Retentativa com backoff |
| Lote com menos de 50 documentos | Fim da fila na rodada atual |
| `ArquivoXml` vazio ou inválido | Registrar o aviso e seguir, sem avançar o cursor além desse NSU até decidir (registrar como pendência do documento) |

- O controle de ritmo das requisições (throttling) é feito **pelo agente, por certificado**. O agente processa CNPJs em sequência ou com paralelismo limitado e configurável.
- Todo desenvolvimento e teste automatizado usa o ambiente de **produção restrita**. O ambiente é configurado no agente pelo backend e nunca é inferido.

---

## 9. AGENTE WINDOWS — ARQUITETURA OPERACIONAL E SEGURANÇA

### 9.1 Tecnologia
- **Candidato preferencial: .NET 10 (LTS)**, com `X509Store` e `HttpClientHandler`/`SocketsHttpHandler` com certificado de cliente via Schannel, o que funciona também com chave **não exportável**. A instalação como Windows Service e o instalador MSI são nativos.
- A escolha definitiva depende da prova de conceito (9.9).
- O agente é um projeto separado no mesmo repositório (`apps/agent`), com versionamento próprio.

### 9.2 Instalação e execução
- Instalador próprio para Windows (MSI), **assinado digitalmente** (Authenticode), para evitar o alerta do SmartScreen que existe no legado.
- Inicialização automática com o Windows, em segundo plano, com consumo moderado de recursos.
- Ícone na bandeja ou pequena janela local com situação, versão, último contato, CNPJs e botão de diagnóstico.
- Modo de execução a definir na prova de conceito entre **Windows Service** (preferencial: funciona sem usuário logado) e **tarefa agendada / execução por usuário**. O ponto decisivo é o **acesso aos certificados instalados em `CurrentUser\My`** de um usuário quando o agente roda como serviço. A PoC deve definir a recomendação de instalação dos certificados (ex.: `LocalMachine\My` com permissão de leitura da chave para a conta do serviço).
- **Somente certificados A1.** Certificados A3 aparecem no diagnóstico como "não suportado".

### 9.3 Registro e autenticação
- Cada instalação tem identidade própria (`agent_id`), associada a uma organização.
- Ativação por código de uso único (RF-03). Na ativação, o agente recebe **credenciais próprias** de escopo limitado: só pode buscar e atualizar tarefas e enviar documentos dos CNPJs vinculados a ele.
- As credenciais têm validade, rotação automática e revogação imediata pela web.
- As credenciais ficam guardadas com **DPAPI** (ou mecanismo equivalente do Windows).
- Agente revogado ou abaixo da versão mínima recebe recusa do backend e mostra o motivo.

### 9.4 Comunicação com o backend
- Somente HTTPS iniciado pelo agente. Nenhuma porta de entrada.
- O agente consulta tarefas periodicamente (polling com espera longa ou intervalo curto) e envia um **heartbeat** com versão, situação, certificados detectados (metadados) e uso de recursos.
- Cada tarefa tem **identificador único** e **concessão com prazo de expiração (lease)**. Uma tarefa abandonada volta para a fila depois que a concessão expira.
- **Envio de documentos em lotes** (o lote de 50 do ADN, mantendo a ordem dos NSUs). O backend:
  1. valida a autorização (agente, organização, CNPJ, assinatura);
  2. grava o XML original no Storage e os dados estruturados no banco;
  3. responde com a confirmação do maior NSU persistido.
- O agente **só avança o cursor local** depois dessa confirmação. O cursor oficial é o do backend; o do agente é cache.
- O envio é idempotente: reenviar um lote não duplica nada.

### 9.5 Autorização antes de consultar o ADN
Antes de entregar uma tarefa ao agente, o backend valida:
- a identidade e a situação do agente;
- se o CNPJ pertence à organização do agente e está **ativo** e vinculado **a esse agente**;
- se a assinatura da organização está ativa ou em trial válido;
- se o certificado vinculado está dentro da validade.

O agente confirma localmente que o certificado existe, está válido e que **o CNPJ do titular é igual ao CNPJ da tarefa**. Caso contrário, recusa a tarefa e informa o motivo.

### 9.6 Sincronização e recuperação de falhas
- Cursor de NSU persistente por CNPJ, guardado no backend.
- O cursor nunca avança antes da confirmação de persistência.
- Tarefas interrompidas são identificadas pela expiração da concessão e retomadas do último NSU confirmado.
- Tarefas com falha podem ser reprocessadas manualmente pela web.
- Os erros do ADN são registrados por tarefa e por CNPJ, sem conteúdo fiscal.
- Uma sincronização só é considerada concluída depois da confirmação do backend.

### 9.7 Segurança local
- Princípio do menor privilégio na conta de execução.
- Arquivos temporários com XMLs são evitados (processamento em memória). Se existirem, ficam em pasta protegida e são apagados depois da confirmação.
- Os logs locais **não** contêm senhas, chaves, tokens nem o conteúdo dos documentos. Os logs são rotacionados.
- A desinstalação revoga as credenciais no backend (quando online) e remove os dados temporários.

### 9.8 Atualizações
- Versão do agente informada no heartbeat.
- Atualização automática com pacote **assinado** e verificação de integridade antes de instalar, com volta automática à versão anterior se falhar.
- O backend define uma **versão mínima** compatível.

### 9.9 Prova de conceito obrigatória
Antes da implementação definitiva do agente, validar:
1. Acesso a certificados A1 **exportáveis e não exportáveis** em `CurrentUser\My` e `LocalMachine\My`.
2. Acesso aos certificados no contexto de **Windows Service** e de execução por usuário.
3. mTLS com o ADN (produção restrita e produção) via Schannel.
4. Escritório com **dezenas de A1 instalados**: listagem, filtragem por CNPJ e seleção correta.
5. Inicialização automática e funcionamento sem usuário logado.
6. Ativação, autenticação, revogação e bloqueio de agentes não autorizados.
7. Retomada de sincronização após interrupção, sem perda nem duplicidade.
8. Ritmo de requisições (throttling) sob HTTP 429 e intervalo de sincronização sustentável.
9. Instalador assinado e atualização automática.

---

## 10. MODELO DE DADOS

### 10.1 Entidades principais (visão lógica)

- `organizations`, `organization_members` (usuário ↔ organização ↔ perfil), `member_company_access`
- `companies` (CNPJ, razão social, situação, competência inicial, agente vinculado, certificado vinculado)
- `agents` (identidade, situação, versão, último heartbeat, credenciais com hash)
- `agent_certificates` (metadados: thumbprint, CNPJ do titular, emissor, validade; **sem chave**)
- `sync_cursors` (empresa, último NSU confirmado, NSU de início do monitoramento)
- `sync_tasks` (tipo: inicial, incremental, retroativa ou reconsulta de eventos; situação; concessão; progresso; erro)
- `dfe_documents` (cada item distribuído pelo ADN: NSU, tipo, `DataHoraGeracao`, caminho do XML no Storage, hash)
- `nfse` (dados estruturados da nota, seção 10.3)
- `nfse_company_links` (nota ↔ empresa ↔ classificação: emitida, recebida ou intermediada)
- `nfse_events` (eventos com tipo, sequencial, data e hora, motivo)
- `nfse_status_history` (linha do tempo da situação)
- `competence_closings` (empresa, competência, fechada por, fechada em, reaberta)
- `notifications`, `notification_preferences`
- `exports` (tarefas de exportação e DANFSe em lote)
- `audit_logs`
- Cobrança: `plans`, `prices`, `price_tiers`, `subscriptions`, `subscription_items`, `stripe_events` (idempotência), `billing_history`

### 10.2 Regras de modelagem
- Toda tabela de dados de cliente tem `organization_id` e política **RLS**.
- Valores monetários em `numeric(15,2)`; alíquotas em `numeric(7,4)`. Nunca `float`.
- Datas e horas em `timestamptz` (UTC); competência em `date`.
- Índices para os filtros do RF-08 (empresa + competência, chave, número, documento do prestador e do tomador, situação).
- Migrations versionadas no repositório (Supabase CLI), com tipos TypeScript gerados a partir do schema.
- O XML original é **imutável** no Storage (caminho por organização, empresa e chave). Os dados estruturados podem ser reprocessados a partir dele.

### 10.3 Campos fiscais mínimos indexados (NFS-e)

| Grupo | Campos (tag no XML) |
|---|---|
| Identificação | chave de acesso (`infNFSe/@Id`), `nNFSe`, `nDFSe`, `nDPS`, `serie`, `tpAmb`, `ambGer`, `tpEmis`, `procEmi`, `cStat`, `finNFSe`, `tpEmit`, `verAplic` |
| Datas | `dhEmi`, `dhProc`, `dCompet`, `DataHoraGeracao` |
| Emitente / Prestador | CNPJ/CPF/NIF, `IM`, `xNome`, município (`cMun`), UF, e-mail; `opSimpNac`, `regApTribSN`, `regEspTrib` |
| Tomador | CNPJ/CPF/NIF, `IM`, `xNome`, município, UF, e-mail |
| Intermediário | CNPJ/CPF/NIF, `xNome` |
| Serviço | `cTribNac`, `xTribNac`, `cTribMun`, `xTribMun`, `cNBS`, `xDescServ`, `cLocPrestacao`/`xLocPrestacao`, `cLocIncid`/`xLocIncid` |
| Valores | `vServ`, descontos condicionado e incondicionado, `vBC`, `pAliqAplic`, `vISSQN`, `tribISSQN`, `tpRetISSQN`, retenções federais (IRRF, CP, CSLL, PIS, COFINS), `vTotalRet`, `vLiq` |
| IBS/CBS (reforma tributária) | Totais e alíquotas de IBS (UF e município) e CBS, quando presentes |
| Substituição | `chSubstda`, `cMotivo`, `xMotivo` |
| Derivados | classificação por empresa, situação fiscal, extemporânea, manifestações |

Os campos fora desta lista continuam disponíveis no XML original e na exportação completa (RF-11).

---

## 11. GERAÇÃO DO DANFSe (PDF)

- A API pública de DANFSe do ADN (`/danfse/{chave}`) foi **sobrestada em 03/08/2026**. A partir dessa data, o DANFSe deve ser **gerado a partir do XML** da NFS-e (conforme registrado em `gerar_danfse_pdf.py`).
- O Segue Nota gera o DANFSe **no backend**, a partir do XML armazenado, **sem depender do agente**.
- **Especificação:** **Nota Técnica nº 008 — Especificações Técnicas do DANFSe (SE/CGNFS-e, v1.02, 14/07/2026)**, usando `E:\M2S\NF_tracker\gerar_danfse_pdf.py` como referência de implementação. Pontos principais:
  - **página A4 única** (obrigatório); a altura dos blocos de texto livre (descrição do serviço e informações complementares) se ajusta para caber;
  - a **disposição e a ordem dos campos do Anexo I são obrigatórias**; tamanhos e posições sugeridos não são;
  - cabeçalho com logo da NFS-e, título "DANFSe v2.0 — Documento Auxiliar da NFS-e", município, ambiente gerador e tipo de ambiente;
  - **QR Code** com a URL de consulta pública + chave de acesso, e texto de autenticidade;
  - blocos, na ordem:
    1. identificação da NFS-e e da DPS;
    2. prestador/fornecedor;
    3. tomador/adquirente;
    4. destinatário;
    5. intermediário;
    6. serviço prestado e descrição;
    7. tributação municipal (ISSQN);
    8. tributação federal (exceto CBS);
    9. tributação IBS/CBS;
    10. valor total;
    11. informações complementares;
    12. canhoto;
  - tradução de códigos (`cStat`, `finNFSe`, `opSimpNac`, `tribISSQN`, `tpRetISSQN`, `tpAmb`, `ambGer`, `tpEmit`); código sem descrição conhecida aparece como "Código N" e **nunca** com texto inventado;
  - **marca-d'água "CANCELADA" ou "SUBSTITUÍDA"** conforme a situação **atual calculada pela plataforma** (seção 7.3), não apenas o `cStat` do XML;
  - **"NFS-e SEM VALIDADE JURÍDICA"** em destaque quando `tpAmb = 2` (homologação);
  - a leitura dos campos busca primeiro o caminho da NT-008 e depois o nome da tag no documento inteiro, para tolerar variações de versão e de emissor.
- O logo oficial da NFS-e fica guardado nos ativos da aplicação, sem download a cada geração.
- Geração individual imediata (streaming do PDF). O lote é assíncrono e entregue em ZIP (RF-11).
- **Testes de regressão visual** com XMLs reais anonimizados: normal, cancelada, substituída, com retenções, com IBS/CBS, com descrição longa e de homologação.
- A biblioteca de PDF em TypeScript é definida na implementação (ex.: `pdfkit` ou `pdf-lib`), e precisa funcionar em função serverless.

---

## 12. EXPORTAÇÃO EXCEL

- Gerada no backend a partir dos dados indexados (exportação padrão) ou do XML (exportação completa).
- Exportação padrão: colunas fixas da seção 10.3, com cabeçalhos em português, formatos de data e moeda brasileiros e valores numéricos.
- Exportação completa: achatamento de todos os campos do XML em colunas `caminho.da.tag` e `@atributo`. Valores repetidos são separados por ` | `. Nenhum dado é perdido (equivalente ao conversor do NF Tracker).
- Abas: Notas, Eventos, Canceladas/Substituídas, Resumo por competência.

---

## 13. MONETIZAÇÃO E ASSINATURAS

### 13.1 Modelo de cobrança
- SaaS por assinatura recorrente via **Stripe Billing**.
- Cobrança pela **quantidade de CNPJs ativos** por organização, com preço unitário configurável e **descontos progressivos por volume**.
- O cliente adiciona ou desativa CNPJs livremente, sem pacotes fechados.
- Cada organização tem uma assinatura no Stripe, com quantidade variável.

### 13.2 Modalidades
- **Trial:** período gratuito (duração, limite de CNPJs e recursos a definir). Termina com conversão ou com bloqueio das sincronizações. Os dados ficam preservados conforme a política de retenção.
- **Plano Individual:** 1 CNPJ.
- **Plano Escritório:** vários CNPJs, preço por quantidade com faixas de desconto.
- **Plano Corporativo:** futuro (fora do MVP).

### 13.3 Gestão de CNPJs contratados
O administrador da organização pode adicionar, desativar e reativar CNPJs, além de consultar a quantidade contratada, o valor atualizado da mensalidade e o histórico de alterações.
- A adição exige a confirmação das condições comerciais e um certificado válido vinculado.
- A desativação interrompe novas sincronizações, respeitando o período já faturado.
- A cobrança considera os CNPJs **efetivamente ativos**, não todos os já cadastrados.
- Documentos históricos não são excluídos automaticamente (seção 14.5).

### 13.4 Integração Stripe
- Criação e ativação de assinatura via Stripe Checkout; portal do cliente para cartão e faturas.
- Atualização da quantidade, com cobrança proporcional conforme a política definida.
- Renovação automática, cancelamento, inadimplência (com período de tolerância e depois bloqueio das sincronizações; a consulta continua disponível conforme a política) e histórico de pagamentos.
- **Webhooks com verificação de assinatura, idempotentes** (tabela `stripe_events`) e **fail-closed**: evento não verificado é rejeitado.
- Avaliar os meios de pagamento relevantes no Brasil disponíveis no Stripe (cartão, boleto, Pix).
- O Supabase mantém o vínculo entre organização, CNPJs contratados e os IDs de cliente, assinatura, produto e preço no Stripe.

### 13.5 Diretrizes
- As regras de cobrança são independentes de autenticação e autorização.
- O backend calcula e valida preços, quantidades e condições. O frontend nunca envia valores.
- A inclusão ou desativação de CNPJs não afeta a integridade dos documentos armazenados.

### 13.6 Catálogo comercial centralizado
- Planos, preços, faixas de desconto e condições ficam **no banco**, com vínculo aos produtos e preços do Stripe, e nunca no código.
- A landing page e a área autenticada leem a **mesma fonte**. Alterações aparecem sem novo deploy, com revalidação de cache.
- Há histórico de alterações com data de vigência e o administrador responsável.
- As condições para novos assinantes são separadas das condições dos contratos existentes.

### 13.7 Regras comerciais pendentes
Preço por CNPJ, faixas de desconto, duração e condições do trial, política de cobrança proporcional, limites de processamento e armazenamento, retenção após desativação, condições de reativação, prevenção de abuso por troca de CNPJs e condições corporativas.

---

## 14. PROTEÇÃO DE DADOS, PRIVACIDADE E LGPD

O Segue Nota segue a Lei nº 13.709/2018 (LGPD), com **Privacy by Design** e **Security by Design**. Os documentos fiscais podem conter dados pessoais (ex.: tomadores pessoa física), informações financeiras e dados comerciais confidenciais.

### 14.1 Responsabilidades
- A M2S Tech documenta seu papel (controladora, operadora ou suboperadora) em cada operação de tratamento.
- As responsabilidades de clientes, da M2S Tech e dos prestadores de infraestrutura são formalizadas em contrato.
- As bases legais são definidas por finalidade, sem presumir o consentimento como base necessária.

### 14.2 Isolamento e acesso
- Isolamento entre organizações com **RLS** no Supabase e validação no backend.
- Acesso aos documentos por organização, usuário e CNPJ.
- Arquivos em **buckets privados**, entregues somente por URLs assinadas e de curta duração, emitidas depois da verificação de permissão.
- Menor privilégio. A chave `service_role` só é usada no servidor e nunca chega ao cliente.
- Auditoria de operações administrativas e de acessos relevantes (RF-16).
- O administrador global não tem acesso operacional irrestrito; o acesso de suporte é excepcional e auditado.

### 14.3 Proteção das informações
- TLS em todas as comunicações; criptografia em repouso.
- **Certificados, senhas e chaves privadas nunca chegam à infraestrutura do Segue Nota.**
- Segredos guardados em gerenciadores apropriados (variáveis de ambiente da Vercel e do Supabase), nunca no repositório.
- Logs, mensagens de erro e ferramentas de monitoramento não contêm conteúdo fiscal nem dados pessoais desnecessários.

### 14.4 Minimização e finalidade
- Coletar e armazenar apenas o necessário. Os campos estruturados se limitam aos da seção 10.3.
- Documentos dos clientes **não podem** ser usados para publicidade, comercialização de bases ou treinamento de modelos de IA.

### 14.5 Retenção, desativação e exclusão
- A desativação de um CNPJ ou o cancelamento da assinatura **não** excluem os documentos imediatamente.
- O sistema deve:
  - interromper a sincronização;
  - aplicar a política de retenção;
  - oferecer exportação antes da exclusão;
  - executar exclusão segura, com registro;
  - considerar os backups.
- Os prazos serão definidos após análise jurídica e das obrigações fiscais (pendência).

### 14.6 Transparência e titulares
Política de Privacidade e Termos de Uso coerentes com as operações reais, e canal para solicitações de titulares, com cooperação com o controlador quando a M2S Tech for operadora.

### 14.7 Incidentes
Identificar acessos suspeitos, registrar eventos de auditoria, revogar sessões e credenciais (inclusive de agentes), identificar organizações afetadas, preservar evidências e comunicar conforme as regras da ANPD e os contratos.

### 14.8 Prestadores
Avaliar Supabase, Vercel, Stripe e o provedor de e-mail quanto à segurança, à região de armazenamento (preferir região no Brasil quando disponível) e às transferências internacionais.

### 14.9 Validação antes do lançamento
- Revisão de RLS e do isolamento multi-tenant.
- Testes automatizados de autorização entre organizações e CNPJs.
- Avaliação de segurança do agente.
- Revisão de armazenamento, transmissão e logs.
- Políticas de retenção definidas.
- Documentos contratuais e de privacidade.
- Avaliação da necessidade de RIPD.

Os itens técnicos não substituem a avaliação jurídica.

---

## 15. SEO

### 15.1 Princípios
- Indexar **somente** as páginas públicas comerciais. As áreas autenticadas nunca são indexadas.
- `robots.txt`, `noindex` e exclusão do sitemap **não são mecanismos de segurança**. A proteção é feita por autenticação e autorização.

### 15.2 Etapa 1 — SEO técnico (obrigatório desde o início)
- Páginas públicas com SSG/SSR (Next.js), HTML5 semântico e hierarquia correta de H1 a H3.
- Metadata API do Next.js: título e descrição por página, canonical, Open Graph, Twitter Cards, imagem de compartilhamento configurável, `lang="pt-BR"`.
- `sitemap.xml` (somente URLs públicas) e `robots.txt` gerados pelo Next.js.
- **Controle de indexação por ambiente:** preview e homologação sempre com `noindex`; somente produção é indexável.
- URLs amigáveis e redirecionamentos 301 quando uma URL mudar.
- JSON-LD preparado: `Organization`, `SoftwareApplication`, `WebSite`, `BreadcrumbList`, `FAQPage` (somente com conteúdo real e visível).
- Core Web Vitals (LCP, INP, CLS): `next/image`, `next/font`, JavaScript mínimo nas páginas públicas, cache adequado.

### 15.3 Landing page
Proposta de valor, funcionalidades, benefícios para escritórios e empresas, planos e preços (lidos do catálogo, seção 13.6), FAQ e chamadas para cadastro e trial. A estrutura deve aceitar páginas futuras por funcionalidade, segmento e conteúdo educativo.

### 15.4 Etapa 2 — SEO comercial (não bloqueia o MVP)
Pesquisa de palavras-chave, textos comerciais, páginas por funcionalidade, conteúdos educativos, Google Search Console e GA4 (ou equivalente). A ferramenta de análise exige **consentimento de cookies** e **nunca** recebe dados fiscais ou de clientes.

---

## 16. DESIGN LANGUAGE

**Direção visual:** *Modern Fiscal Intelligence SaaS*. Interface moderna, sofisticada e minimalista, que transmita tecnologia, precisão e confiabilidade, sem a aparência tradicional de ERP ou sistema contábil.

**Referências:**
- **Linear:** navegação, hierarquia, menu lateral recolhível, microinterações, modos claro e escuro.
- **Ramp:** dashboards financeiros, tabelas densas, filtros, números objetivos.
- **Vercel:** minimalismo, tipografia, indicadores de status.

**Identidade e cores:**
- Design system próprio sobre shadcn/ui, com tokens CSS e suporte nativo a **Light e Dark**.
- Paleta inicial neutra (branco gelo e grafite), com **índigo/violeta** como destaque. As cores definitivas virão depois, então os tokens devem permitir a troca sem refatoração.
- Cores semânticas para sucesso, atenção, erro, cancelada, substituída, extemporânea e estados de sincronização, **sempre acompanhadas de texto ou ícone** (acessibilidade).

**Experiência:**
- Desktop-first e totalmente responsiva.
- Menu lateral recolhível; seletores rápidos de organização, empresa e competência sempre visíveis.
- Tabelas com busca, filtros avançados, ordenação, paginação, colunas configuráveis e alta densidade.
- Indicadores claros de sincronização, falhas e pendências; resultados progressivos durante o processamento.
- Estados de carregamento, vazio e erro bem definidos.
- Ações frequentes com o mínimo de etapas; atalhos de teclado e uma paleta de comandos (⌘K / Ctrl+K).
- Onboarding guiado (RF-14).
- Tema persistido por usuário, com opção de seguir o sistema operacional.
- Gráficos com **Recharts**, sóbrios e funcionais; ícones **Lucide**.
- Acessibilidade WCAG 2.1 AA: contraste, foco visível, navegação por teclado, rótulos ARIA.

**Diretriz fundamental:** a interface deve tornar simples a gestão de grandes volumes de documentos, para que o usuário identifique rapidamente **o que está atualizado, o que exige atenção e qual ação tomar**.

---

## 17. STACK TÉCNICA E INFRAESTRUTURA

| Camada | Tecnologia |
|---|---|
| Linguagem web | TypeScript (strict) |
| Frontend | Next.js (App Router), React, Tailwind CSS, shadcn/ui (Radix), Lucide React, Recharts |
| Backend web | Next.js Route Handlers e Server Actions (Node.js runtime) |
| Validação | Zod (entrada de toda API, formulários e payloads do agente) |
| Banco | Supabase PostgreSQL com RLS; migrations via Supabase CLI; tipos gerados |
| Autenticação | Supabase Auth (e-mail/senha, convite, TOTP) |
| Arquivos | Supabase Storage (buckets privados, URLs assinadas) |
| Processamento assíncrono | Fila persistente para ingestão de lotes, recálculo de indicadores, exportações, DANFSe em lote e notificações. **Candidatos:** Vercel Queues / Workflow ou Supabase Queues (pgmq) + Cron. Definir no início do desenvolvimento. Redis não é necessário no MVP |
| Pagamentos | Stripe Billing, Checkout e Customer Portal |
| E-mail transacional | Provedor a definir (ex.: Resend), com domínio próprio autenticado (SPF, DKIM, DMARC) |
| Hospedagem | Vercel (web e APIs); Supabase (banco, autenticação, storage) |
| Agente | .NET 10 (LTS), Windows Service, instalador MSI assinado (sujeito à PoC) |
| Testes | Vitest (unidade), Playwright (fim a fim), testes de RLS e autorização; xUnit (agente) |
| Observabilidade | Logs estruturados sem dados fiscais; monitoramento de erros (ex.: Sentry) com remoção de dados sensíveis |
| Repositório | Monorepo `E:\seguenota` (ex.: `apps/web`, `apps/agent`, `packages/shared`, `supabase/`) |

**Observações:**
- Como as chamadas ao ADN ficam no agente, o backend não faz tarefas longas contra a API nacional. As tarefas assíncronas do backend são curtas e quebráveis (ingestão de lote, geração de arquivos), o que é compatível com funções serverless + fila.
- Projeto Supabase **novo e separado** do legado. Os segredos do legado devem ser **revogados e substituídos** (DOCUMENTACAO_TECNICA §9.5), independentemente do Segue Nota.
- Os contratos entre agente e backend (DTOs) são versionados e documentados (OpenAPI) em `packages/shared`.

---

## 18. REQUISITOS NÃO FUNCIONAIS

- **Desempenho:** listagens paginadas com resposta < 1 s para até 100 mil notas por organização; páginas públicas com bons Core Web Vitals.
- **Escalabilidade:** projetar para organizações com centenas de CNPJs e milhões de documentos no total, com índices e particionamento lógico por organização.
- **Confiabilidade:** nenhum documento perdido ou duplicado; operações idempotentes de ponta a ponta.
- **Disponibilidade:** a falha de um agente não afeta outras organizações; a plataforma continua consultável com o agente offline.
- **Segurança:** seção 14; dependências atualizadas; revisão de segurança antes de cada lançamento.
- **Idioma e formato:** pt-BR, moeda BRL, datas dd/mm/aaaa, fuso America/Sao_Paulo.
- **Ambientes:** desenvolvimento (ADN produção restrita), preview/homologação (ADN produção restrita, `noindex`) e produção.

---

## 19. DESENVOLVIMENTO COM CLAUDE CODE

- O PRD (`docs/PRD.md`) é a referência de produto. As diretrizes técnicas, as convenções e a estrutura de pastas ficam no `CLAUDE.md` da raiz, criado no próprio Claude Code. Os milestones são definidos depois do `CLAUDE.md`.
- Diretório do projeto: `E:\seguenota` (vazio, ainda não é repositório git).
- **Pré-requisitos do ambiente:**
  - inicializar o repositório git;
  - instalar a Vercel CLI (`npm i -g vercel`);
  - autorizar os MCPs da Stripe e da Vercel;
  - corrigir a autenticação do MCP do GitHub;
  - instalar o SDK do .NET 10 para o agente.
- **Skills e agentes do Claude Code recomendados por área:**
  - Banco e RLS: `supabase-postgres-best-practices`
  - Frontend: `nextjs`, `shadcn`, `react-best-practices`, `frontend-design`, `dataviz`; agente `frontend-developer`
  - Filas e jobs: `queues`, `workflow`, `vercel-functions`
  - Pagamentos: `stripe-best-practices`, `stripe-docs`, `test-cards`
  - Deploy e performance: `deploy`, `env-vars`; agentes `vercel:deployment-expert`, `vercel:performance-optimizer`
  - Qualidade e segurança: `code-review`, `security-review`, `security-audit`; agente `code-reviewer`
  - Planejamento: agente `Plan`
- O código legado é lido somente para entender regras; o novo código é escrito do zero.

---

## 20. DECISÕES REGISTRADAS

| # | Decisão |
|---|---|
| D1 | Certificados ficam apenas no computador do cliente; o upload de certificado foi rejeitado |
| D2 | Somente A1; A3 fora do escopo (melhoria futura sob demanda) |
| D3 | Cada CNPJ tem exatamente um certificado próprio (titular = CNPJ consultado); procuração fora do escopo |
| D4 | Cada CNPJ é sincronizado por um único agente |
| D5 | Toda chamada ao ADN é feita pelo agente; o backend não acessa o ADN |
| D6 | DANFSe gerado no backend a partir do XML (NT-008); API de DANFSe não é usada |
| D7 | Organização principal por competência, com fechamento de competência e marcação de extemporâneos |
| D8 | Carga inicial por competência inicial, até o presente, seguida de sincronização incremental contínua |
| D9 | Situação fiscal derivada dos eventos, não do `cStat` do XML |
| D10 | Agente em .NET 10 (LTS), sujeito à PoC |
| D11 | Projeto Supabase novo, separado do legado |
| D12 | Usuário pode pertencer a várias organizações |
| D13 | Notificações por e-mail e na plataforma |

---

## 21. PENDÊNCIAS

| # | Pendência | Impacto | Padrão até a definição |
|---|---|---|---|
| P1 | Preços, faixas de desconto, trial, cobrança proporcional, limites | Cobrança | Catálogo configurável com valores de teste |
| P2 | Prazos de retenção e exclusão (análise jurídica e fiscal) | LGPD e storage | Nenhuma exclusão automática |
| P3 | Domínio oficial do Segue Nota | SEO, e-mail, canonical | Variável de ambiente `NEXT_PUBLIC_SITE_URL` |
| P4 | Provedor de e-mail transacional | Notificações | Interface de envio abstrata |
| P5 | Fila: Vercel Queues/Workflow ou Supabase Queues | Backend assíncrono | Decidir no início do desenvolvimento |
| P6 | Modo de execução do agente e local dos certificados (Service × usuário; CurrentUser × LocalMachine) | Agente | Resultado da PoC (9.9) |
| P7 | Intervalo padrão de sincronização e limites seguros de requisições ao ADN | Agente e planos | 60 min, a validar na PoC |
| P8 | Migração dos clientes atuais do NF Tracker (Hotmart → Stripe) | Comercial | Fora do MVP técnico; definir plano comercial |
| P9 | Emissão de NFS-e da M2S sobre as assinaturas | Fiscal da M2S | Processo externo à plataforma por enquanto |
| P10 | Meios de pagamento (cartão, boleto, Pix) no Stripe Brasil | Conversão | Cartão no MVP |
| P11 | Certificado de assinatura de código (Authenticode) para o agente | Distribuição | Adquirir antes do piloto com clientes |
| P12 | Volumes de referência (CNPJs por escritório, notas por mês) | Dimensionamento | Premissas da seção 18 |
| P13 | Cores e identidade visual definitivas | Design | Paleta inicial da seção 16 |

---

## 22. PROCESS

- Break app build into logical milestones (steps)
- Each milestone should be a deliverable increment
- Prioritize core functionality first, then iterate
- Test each milestone before moving to the next

> Esse é o PRD do Segue Nota.
