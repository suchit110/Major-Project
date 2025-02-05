let firContract;
window.addEventListener('load', async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });

        // Check if officer is logged in
        const isOfficerLoggedIn = localStorage.getItem("isOfficerLoggedIn");
        if (isOfficerLoggedIn === "true") {
            document.getElementById("createFIRButton").style.display = "block";
            document.getElementById("loginStatus").innerText = "Logged in as Officer";
        } else {
            document.getElementById("loginStatus").innerText = "Not Logged in";
        }

        const contractAddress = '0x70D5192C4E9bA57DAD26d3ffB9106256717c6F47';
        const abi = [ /* Same ABI as before */ ];
        firContract = new web3.eth.Contract(abi, contractAddress);

        loadMapWithFIRs();
    } else {
        alert("Please install MetaMask.");
    }
});

async function loadMapWithFIRs() {
    // Load and display FIRs with markers
    const totalFIRs = await firContract.methods.getTotalFIRs().call();
    const map = L.map('map').setView([20.5937, 78.9629], 5); // Default India center
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

    for (let i = 0; i < totalFIRs; i++) {
        const fir = await firContract.methods.getFIR(i).call();
        const coordinates = await getCoordinates(fir.incidentLocation);
        if (coordinates) {
            L.marker([coordinates.lat, coordinates.lng]).addTo(map)
                .bindPopup(`<b>FIR ID:</b> ${fir.FIRID}<br><b>Location:</b> ${fir.incidentLocation}`);
        }
    }
}

async function getCoordinates(location) {
    const apiKey = 'YOUR_API_KEY'; // Use a valid API key from a geocoding service like OpenCage or Google Maps
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results && data.results.length > 0 ? data.results[0].geometry : null;
}
