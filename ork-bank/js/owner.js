import {MrTokenABI, MrTokenADDR,
  ORTokenABI, ORTokenADDR,
  BankABI, BankContractADDR} from './config.js'
let web3;
let accounts = [];
const OWNER_ACCOUNT = "0xA4e4580d56C1a2bdCF41D79bE79E66BC352Fc6f8";
const OWNER_EMAIL = "mohamedrasih134@gmail.com";
const OWNER_PASSWORD = "malickbatcha";

// Contract addresses (replace with deployed ones)
const BANK_ADDRESS = BankContractADDR;
const MRT_ADDRESS = MrTokenADDR;
const ORK_ADDRESS = ORTokenADDR;

// ABI placeholders (replace with actual ABIs after compile)


let bank, mrToken, orToken;
let walletAddress = null
window.addEventListener("load", async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    bank = new web3.eth.Contract(BankABI, BANK_ADDRESS);
    mrToken = new web3.eth.Contract(MrTokenABI, MRT_ADDRESS);
    orToken = new web3.eth.Contract(ORTokenABI, ORK_ADDRESS);
  } else {
    document.getElementById("formMessage").innerText = "MetaMask not found!";
  }

  document.getElementById("metamaskConnectBtn").addEventListener("click", connectWallet);
  document.getElementById("issueTokenBtn").addEventListener("click", issueTokens);

  loadDummyData();
  ;
});

// Connect Wallet
async function connectWallet() {
  try {
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("metamaskConnectBtn").innerText = "Connected";
    updateOwnerBalances();
    
  } catch (err) {
    console.error(err);
  
  }
  
  // if (typeof window.ethereum !== "undefined") {
  //     try {
  //       const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  //       walletAddress = accounts[0]?.toLowerCase();
  //       const formatAddress = walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4);
  //       const metamaskBtn = document.getElementById("metamaskConnectBtn");
  //       metamaskBtn.textContent = `Connected: ${formatAddress}`;
  //       updateOwnerBalances()
  //       metamaskBtn.disabled = true;
        
        

  //     } catch (err) {
  //       alert("MetaMask connection failed.");
  //       console.log(err);
  //     }
  //   } else {
  //     alert("Please install MetaMask.");
  //   }
}

// Format short address
  // function formatAddress(address) {
  //   return address.slice(0, 6) + '...' + address.slice(-4);
  // }

// Dummy data (persisted in localStorage)
function loadDummyData() {
  let dummyUsers = JSON.parse(localStorage.getItem("users")) || [
    { username: "Alice", metamask: "0x1111111111111111111111111111111111111111", invested: 50, issued: 50, lastInvested: 20, lastPublish: false },
    { username: "Bob", metamask: "0x2222222222222222222222222222222222222222", invested: 70, issued: 70, lastInvested: 30, lastPublish: false },
  ];
  renderTable(dummyUsers);
}

// function renderTable(users) {
//   const tbody = document.getElementById("userTableBody");
//   tbody.innerHTML = "";

//   let totalInvested = 0, totalIssued = 0, lastInvested = 0, lastIssued = 0;

//   users.forEach((u) => {
//     totalInvested += u.invested;
//     totalIssued += u.issued;
//     lastInvested = u.lastInvested;
//     lastIssued = u.lastPublish ? 0 : u.lastInvested ;

//     let mask = u.metamask;
//     let shortMask = mask.slice(0, 6) + "..." + mask.slice(-4);

//     let row = `<tr>
//       <td>${u.username || "Default User"}</td>
//       <td>${shortMask}</td>
//       <td>${u.invested}</td>
//       <td>${u.issued}</td>
//       <td>${u.lastInvested}</td>
//       <td>${u.lastPublish}</td>
//     </tr>`;
//     tbody.innerHTML += row;
//   });

