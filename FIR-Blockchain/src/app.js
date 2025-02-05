let firContract;
window.addEventListener('load', async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        
        try {
            await ethereum.request({ method: 'eth_requestAccounts' });
            alert('MetaMask is connected!');
        } catch (error) {
            console.error("User denied account access:", error);
            alert("Please connect your MetaMask wallet to proceed.");
        }

        const networkId = await web3.eth.net.getId();
        console.log('Network ID:', networkId);

        // Replace with your contract address
        const contractAddress = '0x780b2ff33841A7f800978C9869A35ea2a45f7613';

        // ABI of the contract
        const abi = [ 
            {
                "inputs": [
                    { "internalType": "uint256", "name": "index", "type": "uint256" }
                ],
                "name": "getFIR",
                "outputs": [
                    {
                        "components": [
                            { "internalType": "string", "name": "FIRID", "type": "string" },
                            { "internalType": "string", "name": "policeStation", "type": "string" },
                            { "internalType": "string", "name": "criminalDetails", "type": "string" },
                            { "internalType": "string", "name": "incidentLocation", "type": "string" },
                            { "internalType": "string", "name": "victimDetails", "type": "string" },
                            { "internalType": "string", "name": "officerDetails", "type": "string" }
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
                "inputs": [
                    { "internalType": "string", "name": "_FIRID", "type": "string" },
                    { "internalType": "string", "name": "_policeStation", "type": "string" },
                    { "internalType": "string", "name": "_criminalDetails", "type": "string" },
                    { "internalType": "string", "name": "_incidentLocation", "type": "string" },
                    { "internalType": "string", "name": "_victimDetails", "type": "string" },
                    { "internalType": "string", "name": "_officerDetails", "type": "string" }
                ],
                "name": "createFIR",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getTotalFIRs",
                "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
                "stateMutability": "view",
                "type": "function"
            }
        ];

        firContract = new web3.eth.Contract(abi, contractAddress);

        // Handle FIR Form Submission
        document.getElementById('firForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get input values
            const firID = document.getElementById('firID').value;
            const policeStation = document.getElementById('policeStation').value;
            const criminalDetails = document.getElementById('criminalDetails').value;
            const incidentLocation = document.getElementById('incidentLocation').value; // Fixed variable name
            const victimDetails = document.getElementById('victimDetails').value;
            const officerDetails = document.getElementById('officerDetails').value;

            const accounts = await web3.eth.getAccounts();

            try {
                await firContract.methods.createFIR(firID, policeStation, criminalDetails, incidentLocation, victimDetails, officerDetails)
                    .send({ from: accounts[0] });

                alert('FIR submitted successfully!');

                // Redirect to map.html with location as query parameter
                window.location.href = `map.html?location=${encodeURIComponent(incidentLocation)}`;

            } catch (error) {
                console.error("Error submitting FIR:", error);
                alert("There was an error submitting the FIR.");
            }
        });
    } else {
        alert("Please install MetaMask to interact with the blockchain.");
    }
});
