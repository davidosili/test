// Use the proxy for CORS issue workaround
const proxyUrl = 'https://api.allorigins.win/get?url=';
const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,bitcoin-cash,cardano,polkadot,chainlink,stellar&vs_currencies=usd&include_24hr_change=true';

// Function to fetch and update prices
async function getCryptoPrices() {
    try {
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        const data = await response.json();
        const jsonData = JSON.parse(data.contents);

        if (jsonData) {
            updateCryptoData('btc', jsonData.bitcoin);
            updateCryptoData('eth', jsonData.ethereum);
            updateCryptoData('ltc', jsonData.litecoin);
            updateCryptoData('bch', jsonData['bitcoin-cash']);
            updateCryptoData('ada', jsonData.cardano);
            updateCryptoData('dot', jsonData.polkadot);
            updateCryptoData('link', jsonData.chainlink);
            updateCryptoData('xlm', jsonData.stellar);
        } else {
            console.error('Error: API returned empty or malformed data');
        }
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        document.querySelector('.crypto-cards-container').innerHTML = '<p>error</p>';
    }
}

// Function to update price data for originals and clones
function updateCryptoData(id, data) {
    if (!data || !data.usd || data.usd_24h_change === undefined) {
        console.error(`Missing data for ${id}`);
        return;
    }

    const price = data.usd;
    const changePercent = data.usd_24h_change;
    const changeUSD = (price * (changePercent / 100)).toFixed(2);

    const priceElements = document.querySelectorAll(`#${id}-price`);
    const changePercentElements = document.querySelectorAll(`#${id}-change-percent`);
    const changeUSDElements = document.querySelectorAll(`#${id}-dollars`);

    priceElements.forEach((element) => (element.textContent = `$${price.toFixed(2)}`));
    changePercentElements.forEach((element) => {
        element.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
        element.style.color = changePercent >= 0 ? 'green' : 'red';
    });
    changeUSDElements.forEach((element) => {
        element.textContent = `${changePercent >= 0 ? '+' : ''}${changeUSD} USD`;
        element.style.color = changePercent >= 0 ? 'green' : 'red';
    });
}

// Initialize infinite scrolling
function initInfiniteScroll() {
    const container = document.querySelector('.crypto-cards-container');

    // Clone the original container
    const clone = container.cloneNode(true);

    // Add a class to the clone for easier debugging or styling, if needed
    clone.classList.add('clone');

    // Append the cloned container after the original
    container.parentElement.appendChild(clone);

    // Position both containers using flexbox for better layout control
    container.parentElement.style.display = 'flex';
    container.parentElement.style.position = 'relative';
    container.parentElement.style.overflow = 'hidden'; // Hide overflow content
    

    // Add margins between the original and clone to prevent overlap
    container.style.marginRight = '-10px';  // Add margin to the original container
    clone.style.marginLeft = '10px';      // Add margin to the clone container

    let scrollAmount = 0;
    const speed = 1; // Adjust for scroll speed

    function animateScroll() {
        scrollAmount -= speed;

        // Translate both containers horizontally
        const totalWidth = container.offsetWidth + 0; // Account for the margin added
        container.style.transform = `translateX(${scrollAmount}px)`;
        clone.style.transform = `translateX(${scrollAmount + totalWidth}px)`;

        // Reset scroll position to create a seamless loop
        if (scrollAmount <= -totalWidth) {
            scrollAmount = 0; // Reset scroll position
        }

        requestAnimationFrame(animateScroll); // Continue animation
    }

    animateScroll();
}

// Initialize the script when the page loads
window.onload = () => {
    getCryptoPrices();
    initInfiniteScroll();
    setInterval(getCryptoPrices, 50000); // Refresh prices every 50 seconds
};

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const stickyOffset = navbar.offsetTop; // Get initial position of the navbar

    window.addEventListener("scroll", () => {
        if (window.pageYOffset >= stickyOffset) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    });
});
