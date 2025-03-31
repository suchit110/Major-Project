let firContract;
let map;
let web3;

// Create red dot icon globally
const redDotIcon = L.divIcon({
    className: 'red-dot-icon',
    html: '<div></div>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -7]
});

// Initialize Web3
async function initWeb3() {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            await ethereum.request({ method: 'eth_requestAccounts' });
            
            const contractAddress = '0x7226072e9Fe77620E4765e3c9F8B7B6520340223';
            const firContract = new web3.eth.Contract(abi, contractAddress);
            window.firContract = firContract; // Make it globally available
            return true;
        } catch (error) {
            console.error("Error initializing Web3:", error);
            return false;
        }
    }
    return false;
}

// Initialize map
async function initMap() {
    try {
        console.log("Initializing map...");
        // Initialize the map globally
        map = L.map('map').setView([20.5937, 78.9629], 5); // Default India center
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        console.log("Map initialized successfully");
        return true;
    } catch (error) {
        console.error("Error initializing map:", error);
        return false;
    }
}

// Contract ABI
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

// Initialize everything when the page loads
window.addEventListener('load', async () => {
    try {
        // Initialize map first
        const mapInitialized = await initMap();
        if (!mapInitialized) {
            console.error("Failed to initialize map");
            return;
        }

        // Initialize Web3
        await initWeb3();

        // Load FIRs onto the map
        await loadMapWithFIRs();

        // Update UI based on login status
        updateUIBasedOnLoginStatus();

    } catch (error) {
        console.error("Error during initialization:", error);
    }
});

