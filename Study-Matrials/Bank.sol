// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./Study-Matrials/MrToken.sol";
import "./Study-Matrials/ORToken.sol";
contract Bank{
    MrToken public mrToken;
    ORToken public orToken;
    address public owner;

    address[] public stackers;

    mapping(address => uint) public stackAmt;
    mapping(address => bool) public isStacked;

    constructor(MrToken _mrToken, ORToken _orToken){
        mrToken = _mrToken;
        orToken = _orToken;
        owner =  msg.sender;
    }

    function stack(uint _amt) public {
        require(_amt > 0 , "Less amount !");
        stackAmt[msg.sender] += _amt;
        isStacked[msg.sender] = true;
        stackers.push(msg.sender);
        mrToken.transferFrom(msg.sender, address(this), _amt);
    }


    function unStack() public {
        require(isStacked[msg.sender] , "Not Inverseted !");
        uint value = stackAmt[msg.sender];
        stackAmt[msg.sender] = 0;
        isStacked[msg.sender] = false;
        mrToken.transfer(msg.sender, value);
    }

    function issueToken() public {
        require(msg.sender == owner , "Not Owner");
        for(uint i = 0 ; i < stackers.length; i++){
            address stacker = stackers[i];
            uint amt = stackAmt[stacker];
            orToken.transfer(stacker, amt);
        }

    }
}