
document.addEventListener('DOMContentLoaded', () => {
  const metamaskBtn = document.getElementById('metamaskConnectBtn');
  const creditTab = document.getElementById('creditTab');
  const debitTab = document.getElementById('debitTab');
  const transactionContainer = document.getElementById('transaction-container');

  let walletAddress = null;

  metamaskBtn?.addEventListener("click", async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        walletAddress = accounts[0]?.toLowerCase();
        metamaskBtn.textContent = `Connected: ${formatAddress(walletAddress)}`;
        metamaskBtn.disabled = true;

        // After connecting, show default credit
        renderTransactions('credit');

      } catch (err) {
        alert("MetaMask connection failed.");
        console.log(err);
      }
    } else {
      alert("Please install MetaMask.");
    }
  });

  // Format short address
  function formatAddress(address) {
    return address.slice(0, 6) + '...' + address.slice(-4);
  }

  // Render transactions after filtering by wallet
  function renderTransactions(type) {
    if (!walletAddress) {
      transactionContainer.innerHTML = `<p style="text-align:center;">Please connect MetaMask first.</p>`;
      return;
    }

    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const filtered = transactions.filter(tx => {
      if (type === 'credit') {
        return tx.toId?.toLowerCase() === walletAddress;
      } else if (type === 'debit') {
        return tx.fromId?.toLowerCase() === walletAddress;
      }
      return false;
    });

    transactionContainer.innerHTML = '';

    if (filtered.length === 0) {
      transactionContainer.innerHTML = `<p style="text-align:center;">No ${type} transactions found.</p>`;
      return;
    }

    filtered.forEach(tx => {
      const card = document.createElement('div');
      card.className = `transaction-card ${type}`;
      card.innerHTML = `
        <h4>Transaction #${tx.txId}</h4>
        <p><strong>From:</strong> ${tx.fromId}</p>
        <p><strong>To:</strong> ${tx.toId}</p>
        <p><strong>Amount:</strong> ${tx.amount} ETH</p>
        <p><strong>Time:</strong> ${new Date(tx.timestamp).toLocaleString()}</p>
      `;
      transactionContainer.appendChild(card);
    });
  }

  creditTab.addEventListener('click', () => {
    creditTab.classList.add('active');
    debitTab.classList.remove('active');
    renderTransactions('credit');
  });

  debitTab.addEventListener('click', () => {
    debitTab.classList.add('active');
    creditTab.classList.remove('active');
    renderTransactions('debit');
  });
});
