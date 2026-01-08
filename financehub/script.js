const API_KEY = "YOUR_API_KEY_HERE";
document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".sub h3");
    const content = document.getElementById("content");
    loadStock("RELIANCE.BSE", "rPrice", "rChange");
    loadStock("TCS.BSE", "tPrice", "tChange");
    loadStock("INFY.BSE", "iPrice", "iChange");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            const menu = item.innerText;

            switch (menu) {
                case "Markets":
                    content.innerHTML = `
                        <h2>Market Overview</h2>
                        <p><b>NIFTY 50:</b> 22,480 ▲ 0.65%</p>
                        <p><b>SENSEX:</b> 74,320 ▼ 0.22%</p>
                        <p>Asian markets are trading mixed today.</p>
                        <a href="https://www.moneycontrol.com/markets/" target="_blank">More Details</a>
                    `;
                    break;

                case "News":
                    content.innerHTML = `
                        <h2>Latest Financial News</h2>
                        <ul style="text-align:left; display:inline-block;">
                            <li>RBI keeps repo rate unchanged</li>
                            <li>IT stocks gain on global cues</li>
                            <li>Oil prices rise amid supply concerns</li>
                        </ul>
                        <a href="https://www.moneycontrol.com/news/" target="_blank">Read More</a>
                    `;
                    break;

                case "Portfolio":
                    content.innerHTML = `
                        <h2>Your Portfolio</h2>
                        <p>Total Investment: ₹2,50,000</p>
                        <p>Current Value: ₹2,68,500</p>
                        <p style="color:lime;">Overall Gain: +7.4%</p>
                        <a href="https://www.moneycontrol.com/portfolio/" target="_blank">View Details</a>
                    `;
                    break;

                case "Watchlist":
                    content.innerHTML = `
                        <h2>Watchlist</h2>
                        <p>• RELIANCE</p>
                        <p>• TCS</p>
                        <p>• INFY</p>
                        <p>• HDFC BANK</p>
                        <a href="https://www.moneycontrol.com/stocks/marketinfo/marketwatch/" target="_blank">Manage Watchlist</a>
                    `;
                    break;
                case "Tools":
                    content.innerHTML = `
        <h2>Financial Tools</h2>

        <!-- SIP Calculator -->
        <h3>SIP Calculator</h3>
        <input type="number" id="sipAmount" placeholder="Monthly Investment (₹)">
        <input type="number" id="sipRate" placeholder="Annual Return (%)">
        <input type="number" id="sipYears" placeholder="Years">
        <br><br>
        <button onclick="calculateSIP()">Calculate SIP</button>
        <p id="sipResult"></p>
        <target="_blank" href="https://www.moneycontrol.com/sip-calculator/">More SIP Tools</a>

        <hr>

        <!-- EMI Calculator -->
        <h3>EMI Calculator</h3>
        <input type="number" id="loanAmount" placeholder="Loan Amount (₹)">
        <input type="number" id="loanRate" placeholder="Interest Rate (%)">
        <input type="number" id="loanYears" placeholder="Loan Duration (Years)">
        <br><br>
        <button onclick="calculateEMI()">Calculate EMI</button>
        <p id="emiResult"></p>
        <target="_blank" href="https://www.moneycontrol.com/emi-calculator/">More EMI Tools</a>

        <hr>

        <!-- Profit/Loss -->
        <h3>Profit / Loss Calculator</h3>
        <input type="number" id="buyPrice" placeholder="Buy Price (₹)">
        <input type="number" id="sellPrice" placeholder="Sell Price (₹)">
        <br><br>
        <button onclick="calculatePL()">Calculate</button>
        <p id="plResult"></p>
        <target="_blank" href="https://www.moneycontrol.com/profit-loss-calculator/">More P/L Tools</a>
    `;
                    break;

                case "Help":
                    content.innerHTML = `
                        <h2>Help & Support</h2>
                        <p>Email: support@financehub.com</p>
                        <p>Phone: +91 98765 43210</p>
                    `;
                    break;

                case "Settings":
                    content.innerHTML = `
                        <h2>Settings</h2>
                        <p>Theme: Dark Mode</p>
                        <p>Notifications: Enabled</p>
                        <p>Account Type: Free</p>
                    `;
                    break;
            }
        });
    });
});
function loadStock(symbol, priceId, changeId) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const quote = data["Global Quote"];
            if (!quote) return;

            const price = parseFloat(quote["05. price"]).toFixed(2);
            const changePercent = quote["10. change percent"];
            const changeValue = parseFloat(changePercent);

            document.getElementById(priceId).innerText = price;

            // Arrow + color
            const arrow = changeValue >= 0 ? "▲" : "▼";
            const changeElement = document.getElementById(changeId);

            changeElement.innerHTML = `${arrow} ${changePercent}`;
            changeElement.style.color = changeValue >= 0 ? "lime" : "red";
        })
        .catch(err => console.error("API Error:", err));
}
// SIP Calculator
function calculateSIP() {
    let P = Number(document.getElementById("sipAmount").value);
    let r = Number(document.getElementById("sipRate").value) / 12 / 100;
    let n = Number(document.getElementById("sipYears").value) * 12;

    let futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    document.getElementById("sipResult").innerText =
        `Future Value: ₹${futureValue.toFixed(0)}`;
}

// EMI Calculator
function calculateEMI() {
    let P = Number(document.getElementById("loanAmount").value);
    let r = Number(document.getElementById("loanRate").value) / 12 / 100;
    let n = Number(document.getElementById("loanYears").value) * 12;

    let emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    document.getElementById("emiResult").innerText =
        `Monthly EMI: ₹${emi.toFixed(0)}`;
}

// Profit / Loss Calculator
function calculatePL() {
    let buy = Number(document.getElementById("buyPrice").value);
    let sell = Number(document.getElementById("sellPrice").value);
    let result = sell - buy;

    let resultText = result >= 0
        ? `Profit: ₹${result}`
        : `Loss: ₹${Math.abs(result)}`;

    document.getElementById("plResult").innerText = resultText;
    document.getElementById("plResult").style.color =
        result >= 0 ? "lime" : "red";
}


