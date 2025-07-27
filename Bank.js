document.addEventListener("DOMContentLoaded" , async() => {
    const stackAmountElement = document.getElementById("stackAmt");
    const stackRewardElement = document.getElementById("stackReward");

    const stackButton = document.getElementById("stackButton");
    const unStackButton = document.getElementById("unstackButton")

    const provider = new ethers.provider.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const address = signer.getAddress();
    const contract = new ethers.Contract(BankContractAddr , BankContractABI, provider);
    const stackAmount = await contract.stackAmt(address);
    const toEth1 = ethers.utils.formateEther(ethers.BigNumber.from(stackAmount).toString());
    stackAmountElement.textContent = toEth1 + " MR"
})