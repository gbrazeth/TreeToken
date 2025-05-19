// ====== CONFIGURE SEU ENDEREÇO DE CONTRATO NA SEPOLIA ABAIXO ======
const CONTRACT_ADDRESS = "0x441E5A316D189fA49B1C0E6EAedA3c5fa98Ab907";
const CONTRACT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
  "function burn(uint256)",
  "function airdrop(address[],uint256)",
];

// ===== INTEGRAÇÃO COM ALCHEMY =====
const alchemyProvider = new ethers.providers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/KA9m2y9RysYQf3ilaJdBDFFIMkVvesDi"
);


let provider, signer, contract, contractRead, userAddress;

const connectBtn = document.getElementById('connectBtn');
const walletInfo = document.getElementById('walletInfo');
const walletAddress = document.getElementById('walletAddress');
const userBalance = document.getElementById('userBalance');
const tokenName = document.getElementById('tokenName');
const tokenSymbol = document.getElementById('tokenSymbol');
const totalSupply = document.getElementById('totalSupply');
const statusDiv = document.getElementById('status');

async function connectWallet() {
  if (!window.ethereum) {
    showStatus('MetaMask não encontrada. Instale para continuar.', 'alert-danger');
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();

  // Para transações (escrita)
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  // Para leituras (Alchemy)
  contractRead = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, alchemyProvider);

  walletInfo.style.display = '';
  walletAddress.innerText = userAddress;
  await updateTokenData();
  renderHistoryPanel(userAddress);
}

async function updateTokenData() {
  try {
    tokenName.innerText = await contractRead.name();
    tokenSymbol.innerText = await contractRead.symbol();
    const decimals = await contractRead.decimals();
    const supply = await contractRead.totalSupply();
    totalSupply.innerText = ethers.utils.formatUnits(supply, decimals);

    if (userAddress) {
      // Para saldo do usuário, usamos o AlchemyProvider também
      const balance = await contractRead.balanceOf(userAddress);
      userBalance.innerText = ethers.utils.formatUnits(balance, decimals);
    }
  } catch (e) {
    showStatus('Erro ao buscar dados do token.', 'alert-danger');
  }
}

function showStatus(msg, type) {
  statusDiv.innerText = msg;
  statusDiv.className = 'alert ' + type;
  statusDiv.style.display = '';
  setTimeout(() => { statusDiv.style.display = 'none'; }, 4000);
}

// ====== Event Listeners ======
connectBtn.onclick = connectWallet;

document.getElementById('transferForm').onsubmit = async (e) => {
  e.preventDefault();
  try {
    const to = document.getElementById('transferTo').value.trim();
    const amount = document.getElementById('transferAmount').value;
    const decimals = await contractRead.decimals();
    const tx = await contract.transfer(to, ethers.utils.parseUnits(amount, decimals));
    await tx.wait();
    await updateTokenData();
    renderHistoryPanel(userAddress);
    showStatus('Transferência realizada com sucesso!', 'alert-success');
  } catch (err) {
    showStatus('Falha na transferência: ' + (err.data?.message || err.message), 'alert-danger');
  }
};

document.getElementById('burnForm').onsubmit = async (e) => {
  e.preventDefault();
  try {
    const amount = document.getElementById('burnAmount').value;
    const decimals = await contractRead.decimals();
    const tx = await contract.burn(ethers.utils.parseUnits(amount, decimals));
    await tx.wait();
    await updateTokenData();
    renderHistoryPanel(userAddress);
    showStatus('Tokens queimados com sucesso!', 'alert-success');
  } catch (err) {
    showStatus('Falha ao queimar tokens: ' + (err.data?.message || err.message), 'alert-danger');
  }
};

document.getElementById('airdropForm').onsubmit = async (e) => {
  e.preventDefault();
  try {
    const addressesRaw = document.getElementById('airdropAddresses').value.trim();
    const amount = document.getElementById('airdropAmount').value;
    const addresses = addressesRaw.split(/\n|,/).map(a => a.trim()).filter(a => a);
    if (addresses.length < 3) {
      showStatus('Informe pelo menos 3 endereços.', 'alert-danger');
      return;
    }
    const decimals = await contractRead.decimals();
    const tx = await contract.airdrop(addresses, ethers.utils.parseUnits(amount, decimals));
    await tx.wait();
    await updateTokenData();
    renderHistoryPanel(userAddress);
    showStatus('Airdrop realizado com sucesso!', 'alert-success');
  } catch (err) {
    showStatus('Falha no airdrop: ' + (err.data?.message || err.message), 'alert-danger');
  }
};