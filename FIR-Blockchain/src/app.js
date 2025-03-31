// FIR Contract ABI (Application Binary Interface)
const firABI = [
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

// FIR contract address - update with your deployed contract address
const firContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';  // Default local Hardhat deployment address

// Global variables
let web3;
let firContract;
let currentAccount;

// Initialize blockchain connection
async function initWeb3() {
    // Check if MetaMask is installed
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // Get the current active account
            const accounts = await web3.eth.getAccounts();
            currentAccount = accounts[0];
            
            if (!currentAccount) {
                console.error("No accounts available after connection");
                alert("No accounts detected in MetaMask. Please ensure you have at least one account in your wallet.");
                return false;
            }
            
            // Initialize the contract
            firContract = new web3.eth.Contract(firABI, firContractAddress);
            
            console.log("Web3 initialized with account:", currentAccount);
            
            // Setup event listener for account changes
            window.ethereum.on('accountsChanged', function (accounts) {
                if (accounts.length === 0) {
                    console.log('Please connect to MetaMask.');
                    document.getElementById("connectWalletButton").textContent = "Connect Wallet";
                    currentAccount = null;
                } else {
                    currentAccount = accounts[0];
                    console.log(`Account changed to ${currentAccount}`);
                    document.getElementById("connectWalletButton").textContent = `Connected: ${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
                }
            });
            
            return true;
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            return false;
        }
    } else {
        console.log('MetaMask not detected. Please install MetaMask!');
        alert('MetaMask is not installed. Please install MetaMask to use blockchain features.');
        return false;
    }
}

// Submit FIR to blockchain
async function submitToBlockchain(firData) {
    try {
        // Check if Web3 and accounts are available
        if (!web3 || !firContract) {
            throw new Error("Web3 or contract not initialized");
        }
        
        console.log("Starting blockchain transaction for FIR:", firData.FIRID);
        
        // Submit transaction with reasonable gas settings
        const receipt = await firContract.methods.createFIR(
            firData.FIRID,
            firData.policeStation,
            firData.criminalDetails,
            firData.incidentLocation,
            firData.victimDetails,
            firData.officerDetails
        ).send({
            from: currentAccount,
            gas: 3000000  // Set a reasonable gas limit
        });
        
        console.log("Transaction successful! Receipt:", receipt);
        console.log("Transaction hash:", receipt.transactionHash);
        
        // Store transaction hash in localStorage for reference
        try {
            // Get existing transactions or initialize empty array
            let transactions = JSON.parse(localStorage.getItem("firTransactions")) || [];
            
            // Add the new transaction
            transactions.push({
                firID: firData.FIRID,
                txHash: receipt.transactionHash,
                timestamp: new Date().toISOString(),
                blockNumber: receipt.blockNumber
            });
            
            // Save back to localStorage
            localStorage.setItem("firTransactions", JSON.stringify(transactions));
            console.log("Transaction hash saved to localStorage");
        } catch (storageError) {
            console.error("Error saving transaction hash:", storageError);
        }
        
        return receipt;
    } catch (error) {
        console.error("Blockchain submission error:", error);
        throw error;
    }
}

// Generate a unique FIR ID
function generateFIRID() {
    // Get current date components
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2); // Last 2 digits of year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month (01-12)
    const day = String(date.getDate()).padStart(2, '0'); // Day (01-31)
    
    // Generate random 4-digit number
    const random = Math.floor(1000 + Math.random() * 9000);
    
    // Format: FIR-YYMMDD-XXXX (YY=year, MM=month, DD=day, XXXX=random number)
    const firID = `FIR-${year}${month}${day}-${random}`;
    console.log("Generated FIR ID:", firID);
    return firID;
}

// Function to auto-fill officer details
function autofillOfficerDetails() {
    console.log("Autofilling officer details");
    
    try {
        // Check if user is logged in as an officer
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const isOfficer = localStorage.getItem("isOfficerLoggedIn") === "true";
        
        if (!isLoggedIn || !isOfficer) {
            console.log("Not logged in as an officer, using default values");
            // Use default officer details if not logged in
            const officerDetails = {
                name: "Officer John Doe",
                badge: "BD12345",
                station: "Central Police Station"
            };
            
            setOfficerDetails(officerDetails);
            return;
        }
        
        // Get logged in officer details from localStorage
        const userInfoStr = localStorage.getItem("userInfo");
        if (!userInfoStr) {
            console.log("No user info found in localStorage");
            return;
        }
        
        const userInfo = JSON.parse(userInfoStr);
        console.log("Retrieved user info from localStorage:", userInfo);
        
        if (!userInfo || !userInfo.username) {
            console.log("Invalid user info in localStorage");
            return;
        }
        
        // Build officer details from localStorage data
        const officerDetails = {
            name: userInfo.username || "Unknown Officer",
            badge: userInfo.badgeNumber || "Unknown",
            station: userInfo.policeStation || "Unknown Station"
        };
        
        console.log("Using officer details from login:", officerDetails);
        setOfficerDetails(officerDetails);
        
    } catch (error) {
        console.error("Error in autofillOfficerDetails:", error);
    }
}

// Helper function to set officer details in the form
function setOfficerDetails(officerDetails) {
    // Set officer details in the form
    const officerField = document.getElementById("officerDetails");
    if (officerField) {
        officerField.value = 
            `${officerDetails.name} (Badge: ${officerDetails.badge}, Station: ${officerDetails.station})`;
        
        // Make the field read-only
        officerField.readOnly = true;
        console.log("Officer details field populated:", officerField.value);
    } else {
        console.error("Officer details field not found");
    }
    
    // Set the police station
    const stationField = document.getElementById("policeStation");
    if (stationField) {
        stationField.value = officerDetails.station;
        console.log("Police station field populated:", stationField.value);
    } else {
        console.error("Police station field not found");
    }
}

// FIR submission function
async function submitFIR(event) {
    event.preventDefault();
    console.log("Submit FIR function called");
    
    // Check if user is logged in as an officer
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isOfficer = localStorage.getItem("isOfficerLoggedIn") === "true";
    
    if (!isLoggedIn || !isOfficer) {
        alert("You must be logged in as an officer to submit an FIR.");
        // Highlight the login status message
        const statusContainer = document.getElementById("loginStatusContainer");
        if (statusContainer) {
            statusContainer.style.animation = "highlight 2s 1";
            statusContainer.style.boxShadow = "0 0 10px rgba(255, 193, 7, 0.8)";
            
            // Remove highlight after animation
            setTimeout(() => {
                statusContainer.style.animation = "";
                statusContainer.style.boxShadow = "";
            }, 2000);
        }
        return false;
    }
    
    // Get form values - use the actual DOM values since they're autofilled
    const FIRID = document.getElementById("FIRID").value.trim();
    const policeStation = document.getElementById("policeStation").value.trim();
    const criminalDetails = document.getElementById("criminalDetails").value.trim();
    const incidentLocation = document.getElementById("incidentLocation").value.trim();
    const victimDetails = document.getElementById("victimDetails").value.trim();
    const officerDetails = document.getElementById("officerDetails").value.trim();
    
    // Validate input - ensure all required fields are filled
    if (!FIRID || !policeStation || !criminalDetails || !incidentLocation || !victimDetails || !officerDetails) {
        alert("Please fill all required fields");
        return false;
    }
    
    console.log("Form data validated:", {
        FIRID, policeStation, criminalDetails, incidentLocation, victimDetails, officerDetails
    });
    
    // Create FIR object
    const firData = {
        FIRID: FIRID,
        policeStation: policeStation,
        criminalDetails: criminalDetails,
        incidentLocation: incidentLocation,
        victimDetails: victimDetails,
        officerDetails: officerDetails,
        submittedBy: localStorage.getItem("username") || "Unknown Officer",
        submittedDate: new Date().toISOString()
    };
    
    // Save to localStorage first (for immediate use)
    try {
        // Get existing FIRs or initialize empty array
        let localFIRs = JSON.parse(localStorage.getItem("localFIRs")) || [];
        
        // Add the new FIR
        localFIRs.push(firData);
        
        // Save back to localStorage
        localStorage.setItem("localFIRs", JSON.stringify(localFIRs));
        console.log("FIR saved to localStorage with key 'localFIRs'");
        
        // Try to save to blockchain if Web3 is available
        if (window.ethereum && web3 && firContract && currentAccount) {
            try {
                // Show submitting status
                alert("Submitting to blockchain, please wait...");
                
                // Submit to blockchain
                await submitToBlockchain(firData);
                alert("FIR successfully submitted to blockchain! Redirecting to map view...");
                
                // Clear form fields that are not auto-generated/filled
                document.getElementById("criminalDetails").value = "";
                document.getElementById("incidentLocation").value = "";
                document.getElementById("victimDetails").value = "";
                
                // Encode the incident location for the URL
                const encodedLocation = encodeURIComponent(firData.incidentLocation);

                // Redirect to map page after successful blockchain submission with location parameter
                setTimeout(() => {
                    window.location.href = `map.html?location=${encodedLocation}&firId=${firData.FIRID}`;
                }, 1000);
                
                // Return true to indicate successful submission
                return true;
            } catch (blockchainError) {
                console.error("Blockchain submission failed:", blockchainError);
                alert("FIR saved locally, but blockchain submission failed: " + blockchainError.message);
                
                // Return false to indicate partial success (saved locally but not to blockchain)
                return false;
            }
        } else {
            // Only localStorage available
            alert("FIR saved locally. No blockchain connection available.");
            
            // Clear form fields that are not auto-generated/filled
            document.getElementById("criminalDetails").value = "";
            document.getElementById("incidentLocation").value = "";
            document.getElementById("victimDetails").value = "";
            
            // Encode the incident location for the URL
            const encodedLocation = encodeURIComponent(firData.incidentLocation);
            
            // Redirect to map page after successful local submission with location parameter
            setTimeout(() => {
                window.location.href = `map.html?location=${encodedLocation}&firId=${firData.FIRID}&local=true`;
            }, 1000);
            
            // Return true to indicate successful submission
            return true;
        }
    } catch (error) {
        // Handle localStorage errors
        console.error("Error saving to localStorage:", error);
        alert("Error saving FIR: " + (error.message || "Unknown error"));
        
        // Return false to indicate failed submission
        return false;
    }
}

// Check officer login status and display appropriate messages
function checkOfficerLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isOfficer = localStorage.getItem("isOfficerLoggedIn") === "true";
    const username = localStorage.getItem("username");
    
    console.log("Login status:", { isLoggedIn, isOfficer, username });
    
    // Create a status message container if it doesn't exist
    let statusContainer = document.getElementById("loginStatusContainer");
    if (!statusContainer) {
        statusContainer = document.createElement("div");
        statusContainer.id = "loginStatusContainer";
        
        // Insert after the button row
        const buttonRow = document.querySelector(".button-row");
        if (buttonRow) {
            buttonRow.insertAdjacentElement('afterend', statusContainer);
        } else {
            // If button row doesn't exist, insert before the form
            const form = document.getElementById("firForm");
            if (form) {
                form.parentNode.insertBefore(statusContainer, form);
            }
        }
    }
    
    if (isLoggedIn && isOfficer) {
        // Officer is logged in
        statusContainer.className = "officer";
        statusContainer.innerHTML = `
            <strong>Logged in as Officer:</strong> ${username || "Unknown"}
            <button id="logoutButton">Logout</button>
        `;
        
        // Add logout functionality
        const logoutButton = document.getElementById("logoutButton");
        if (logoutButton) {
            logoutButton.addEventListener("click", function() {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("isOfficerLoggedIn");
                localStorage.removeItem("username");
                localStorage.removeItem("userInfo");
                
                alert("You have been logged out.");
                window.location.reload();
            });
        }
    } else {
        // Not logged in as officer
        statusContainer.className = "not-logged-in";
        statusContainer.innerHTML = `
            <strong>Notice:</strong> You are not logged in as an officer.
            <a href="officer.html" style="margin-left: 10px; color: #007bff; text-decoration: underline;">Login</a>
        `;
    }
}

// Wait for DOM content to be loaded before setting up event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing form");
    
    // Check officer login status
    checkOfficerLoginStatus();
    
    // Auto-generate FIR ID
    const firidField = document.getElementById("FIRID");
    if (firidField) {
        firidField.value = generateFIRID();
        firidField.readOnly = true; // Make the field read-only
        console.log("FIR ID field set to read-only with auto-generated value");
    } else {
        console.error("FIR ID field not found");
    }
    
    // Auto-fill officer details
    autofillOfficerDetails();
    
    // Set up connect wallet button
    const connectWalletButton = document.getElementById("connectWalletButton");
    if (connectWalletButton) {
        connectWalletButton.addEventListener("click", async function() {
            try {
                connectWalletButton.textContent = "Connecting...";
                const success = await initWeb3();
                if (success) {
                    connectWalletButton.textContent = `Connected: ${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
                } else {
                    connectWalletButton.textContent = "Connect Failed";
                    setTimeout(() => {
                        connectWalletButton.textContent = "Connect Wallet";
                    }, 2000);
                }
            } catch (error) {
                console.error("Connection error:", error);
                connectWalletButton.textContent = "Connection Error";
                setTimeout(() => {
                    connectWalletButton.textContent = "Connect Wallet";
                }, 2000);
            }
        });
    } else {
        console.error("Connect wallet button not found");
    }
    
    // Store the original submitFIR function
    const originalSubmitFIR = submitFIR;
    
    // Override the global submitFIR function
    window.submitFIR = async function(event) {
        event.preventDefault();
        console.log("Enhanced submitFIR called");
        
        try {
            // Call the original function with the context and arguments
            const result = await originalSubmitFIR.call(this, event);
            
            if (result) {
                console.log("FIR submission successful, regenerating FIR ID");
                // After successful submission, regenerate the FIR ID for the next submission
                const firidField = document.getElementById("FIRID");
                if (firidField) {
                    firidField.value = generateFIRID();
                    console.log("FIR ID regenerated for next submission:", firidField.value);
                } else {
                    console.error("FIR ID field not found for regeneration");
                }
            } else {
                console.log("FIR submission was not successful, not regenerating FIR ID");
            }
        } catch (error) {
            console.error("Error in enhanced submitFIR:", error);
        }
    };
    
    // Handle FIR form submission
    const firForm = document.getElementById("firForm");
    if (firForm) {
        firForm.addEventListener("submit", window.submitFIR);
        console.log("FIR form submission handler attached");
    } else {
        console.error("FIR form not found");
    }
});
