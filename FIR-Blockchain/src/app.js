let firContract; 
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
        const contractAddress = '0x469B57Ec9EAc84F32293b68C94De7DAb839FB2DA'; // Replace with your contract address

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
    try {
        const totalFIRs = await firContract.methods.getTotalFIRs().call();
        console.log('Total FIRs:', totalFIRs);  // Check the total FIRs in the console

        const firListContainer = document.getElementById('firListContainer');
        firListContainer.innerHTML = ''; // Clear the list before appending new FIRs

        if (totalFIRs === "0") {
            firListContainer.innerHTML = "<p>No FIRs found.</p>";
            return;
        }

        for (let i = 0; i < totalFIRs; i++) {
            const fir = await firContract.methods.getFIR(i).call();
            console.log("FIR Data at index", i, ":", fir); // Debugging FIR data

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
    } catch (error) {
        console.error("Error displaying FIRs:", error);
    }
}

// Add this code at the end of your current app.js

document.getElementById('viewFIRs').addEventListener('click', displayFIRs);

// Modified displayFIRs function to correctly display FIRs
// Add this code to your app.js

// Function to populate printable content
function preparePrintableFIR(firData) {
    const printableFIR = document.getElementById('printableFIR');
    printableFIR.innerHTML = `
      <div class="fir-details">
        <h2>FIR Report</h2>
        <p><strong>FIR ID:</strong> ${firData.FIRID}</p>
        <p><strong>Police Station:</strong> ${firData.policeStation}</p>
        <p><strong>Criminal Details:</strong> ${firData.criminalDetails}</p>
        <p><strong>Incident Details:</strong> ${firData.incidentDetails}</p>
        <p><strong>Victim Details:</strong> ${firData.victimDetails}</p>
        <p><strong>Officer Details:</strong> ${firData.officerDetails}</p>
        <p><em>FIR stored on Ethereum blockchain at address: ${contractAddress}</em></p>
      </div>
    `;
  }
  
  // Print button handler
  document.getElementById('printFIRButton').addEventListener('click', async () => {
    const firIndex = 0; // Replace with logic to select the FIR index (e.g., latest FIR)
    const firData = await contract.methods.getFIR(firIndex).call();
    preparePrintableFIR(firData);
    window.print(); // Trigger browser print dialog
  });
