function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_requestAccounts" })
      .then(accounts => {
        alert("Connected: " + accounts[0]);
        document.getElementById("holder-name").innerText = accounts[0].slice(0, 6) + "...";
      })
      .catch(err => {
        alert("Connection failed: " + err.message);
      });
  } else {
    alert("MetaMask not detected!");
  }
}
