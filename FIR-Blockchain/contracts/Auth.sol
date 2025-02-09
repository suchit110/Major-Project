// contracts/Auth.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auth {
    struct Officer {
        string username;
        string email;
        bytes32 passwordHash; // Storing password securely as a hash
        bool isRegistered;
    }

    mapping(address => Officer) private officers;

    event OfficerRegistered(address officerAddress, string username);
    event OfficerLoggedIn(address officerAddress);

    function registerOfficer(string memory _username, string memory _email, string memory _password) public {
        require(!officers[msg.sender].isRegistered, "Officer already registered");

        officers[msg.sender] = Officer({
            username: _username,
            email: _email,
            passwordHash: keccak256(abi.encodePacked(_password)),
            isRegistered: true
        });

        emit OfficerRegistered(msg.sender, _username);
    }

    function loginOfficer(string memory _password) public view returns (bool) {
        require(officers[msg.sender].isRegistered, "Officer not registered");
        return officers[msg.sender].passwordHash == keccak256(abi.encodePacked(_password));
    }

    function isOfficerRegistered() public view returns (bool) {
        return officers[msg.sender].isRegistered;
    }
}
