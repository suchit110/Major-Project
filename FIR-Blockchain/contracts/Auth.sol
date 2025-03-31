// contracts/Auth.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auth {
    struct Officer {
        string username;
        string badgeNumber;
        string policeStation;
        bytes32 passwordHash; // Storing password securely as a hash
        bool isRegistered;
    }

    mapping(address => Officer) private officers;

    event OfficerRegistered(address officerAddress, string username, string badgeNumber);
    event OfficerLoggedIn(address officerAddress);

    function registerOfficer(
        string memory _username, 
        string memory _email,  // kept for backward compatibility but not used
        string memory _badgeNumber,
        string memory _policeStation,
        string memory _rank,   // kept for backward compatibility but not used
        string memory _password
    ) public {
        require(!officers[msg.sender].isRegistered, "Officer already registered");

        officers[msg.sender] = Officer({
            username: _username,
            badgeNumber: _badgeNumber,
            policeStation: _policeStation,
            passwordHash: keccak256(abi.encodePacked(_password)),
            isRegistered: true
        });

        emit OfficerRegistered(msg.sender, _username, _badgeNumber);
    }

    function loginOfficer(string memory _password) public view returns (bool) {
        require(officers[msg.sender].isRegistered, "Officer not registered");
        return officers[msg.sender].passwordHash == keccak256(abi.encodePacked(_password));
    }

    function verifyOfficerUsername(string memory _username) public view returns (bool) {
        require(officers[msg.sender].isRegistered, "Officer not registered");
        return keccak256(abi.encodePacked(officers[msg.sender].username)) == keccak256(abi.encodePacked(_username));
    }

    function isOfficerRegistered() public view returns (bool) {
        return officers[msg.sender].isRegistered;
    }
    
    function getOfficerDetails() public view returns (string memory, string memory, string memory) {
        require(officers[msg.sender].isRegistered, "Officer not registered");
        return (
            officers[msg.sender].username,
            officers[msg.sender].badgeNumber,
            officers[msg.sender].policeStation
        );
    }
}
