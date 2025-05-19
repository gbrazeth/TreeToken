// Painel de histórico de transações TREE usando o Alchemy SDK
// Este arquivo pode ser incluído no frontend para buscar e exibir transferências ERC-20 do contrato TreeToken

const TREE_CONTRACT = "0x441E5A316D189fA49B1C0E6EAedA3c5fa98Ab907";
const ALCHEMY_API_KEY = "KA9m2y9RysYQf3ilaJdBDFFIMkVvesDi";

async function fetchTreeTokenHistory(address) {
  console.log('[DEBUG] Consultando histórico para:', address);
  const url = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
  // Buscar transferências recebidas
  const paramsTo = {
    fromBlock: "0x0",
    toAddress: address,
    contractAddresses: [TREE_CONTRACT],
    category: ["erc20"],
    maxCount: "0x14"
  };
  const paramsFrom = {
    fromBlock: "0x0",
    fromAddress: address,
    contractAddresses: [TREE_CONTRACT],
    category: ["erc20"],
    maxCount: "0x14"
  };
  // Executar as duas buscas em paralelo
  const [respTo, respFrom] = await Promise.all([
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [paramsTo]
      })
    }),
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "alchemy_getAssetTransfers",
        params: [paramsFrom]
      })
    })
  ]);
  const dataTo = await respTo.json();
  const dataFrom = await respFrom.json();
  console.log('[DEBUG] Resposta API toAddress:', dataTo);
  console.log('[DEBUG] Resposta API fromAddress:', dataFrom);
  const transfersTo = (dataTo.result && dataTo.result.transfers) ? dataTo.result.transfers : [];
  const transfersFrom = (dataFrom.result && dataFrom.result.transfers) ? dataFrom.result.transfers : [];
  // Unir e remover duplicatas (por hash + logIndex)
  const txMap = {};
  [...transfersTo, ...transfersFrom].forEach(tx => {
    txMap[tx.hash + '-' + tx.logIndex] = tx;
  });
  const result = Object.values(txMap);
  console.log('[DEBUG] Resultado transfers:', result);
  return result;
}

async function renderHistoryPanel(address) {
  const panel = document.getElementById('historyPanel');
  panel.innerHTML = '<em>Carregando histórico...</em>';
  const txs = await fetchTreeTokenHistory(address);
  if (!txs.length) {
    panel.innerHTML = '<em>Nenhuma transferência TREE encontrada.</em>';
    return;
  }
  let html = `<table class="table table-sm"><thead><tr><th>Hash</th><th>De</th><th>Para</th><th>Qtd</th><th>Bloco</th></tr></thead><tbody>`;
  for (const tx of txs) {
    html += `<tr>
      <td><a href="https://sepolia.etherscan.io/tx/${tx.hash}" target="_blank">${tx.hash.slice(0,8)}...</a></td>
      <td>${tx.from}</td>
      <td>${tx.to}</td>
      <td>${tx.rawContract && tx.rawContract.value ? (parseInt(tx.rawContract.value, 16) / 1e18) : 0}</td>
      <td>${tx.blockNum}</td>
    </tr>`;
  }
  html += '</tbody></table>';
  panel.innerHTML = html;
}

// Expor função global
window.renderHistoryPanel = renderHistoryPanel;
