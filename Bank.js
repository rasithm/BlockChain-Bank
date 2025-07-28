const MrTokenADDR = "0x211221Ccf03dca26500b549fcdFD7Da844A61c2D";
const MrTokenABI = [
    "function balanceOf(address)view returns(uint256)",
    "function approve(address, uint256)"
]

const ORTokenADDR = "0xc5dc7C81eb92C6863304646AC057456213f0A171";
const ORTokenABI = [
    "function balanceOf(address)view returns(uint256)"
    
]

const BankContractADDR = "0x60e1856c3d8B077d0cb0601C3FA215dB95A51251";
const BankContractABI = [
    "function stackAmt(address)view returns(uint256)",
    "function stack(uint256)",
    "function unStack()"
]

document.addEventListener("DOMContentLoaded" , async() => {
    const stackAmountElement = document.getElementById("stackAmt");
    const stackRewardElement = document.getElementById("stackReward");

    const stackButton = document.getElementById("stackButton");
    const unStackButton = document.getElementById("unstackButton")

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(BankContractADDR , BankContractABI, provider);
    const stackAmount = await contract.stackAmt(address);
    const toEth1 = ethers.utils.formatEther(ethers.BigNumber.from(stackAmount).toString());
    stackAmountElement.textContent = toEth1 + " MR";


    const Contract2 = new ethers.Contract(ORTokenADDR , ORTokenABI , provider)
    const earnedReward = await Contract2.balanceOf(address);
    const toEth2 = ethers.utils.formatEther(ethers.BigNumber.from(earnedReward).toString());
    stackRewardElement.textContent = toEth2 + " OR"

    if(typeof window.ethereum){
        try{
            window.ethereum.request({method : "eth_requestAccounts"}).then((account) => {
                console.log(account[0])
            })
        }catch(error){
            console.log(error)
        }
    }else{
        alert("Please install MetaMask")
    }


    stackButton.addEventListener("click" , async() => {
        try{
            const value = document.getElementById('TokenValue').value;
            const amt = ethers.utils.parseUnits(value , 18);
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const BankContract = new ethers.Contract(BankContractADDR , BankContractABI, signer);
            const MrToken = new ethers.Contract(MrTokenADDR , MrTokenABI , signer)
            const Approve = await MrToken.approve(BankContractADDR , amt)
            await Approve.wait();
            console.log("Approve Status:" , Approve)

            const transation = await BankContract.stack(amt , {
                gasLimit : 3000000
            })

            await transation.wait();
            console.log("Receipt" , transation);

            const stackAmount = await contract.stackAmt(address);
            const toEth1 = ethers.utils.formatEther(ethers.BigNumber.from(stackAmount).toString());
            stackAmountElement.textContent = toEth1 + " MR";


        }catch(error){
            console.log("stackButtonError" , error);
        }
    })

    unStackButton.addEventListener('click' , async() => {
        try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const BankContract = new ethers.Contract(BankContractADDR , BankContractABI, signer);
            const transation  = await BankContract.unStack();
            await transation.wait();
            console.log("Receipt :" , transation);

        }catch(error){
            console.log("UnstackBtn :" ,error );
        }
    })
})