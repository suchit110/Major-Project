window.addEventListener('load', async () => {
    // Check if Web3 is injected (i.e., MetaMask is installed)
    if (window.ethereum) {
        // Create a new Web3 instance
        const web3 = new Web3(window.ethereum);
        
        // Request account access only when the user interacts
        const requestAccountAccess = async () => {
            try {
                await ethereum.request({ method: 'eth_requestAccounts' });
                alert('MetaMask is connected!');
            } catch (error) {
                console.error("User denied account access:", error);
                alert("Please connect your MetaMask wallet to proceed.");
            }
        };

        // Call this function when the user interacts
        // You can call this on a specific event like button click or form submission
        document.getElementById('connectWalletButton').addEventListener('click', requestAccountAccess);

        // Get the current network ID
        const networkId = await web3.eth.net.getId();
        console.log('Network ID:', networkId);

        // Replace with your contract ABI and address
        const contractAddress = '0xf3ee4a032e844435B3877E09CF713a28B367214e'; // Replace with your contract address

        const abi = [  {
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
                "name": "criminalDetails",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "incidentDetails",
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
            "type": "function",
            "constant": true
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
                "name": "_criminalDetails",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "_incidentDetails",
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
                    "name": "criminalDetails",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "incidentDetails",
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
            "type": "function",
            "constant": true
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
            "type": "function",
            "constant": true
          } ];

        const firContract = new web3.eth.Contract(abi, contractAddress);

        // Handle form submission
        document.getElementById('firForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get input values from form
            const firID = document.getElementById('firID').value;
            const policeStation = document.getElementById('policeStation').value;
            const criminalDetails = document.getElementById('criminalDetails').value;
            const incidentDetails = document.getElementById('incidentDetails').value;
            const victimDetails = document.getElementById('victimDetails').value;
            const officerDetails = document.getElementById('officerDetails').value;

            // Get the user's account
            const accounts = await web3.eth.getAccounts();

            // Submit the FIR data to the blockchain
            await firContract.methods.createFIR(firID, policeStation, criminalDetails, incidentDetails, victimDetails, officerDetails)
                .send({ from: accounts[0] });

            alert('FIR submitted successfully!');
        });
    } else {
        alert("Please install MetaMask to interact with the blockchain.");
    }
});
async function displayFIRs() {
    // Get the total number of FIRs stored on the blockchain
    const totalFIRs = await firContract.methods.getTotalFIRs().call();
    const firListContainer = document.getElementById('firListContainer');

    // Clear the current list before appending new FIRs
    firListContainer.innerHTML = '';

    // Fetch each FIR using the index
    for (let i = 0; i < totalFIRs; i++) {
        const fir = await firContract.methods.getFIR(i).call();

        // Create a new list item for each FIR
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>FIR ID:</strong> ${fir.FIRID}<br>
            <strong>Police Station:</strong> ${fir.policeStation}<br>
            <strong>Criminal Details:</strong> ${fir.criminalDetails}<br>
            <strong>Incident Details:</strong> ${fir.incidentDetails}<br>
            <strong>Victim Details:</strong> ${fir.victimDetails}<br>
            <strong>Officer Details:</strong> ${fir.officerDetails}<br><br>
        `;
        firListContainer.appendChild(li);
    }
}
