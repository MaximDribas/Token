var Token = artifacts.require("./Token.sol");

contract('Token', function(accounts) {
  var token = Token.deployed().then(function(instance) {
    token = instance;
  });
  var account_null = accounts[0];
  var account_one = accounts[1];
  var account_two = accounts[2];
  var salePrice = 2;
	var buyPrice = 3;

  it("should buy token correctly", function() {
    var account_one_starting_balance;
    var account_one_ending_balance;
    var _value = 6e+18;
    var amount = _value/buyPrice;

    return token.getSenderBalances.call({from: account_one}).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
    return token.sendTransaction({from: account_one, value: _value});
    }).then(function(){
      return token.getSenderBalances.call({from: account_one});
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance + amount, "Amount wasn't correctly taken from the sender");
    });
  });

  it("should send token correctly", function() {
    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;
    var amount = 1e+18;

    return token.getSenderBalances.call({from: account_one}).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
    return token.getSenderBalances.call({from: account_two});
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
    return token.sendToken(account_two, amount, {from: account_one});
    }).then(function() {
    return token.getSenderBalances.call({from: account_one});
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
    return token.getSenderBalances.call({from: account_two});
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });

  it("should send token to contract correctly", function() {
    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;
    var account_contract;

    var amount = 1e+18;
    return token.getContractAddress.call({from: account_one}).then(function(addr) {
      account_contract = addr;
    return token.getSenderBalances.call({from: account_one});
  }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return token.getSenderBalances.call({from: account_two});
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return token.sendToken(account_contract, amount, {from: account_one});
    }).then(function() {
      return token.sendToken(account_contract, amount, {from: account_two});
    }).then(function() {
      return token.getSenderBalances.call({from: account_one});
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return token.getSenderBalances.call({from: account_two});
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance - amount, "Amount wasn't correctly taken from the sender");
    });
  });

  it("should error when balances[msg.sender] < amount", function(){
      try {
          token.sendToken.call(account_two, 1e+18, {from: account_one});
      }
      catch (err) {
        assert.include(err.message, "balances", "The error message should contain 'balances'");
        return;
      }
  });

});
