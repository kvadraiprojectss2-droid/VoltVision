let lastCarbonValue = null;

function showFeature(feature) {
    const content = document.getElementById('featureContent');

    if(feature === 'labelChecker') {
        content.innerHTML = `
            <h2>Energy Label Checker</h2>
            <p>Enter appliance usage (hours per day):</p>
            <table>
                <tr><td>Fan:</td><td><input type="number" id="fan" value="8"></td></tr>
                <tr><td>Lights:</td><td><input type="number" id="lights" value="6"></td></tr>
                <tr><td>TV:</td><td><input type="number" id="tv" value="3"></td></tr>
            </table>
            <button onclick="getAIPrediction()">Get AI Prediction</button>
            <div id="aiResult"></div>
        `;
    }

    else if(feature === 'carbonDashboard') {
        content.innerHTML = `
            <h2>Carbon Footprint Dashboard</h2>
            <p>Enter your daily usage (hours):</p>
            <table>
                <tr><th>Device</th><th>Hours</th></tr>
                <tr><td>Fan</td><td><input type="number" id="fan" value="8"></td></tr>
                <tr><td>AC</td><td><input type="number" id="ac" value="4"></td></tr>
                <tr><td>Lights</td><td><input type="number" id="lights" value="6"></td></tr>
                <tr><td>TV</td><td><input type="number" id="tv" value="3"></td></tr>
                <tr><td>Refrigerator</td><td><input type="number" id="fridge" value="24"></td></tr>
                <tr><td>Computer/Laptop</td><td><input type="number" id="computer" value="6"></td></tr>
                <tr><td>Washing Machine</td><td><input type="number" id="washing" value="1"></td></tr>
            </table>
            <button onclick="calculateDashboard()">Calculate</button>
            <div id="result"></div>
            <div id="aiResult"></div>
        `;
    }

    else if(feature === 'energyPlan') {
        content.innerHTML = `
            <h2>Energy-saving Plan</h2>
            <p>💡 Replace CFL/Incandescent with LED bulbs to save 50% energy.</p>
            <p>🕒 Turn off fans & lights when leaving the room.</p>
            <p>🖥️ Set computers to sleep mode instead of leaving ON.</p>
            <p>🧺 Run washing machine with full load to save electricity & water.</p>
        `;
    }

    else if(feature === 'energyTrends') {
        content.innerHTML = `
            <h2>Energy Market Trends</h2>
            <p>📈 Next 6-hour energy forecast:</p>
            <canvas id="trendChart" width="400" height="200"></canvas>
            <button onclick="fetchTrends()">Refresh Trends</button>
        `;
    }
}

// ===== Real AI Prediction Function =====
function getAIPrediction() {
    const fan = parseFloat(document.getElementById('fan').value) || 0;
    const lights = parseFloat(document.getElementById('lights').value) || 0;
    const tv = parseFloat(document.getElementById('tv').value) || 0;

    fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fan: fan, lights: lights, tv: tv })
    })
    .then(response => response.json())
    .then(data => {
        if(data.ai_message){
            document.getElementById('aiResult').innerHTML = `<h3>AI Analysis</h3><p>${data.ai_message}</p>`;
        } else {
            document.getElementById('aiResult').innerHTML = `<p>❌ Prediction failed</p>`;
        }
    })
    .catch(err => {
        document.getElementById('aiResult').innerHTML = `<p>❌ Error: ${err}</p>`;
    });
}

// ===== Carbon Dashboard Function =====
function calculateDashboard() {
    const fan = parseFloat(document.getElementById('fan').value) || 0;
    const ac = parseFloat(document.getElementById('ac').value) || 0;
    const lights = parseFloat(document.getElementById('lights').value) || 0;
    const tv = parseFloat(document.getElementById('tv').value) || 0;
    const fridge = parseFloat(document.getElementById('fridge').value) || 0;
    const computer = parseFloat(document.getElementById('computer').value) || 0;
    const washing = parseFloat(document.getElementById('washing').value) || 0;

    let factors = { fan:0.05, ac:1.2, lights:0.06, tv:0.08, fridge:0.12, computer:0.1, washing:0.2 };
    let emissions = {
        "Fan": fan * factors.fan,
        "AC": ac * factors.ac,
        "Lights": lights * factors.lights,
        "TV": tv * factors.tv,
        "Refrigerator": fridge * factors.fridge,
        "Computer": computer * factors.computer,
        "Washing Machine": washing * factors.washing
    };

    let totalCarbon = Object.values(emissions).reduce((a,b) => a + b, 0);

    let breakdownHTML = `<strong>Your daily carbon footprint is ${totalCarbon.toFixed(2)} kg CO₂.</strong><br><br>`;
    breakdownHTML += `<table><tr><th>Device</th><th>CO₂ (kg)</th></tr>`;
    for (let device in emissions) {
        breakdownHTML += `<tr><td>${device}</td><td>${emissions[device].toFixed(2)}</td></tr>`;
    }
    breakdownHTML += `</table><canvas id="chartCanvas" width="300" height="200"></canvas>`;
    document.getElementById('result').innerHTML = breakdownHTML;
    drawChart(emissions);

    // Use AI for weekly prediction based on fan, lights, tv usage
    fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fan: fan, lights: lights, tv: tv })
    })
    .then(res => res.json())
    .then(data => {
        if(data.ai_message){
            document.getElementById('aiResult').innerHTML = `<h3>AI Weekly Prediction</h3><p>${data.ai_message}</p>`;
        }
    });
}

// ===== Chart Function =====
function drawChart(emissions) {
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(emissions),
            datasets: [{
                label: 'CO₂ (kg)',
                data: Object.values(emissions),
                backgroundColor: '#4CAF50'
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
}

// ===== Energy Trends =====
function fetchTrends() {
    fetch('/energy_trends')
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('trendChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.hours,
                    datasets: [{
                        label: 'Predicted Grid Load (MW)',
                        data: data.load,
                        borderColor: '#4CAF50',
                        fill: false
                    }]
                },
                options: { responsive: true, scales: { y: { beginAtZero: true } } }
            });
        });
}
