pragma solidity ^0.4.23;

contract Token {
	mapping (address => uint) balances;
	uint salePrice = 2;
	uint buyPrice = 3;
	address owner;
	address contract_adress = this;
	constructor() public {
	  owner = tx.origin;
		}

	function () public payable  {
		uint amount = msg.value / buyPrice;
    balances[msg.sender] += amount;
    owner.transfer((amount * buyPrice) - (amount * salePrice));
	}

	function sendToken(address receiver, uint amount) external {
	  require(balances[msg.sender] >= amount, "Max balances[msg.sender] must be more or equal than amount!");
	  if (receiver == contract_adress){
	  	balances[msg.sender] -= amount;
	    msg.sender.transfer(amount * salePrice);
	    } else {
	  		balances[msg.sender] -= amount;
    		balances[receiver] += amount;
	    }
	}

	function getContractBalance() external view returns(uint256) {
		return address(this).balance;
  }

  function getSenderBalances() external view returns(uint) {
		return balances[msg.sender];
	}

	function getContractAddress() external view returns(address) {
		return contract_adress;
	}

}
