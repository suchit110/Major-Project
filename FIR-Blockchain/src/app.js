let firContract;
window.addEventListener('load', async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);

        document.getElementById("connectWalletButton").addEventListener("click", async () => {
            try {
                await ethereum.request({ method: 'eth_requestAccounts' });
                alert('MetaMask is connected!');
            } catch (error) {
                console.error("User denied account access:", error);
                alert("Please connect your MetaMask wallet to proceed.");
            }
        });

        const networkId = await web3.eth.net.getId();
        console.log('Network ID:', networkId);

        const contractAddress = '0x7226072e9Fe77620E4765e3c9F8B7B6520340223';
        const abi = [ {
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

        firContract = new web3.eth.Contract(abi, contractAddress);

        document.getElementById('firForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const firID = document.getElementById('firID').value;
            const policeStation = document.getElementById('policeStation').value;
            const criminalDetails = document.getElementById('criminalDetails').value;
            const incidentLocation = document.getElementById('incidentLocation').value;
            const victimDetails = document.getElementById('victimDetails').value;
            const officerDetails = document.getElementById('officerDetails').value;

            try {
                const accounts = await web3.eth.getAccounts();
                if (accounts.length === 0) {
                    alert("Please connect your MetaMask wallet first.");
                    return;
                }

                await firContract.methods.createFIR(firID, policeStation, criminalDetails, incidentLocation, victimDetails, officerDetails)
                    .send({ from: accounts[0], gas: 3000000 });

                // Store FIR location in localStorage
                let firLocations = JSON.parse(localStorage.getItem("firLocations")) || [];
                firLocations.push({ firID, incidentLocation });
                localStorage.setItem("firLocations", JSON.stringify(firLocations));

                alert("FIR submitted successfully! Location will appear on the map.");

                // Redirect to map.html with location as query parameter
                window.location.href = `map.html`;

            } catch (error) {
                console.error("Error submitting FIR:", error);
                alert("There was an error submitting the FIR.");
            }
        });
    } else {
        alert("Please install MetaMask to interact with the blockchain.");
    }
});