async function loadMapWithFIRs() {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const locationParam = urlParams.get('location');
    const firIdParam = urlParams.get('firId');
    const isLocal = urlParams.get('local');
    
    console.log("URL Parameters:", { locationParam, firIdParam, isLocal });
    
    let highlightedLocation = null;
    let highlightedMarker = null;
    
    // If we have a location parameter, try to geocode and show it first
    if (locationParam) {
        try {
            console.log("Processing location parameter:", locationParam);
            const coordinates = await getCoordinates(locationParam);
            if (coordinates) {
                console.log("Found coordinates for location parameter:", coordinates);
                highlightedLocation = coordinates;
                highlightedMarker = L.marker([coordinates.lat, coordinates.lng], {
                    icon: redDotIcon
                }).addTo(map);
                
                // Create popup content
                const popupContent = firIdParam ? 
                    `<div style="text-align:center;"><h3>FIR #${firIdParam}</h3></div>
                     <b>Location:</b> ${locationParam}<br>` :
                    `<div style="text-align:center;"><h3>New FIR Location</h3></div>
                     <b>Location:</b> ${locationParam}<br>`;
                
                highlightedMarker.bindPopup(popupContent);
                
                // Zoom to the location
                map.setView([coordinates.lat, coordinates.lng], 12);
                highlightedMarker.openPopup();
            } else {
                console.error("Could not geocode location:", locationParam);
            }
        } catch (error) {
            console.error("Error processing location parameter:", error);
        }
    }
    
    // First, load FIRs from blockchain
    try {
        if (web3 && firContract) {
            const totalFIRs = await firContract.methods.getTotalFIRs().call();
            
            for (let i = 0; i < totalFIRs; i++) {
                const fir = await firContract.methods.getFIR(i).call();
                const coordinates = await getCoordinates(fir.incidentLocation);
                if (coordinates) {
                    const marker = L.marker([coordinates.lat, coordinates.lng], {
                        icon: redDotIcon
                    }).addTo(map).bindPopup(`
                        <div style="text-align:center;"><h3>FIR #${fir.FIRID}</h3></div>
                        <b>Location:</b> ${fir.incidentLocation}<br>
                        <b>Police Station:</b> ${fir.policeStation}<br>
                        <button onclick="window.location.href='index.html?view=${fir.FIRID}'" style="margin-top:10px;width:100%;padding:5px;background:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;">View Details</button>
                    `);
                    
                    if (firIdParam && fir.FIRID === firIdParam) {
                        highlightedLocation = coordinates;
                        highlightedMarker = marker;
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error loading blockchain FIRs:", error);
    }
    
    // Load FIRs from localStorage
    try {
        const localFIRs = JSON.parse(localStorage.getItem('localFIRs') || '[]');
        for (const fir of localFIRs) {
            const coordinates = await getCoordinates(fir.incidentLocation);
            if (coordinates) {
                const marker = L.marker([coordinates.lat, coordinates.lng], {
                    icon: redDotIcon
                }).addTo(map).bindPopup(`
                    <div style="text-align:center;"><h3>FIR #${fir.FIRID}</h3></div>
                    <b>Location:</b> ${fir.incidentLocation}<br>
                    <b>Police Station:</b> ${fir.policeStation}<br>
                    <i>(Stored locally)</i><br>
                    <button onclick="window.location.href='index.html?view=${fir.FIRID}'" style="margin-top:10px;width:100%;padding:5px;background:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;">View Details</button>
                `);
                
                // If this is the FIR we just submitted locally, highlight it
                if (isLocal === 'true' && firIdParam && fir.FIRID === firIdParam) {
                    highlightedLocation = coordinates;
                    highlightedMarker = marker;
                }
            }
        }
    } catch (error) {
        console.error("Error loading local FIRs:", error);
    }
    
    // If we have a highlighted location, zoom to it
    if (highlightedLocation) {
        map.setView([highlightedLocation.lat, highlightedLocation.lng], 12);
        if (highlightedMarker) {
            highlightedMarker.openPopup();
        }
    }
}

async function getCoordinates(location) {
    try {
        console.log("Geocoding location:", location);
        const apiKey = '32596d57fca24156ba101b641438eed4';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;
        
        console.log("Fetching coordinates from:", url);
        const response = await fetch(url);
        const data = await response.json();
        
        console.log("Geocoding response:", data);
        
        if (data.results && data.results.length > 0) {
            console.log("Found coordinates:", data.results[0].geometry);
            return data.results[0].geometry;
        } else {
            console.error("No coordinates found for location:", location);
            return null;
        }
    } catch (error) {
        console.error("Error in getCoordinates:", error);
        return null;
    }
}

// Make searchFIR function available globally
window.searchFIR = async function() {
    const query = document.getElementById("searchQuery").value.toLowerCase();
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "<p>Searching...</p>";
    
    let allFIRs = [];
    
    // Get FIRs from localStorage
    try {
        const localFIRs = JSON.parse(localStorage.getItem("localFIRs") || "[]");
        allFIRs = [...localFIRs];
    } catch (error) {
        console.error("Error loading local FIRs:", error);
    }
    
    // Get FIRs from blockchain if available
    if (web3 && firContract) {
        try {
            const totalFIRs = await firContract.methods.getTotalFIRs().call();
            for (let i = 0; i < totalFIRs; i++) {
                const fir = await firContract.methods.getFIR(i).call();
                allFIRs.push(fir);
            }
        } catch (error) {
            console.error("Error loading blockchain FIRs:", error);
        }
    }
    
    // Filter FIRs based on search query
    const results = allFIRs.filter(fir => {
        const searchableFields = [
            fir.FIRID,
            fir.policeStation,
            fir.criminalDetails,
            fir.incidentLocation,
            fir.victimDetails,
            fir.officerDetails
        ];
        
        return searchableFields.some(field => 
            field && field.toLowerCase().includes(query)
        );
    });
    
    // Display results
    if (results.length === 0) {
        resultsContainer.innerHTML = "<p>No FIRs found matching your search.</p>";
        return;
    }
    
    let resultsHTML = `<h3>Found ${results.length} Results</h3>`;
    
    results.forEach(fir => {
        resultsHTML += `
            <div style="background:#f9f9f9; padding:15px; margin:10px 0; border-radius:5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h4 style="color: #333; margin-top: 0;">FIR #${fir.FIRID}</h4>
                <p><strong>Police Station:</strong> ${fir.policeStation || 'N/A'}</p>
                <p><strong>Criminal Details:</strong> ${fir.criminalDetails || 'N/A'}</p>
                <p><strong>Incident Location:</strong> ${fir.incidentLocation || 'N/A'}</p>
                <p><strong>Victim Details:</strong> ${fir.victimDetails || 'N/A'}</p>
                <p><strong>Officer Details:</strong> ${fir.officerDetails || 'N/A'}</p>
                <button onclick="showOnMap('${fir.incidentLocation}')" 
                        style="background: #4CAF50; color: white; border: none; padding: 8px 15px; 
                               border-radius: 4px; cursor: pointer; margin-top: 10px;">
                    Show on Map
                </button>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = resultsHTML;
};

// Make showOnMap function available globally
window.showOnMap = async function(location) {
    closeSearchFIRModal();
    const coordinates = await getCoordinates(location);
    if (coordinates) {
        map.setView([coordinates.lat, coordinates.lng], 12);
        const marker = L.marker([coordinates.lat, coordinates.lng], {
            icon: redDotIcon
        }).addTo(map)
        .bindPopup(`<b>Location:</b> ${location}`)
        .openPopup();
    }
};