//   document.getElementById("totalInvested").innerText = totalInvested;
//   document.getElementById("totalIssued").innerText = totalIssued;
//   document.getElementById("lastInvested").innerText = lastInvested;
//   document.getElementById("lastIssued").innerText = lastIssued;

//   document.getElementById("orkBalance").innerText = "…"; // load async
//   document.getElementById("mrtBalance").innerText = "…"; // load async
//   document.getElementById("lastOrkValue").innerText = lastIssued;

//   localStorage.setItem("users", JSON.stringify(users));
// }
function renderTable(users) {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  let totalInvested = 0, totalIssued = 0, lastInvested = 0, lastIssued = 0;

  users.forEach((u) => {
    totalInvested += u.invested;
    totalIssued += u.issued;
    lastInvested = u.lastInvested;

    // ✅ Fix: Sum up all users whose lastPublish = false
    if (!u.lastPublish) {
      lastIssued += u.lastInvested;
    }

    let mask = u.metamask;
    let shortMask = mask.slice(0, 6) + "..." + mask.slice(-4);

    let row = `<tr>
      <td>${u.username || "Default User"}</td>
      <td>${shortMask}</td>
      <td>${u.invested}</td>
      <td>${u.issued}</td>
      <td>${u.lastInvested}</td>
      <td>${u.lastPublish}</td>
    </tr>`;
    tbody.innerHTML += row;
  });

  document.getElementById("totalInvested").innerText = totalInvested;
  document.getElementById("totalIssued").innerText = totalIssued;
  document.getElementById("lastInvested").innerText = lastInvested;
  document.getElementById("lastIssued").innerText = lastIssued;

  document.getElementById("orkBalance").innerText = "…"; // load async
  document.getElementById("mrtBalance").innerText = "…"; // load async
  document.getElementById("lastOrkValue").innerText = lastIssued;

  localStorage.setItem("users", JSON.stringify(users));
}


// Update owner balances from blockchain
async function updateOwnerBalances() {
  if (!accounts.length) return;
  try {
    const orkBal = await orToken.methods.balanceOf(OWNER_ACCOUNT).call();
    const mrtBal = await mrToken.methods.balanceOf(OWNER_ACCOUNT).call();

    document.getElementById("orkBalance").innerText = web3.utils.fromWei(orkBal, "ether");
    document.getElementById("mrtBalance").innerText = web3.utils.fromWei(mrtBal, "ether");
  } catch (e) {
    console.error("Balance fetch error", e);
  }
}

// Issue Token
async function issueTokens() {
  const metamaskInput = document.getElementById("ownerMetamask").value.trim();
  const emailInput = document.getElementById("ownerEmail").value.trim();
  const passwordInput = document.getElementById("ownerPassword").value.trim();
  const messageBox = document.getElementById("formMessage");

  if (!accounts.length) {
    messageBox.innerText = "Please connect MetaMask first.";
    messageBox.style.color = "red";
    return;
  }

  if (metamaskInput !== OWNER_ACCOUNT || emailInput !== OWNER_EMAIL || passwordInput !== OWNER_PASSWORD) {
    messageBox.innerText = "Owner credentials do not match!";
    messageBox.style.color = "red";
    return;
  }

  if (accounts[0].toLowerCase() !== OWNER_ACCOUNT.toLowerCase()) {
    messageBox.innerText = "Connected account is not the Owner!";
    messageBox.style.color = "red";
    return;
  }

  try {
    // Call Solidity issueToken()
    await bank.methods.issueToken().send({ from: accounts[0] });

    // Update local data
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) => {
      u.issued += u.lastInvested;
      u.lastPublish = true;
      return u;
    });

    renderTable(users);
    updateOwnerBalances();

    messageBox.innerText = "✅ Tokens Issued Successfully!";
    messageBox.style.color = "green";
    localStorage.setItem("users", JSON.stringify(users));
  } catch (err) {
    console.error(err);
    messageBox.innerText = "❌ Issue Token failed!";
    messageBox.style.color = "red";
  }
}
