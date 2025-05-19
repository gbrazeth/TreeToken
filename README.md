# TreeToken Challenge

Este projeto implementa um token ERC-20 chamado TreeToken, utilizando Solidity e OpenZeppelin, com uma interface web para interação via Ether.js e Alchemy.

## Sumário
- [Features](#features)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Setup](#instalação-e-setup)
- [Execução do Frontend](#execução-do-frontend)
- [Webhook de Notificações (Alchemy)](#webhook-de-notificações-alchemy)
- [Testando](#testando)
- [Contato](#contato)

## Features
- Nome: TreeToken
- Símbolo: TREE
- Decimais: 18
- Supply inicial: 1.000.000 TREE (mintado para o deployer)
- Função de burn
- Função de airdrop para múltiplos endereços
- Integração com Alchemy (RPC, histórico e webhooks)

## Estrutura do Projeto
/tree-token-challenge  
├── contracts/TreeToken.sol  
├── frontend/index.html, style.css, app.js, alchemy-history.js, ethers.umd.min.js  
├── scripts/deploy.js  
├── webhook-server.js  
├── README.md  
├── .env (NÃO subir para o repositório)

## Instalação e Setup

1. Clone o repositório e instale as dependências:
    ```sh
    git clone <url-do-repo>
    cd tree-token-challenge
    npm install
    ```

2. Configuração da Alchemy API Key:
    Crie um arquivo `.env` na raiz do projeto:
    ```
    ALCHEMY_API_KEY=SEU_ALCHEMY_KEY
    WALLET_PRIVATE_KEY=SUA_PRIVATE_KEY
    ```

3. Compile o contrato:
    ```sh
    npx hardhat compile
    ```

4. Deploy do contrato (Hardhat):
    ```sh
    npx hardhat run scripts/deploy.js --network sepolia
    ```

> **Nota:** Utilizamos a rede Sepolia como testnet, pois o suporte à Goerli foi descontinuado pelo Alchemy. Sepolia é atualmente a rede de testes padrão para novos projetos Ethereum.

## Execução do Frontend

1. Entre na pasta `frontend`:
    ```sh
    cd frontend
    ```
2. Inicie um servidor HTTP simples:
    ```sh
    python3 -m http.server 5173
    ```
3. Abra [http://localhost:5173](http://localhost:5173) no navegador.

## Webhook de Notificações (Alchemy)

1. Execute o servidor webhook:
    ```sh
    node webhook-server.js
    ```
2. Em outro terminal, exponha a porta com ngrok:
    ```sh
    ngrok http 4000
    ```
3. Use a URL pública gerada (ex: `https://xxxx.ngrok-free.app/alchemy-webhook`) para configurar o webhook no painel do Alchemy.

## Testando

- Conecte sua carteira MetaMask ao frontend.
- Realize transferências, burns ou airdrops de TREE.
- Veja o histórico de transações no painel do frontend.
- Notificações de eventos aparecerão no terminal do webhook.

**Exemplo de uso:**
- Transferir TREE para outro endereço
- Queimar TREE do saldo próprio
- Realizar airdrop para múltiplos endereços
- Visualizar histórico de transações TREE

## Contato
Dúvidas ou sugestões: matheus@tree.company
