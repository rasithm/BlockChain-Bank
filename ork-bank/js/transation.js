import { MrTokenABI, ORTokenABI, BankABI,BankContractADDR , ORTokenADDR ,MrTokenADDR} from "./config.js";
const viewBalanceBtn = document.getElementById('viewBalanceBtn');
const transactionFormBtn = document.getElementById('transactionFormBtn');
const transactionContent = document.getElementById('transactionContent');
const metamaskBtn = document.getElementById('metamaskConnectBtn');

let walletAddress = "";
let walletBalance = 25000;
let userName = localStorage.getItem("user_name") || "Mohamed Rasith";
let userPassword = localStorage.getItem("user_password") || "malickbatcha";



// Format short address (0x1234...abcd)
function formatAddress(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

function updateCardDetails(address) {
  const shortWallet = address.slice(0, 10);
  const CVVCard = address.slice(-3);
  document.getElementById("cardNumber").textContent = `${shortWallet}###`;
  document.getElementById("cardHolder").textContent = userName;
  document.getElementById("cardExpiry").textContent = new Date().toLocaleDateString("en-GB").slice(0, 5);
  document.getElementById("cardCVV").textContent = CVVCard;
}

metamaskBtn?.addEventListener("click", async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      walletAddress = accounts[0];
      updateCardDetails(walletAddress);
      metamaskBtn.textContent = `Connected: ${formatAddress(walletAddress)}`;
      metamaskBtn.disabled = true;
    } catch (err) {
      alert("MetaMask connection failed.");
    }
  } else {
    alert("Please install MetaMask.");
  }
});

function renderTransactionForm() {
  transactionContent.innerHTML = `
    <form id="transactionForm">
      <label for="to">To Wallet Address</label>
      <input type="text" id="to" placeholder="0x..." required />

      <label for="tokenSelect">Select Token</label>
      <select id="tokenSelect">
        <option value="MRT">MRT</option>
        <option value="ORKT">ORKT</option>
      </select>

      <label for="amount">Amount</label>
      <input type="number" id="amount" placeholder="100" required />

      <label for="password">Password</label>
      <input type="password" id="password" placeholder="Enter Password" required />

      <button type="submit">Send</button>
    </form>
  `;

  document.getElementById("transactionForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const to = document.getElementById("to").value;
    const token = document.getElementById("tokenSelect").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const password = document.getElementById("password").value;

    if (!/^0x[a-fA-F0-9]{40}$/.test(to)) return alert("Invalid Ethereum address.");
    if (!to || !amount || !password) return alert("All fields required.");
    if (password !== userPassword) return alert("Incorrect password.");
    if (amount <= 0) return alert("Amount must be greater than 0.");

    // Contract setup
    const web3 = new Web3(window.ethereum);
    const abi = token === "MRT" ? MrTokenABI : ORTokenABI;
    const contractAddress = token === "MRT" ? MrTokenADDR : ORTokenADDR;
    const contract = new web3.eth.Contract(abi, contractAddress);

    function storeTransaction(fromId, toId, amount, currentUser) {
      const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

      const txData = {
        txId: "TXN" + Date.now(), // Unique transaction ID
        fromId: fromId,
        toId: toId,
        amount: amount,
        type: fromId.toLowerCase() === currentUser.toLowerCase() ? "debit" : "credit",
        timestamp: new Date().toISOString()
      };

      transactions.push(txData);
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }


    try {
          await contract.methods.transfer(to, web3.utils.toWei(amount.toString(), "ether"))
            .send({ from: walletAddress });

          storeTransaction(walletAddress, to, amount, walletAddress); // Store TX in localStorage

          alert(`✅ Sent ${amount} ${token} to ${to}`);
        } catch (err) {
      console.error(err);
      alert("Transfer failed.");
    }
  });
}

function renderBalanceForm() {
  transactionContent.innerHTML = `
    <form id="balanceForm">
      <label for="tokenCheck">Select Token</label>
      <select id="tokenCheck">
        <option value="MRT">MRT</option>
        <option value="ORKT">ORKT</option>
      </select>

      <label for="checkPassword">Password</label>
      <input type="password" id="checkPassword" placeholder="Enter Password" required />

      <button type="submit">Check Balance</button>
      <div id="balanceResult" class="balance-result"></div>
    </form>
  `;

  document.getElementById("balanceForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = document.getElementById("tokenCheck").value;
    const password = document.getElementById("checkPassword").value;
    const resultDiv = document.getElementById("balanceResult");

    if (password !== userPassword) return alert("Incorrect password.");
    if (!walletAddress) return alert("Connect MetaMask first.");
    
    const web3 = new Web3(window.ethereum);
    const abi = token === "MRT" ? MrTokenABI : ORTokenABI;
    const contractAddress = token === "MRT" ? MrTokenADDR : ORTokenADDR;
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
      const balance = await contract.methods.balanceOf(walletAddress).call();
      const ethBalance = web3.utils.fromWei(balance, "ether");
      resultDiv.innerHTML = `<strong>${token} Balance:</strong> ${ethBalance}`;
    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = `<span style="color:red">Error fetching balance</span>`;
    }
  });
}

// Toggle logic
viewBalanceBtn.addEventListener("click", renderBalanceForm);
transactionFormBtn.addEventListener("click", renderTransactionForm);

// Initial render
renderTransactionForm();
