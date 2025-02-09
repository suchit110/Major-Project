// abi.js - Stores both Auth and FIR contract ABIs

const authABI = [
    {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "officerAddress",
            "type": "address"
          }
        ],
        "name": "OfficerLoggedIn",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "officerAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "username",
            "type": "string"
          }
        ],
        "name": "OfficerRegistered",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_username",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_email",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_password",
            "type": "string"
          }
        ],
        "name": "registerOfficer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_password",
            "type": "string"
          }
        ],
        "name": "loginOfficer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [],
        "name": "isOfficerRegistered",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      }
];

const firABI = [
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "_authContract",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "authContract",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "firs",
        "outputs": [
          {
            "internalType": "string",
            "name": "FIRID",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "policeStation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "stationName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "criminalDetails",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "incidentLocation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "victimDetails",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "officerDetails",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_FIRID",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_policeStation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_stationName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_criminalDetails",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_incidentLocation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_victimDetails",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_officerDetails",
            "type": "string"
          }
        ],
        "name": "createFIR",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "getFIR",
        "outputs": [
          {
            "components": [
              {
                "internalType": "string",
                "name": "FIRID",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "policeStation",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "stationName",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "criminalDetails",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "incidentLocation",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "victimDetails",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "officerDetails",
                "type": "string"
              }
            ],
            "internalType": "struct FIR.FIRDetails",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getTotalFIRs",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
];

const authContractAddress = "0x3cBcE79e214023DBF769980ef9c4e511E1b11Fdf"; // Replace with actual address
const firContractAddress = "0x3cBcE79e214023DBF769980ef9c4e511E1b11Fdf";   // Replace with actual address

export { authABI, authContractAddress, firABI, firContractAddress };

