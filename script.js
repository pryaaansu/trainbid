document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.slider')) {
        setupImageSlider();
    }
    if (document.getElementById('auctionContainer')) {
        setupAuctionsPage();
    }
    if (document.getElementById('bidForm')) {
        setupBiddingPage();
    }
});

function setupImageSlider() {
    const slider = document.querySelector('.slider');
    const images = slider.querySelectorAll('img');
    let currentIndex = 0;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }, 5000);
}

function setupAuctionsPage() {
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const fromStation = document.getElementById('fromStation').value;
        const toStation = document.getElementById('toStation').value;
        const journeyDate = document.getElementById('journeyDate').value;
        const travelClass = document.getElementById('travelClass').value;

        // For demo purposes, we'll just display all auctions regardless of the search criteria
        loadAuctions();
    });

    // Load initial auctions
    loadAuctions();
}

function loadAuctions() {
    const auctions = [
        { id: 1, from: 'Mumbai (BOM)', to: 'Delhi (DEL)', date: '2024-07-01', class: 'Second AC', currentBid: 2500, timeRemaining: '01:30:00' },
        { id: 2, from: 'Bangalore (BLR)', to: 'Chennai (MAA)', date: '2024-07-03', class: 'Third AC', currentBid: 1800, timeRemaining: '00:45:00' },
        { id: 3, from: 'Kolkata (CCU)', to: 'Mumbai (BOM)', date: '2024-07-05', class: 'Sleeper', currentBid: 1200, timeRemaining: '02:15:00' }
    ];

    const container = document.getElementById('auctionContainer');
    container.innerHTML = ''; // Clear existing auctions

    auctions.forEach(auction => {
        const auctionElement = createAuctionElement(auction);
        container.appendChild(auctionElement);
    });
}

function createAuctionElement(auction) {
    const element = document.createElement('div');
    element.className = 'auction-item';
    element.innerHTML = `
        <h3>${auction.from} to ${auction.to}</h3>
        <p>Date: ${auction.date}</p>
        <p>Class: ${auction.class}</p>
        <p>Current Bid: ₹<span id="bid-${auction.id}">${auction.currentBid}</span></p>
        <p>Time Remaining: <span class="countdown">${auction.timeRemaining}</span></p>
        <a href="bidding.html?id=${auction.id}" class="btn">Place Bid</a>
    `;
    return element;
}

function setupBiddingPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const auctionId = urlParams.get('id');
    
    // Fetch auction details (simulated)
    const auction = getAuctionDetails(auctionId);
    
    // Display auction details
    const detailsElement = document.getElementById('auctionDetails');
    detailsElement.innerHTML = `
        <h3>${auction.from} to ${auction.to}</h3>
        <p>Date: ${auction.date}</p>
        <p>Class: ${auction.class}</p>
        <p>Current Bid: ₹<span id="currentBid">${auction.currentBid}</span></p>
        <p>Time Remaining: <span class="countdown">${auction.timeRemaining}</span></p>
    `;

    // Setup bid form
    const bidForm = document.getElementById('bidForm');
    bidForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const bidAmount = document.getElementById('bidAmount').value;
        placeBid(auctionId, bidAmount);
    });

    // Start fake bidding
    startFakeBidding(auctionId);
}

function getAuctionDetails(id) {
    // Simulated function to get auction details
    const auctions = {
        1: { id: 1, from: 'Mumbai (BOM)', to: 'Delhi (DEL)', date: '2024-07-01', class: 'Second AC', currentBid: 2500, timeRemaining: '01:30:00' },
        2: { id: 2, from: 'Bangalore (BLR)', to: 'Chennai (MAA)', date: '2024-07-03', class: 'Third AC', currentBid: 1800, timeRemaining: '00:45:00' },
        3: { id: 3, from: 'Kolkata (CCU)', to: 'Mumbai (BOM)', date: '2024-07-05', class: 'Sleeper', currentBid: 1200, timeRemaining: '02:15:00' }
    };
    return auctions[id];
}

let canBid = true;

function placeBid(auctionId, amount) {
    if (!canBid) {
        showNotification("Please wait before placing another bid.");
        return;
    }

    const currentBidElement = document.getElementById('currentBid');
    const currentBid = parseInt(currentBidElement.textContent);
    
    if (amount > currentBid) {
        currentBidElement.textContent = amount;
        addBidToHistory('You', amount);
        showNotification("Your bid has been placed successfully!");
        
        canBid = false;
        setTimeout(() => {
            canBid = true;
        }, 10000); // 10-second cooldown
    } else {
        showNotification("Your bid must be higher than the current bid.");
    }
}

function addBidToHistory(bidder, amount) {
    const historyList = document.getElementById('bidHistory');
    const listItem = document.createElement('li');
    listItem.textContent = `${bid
