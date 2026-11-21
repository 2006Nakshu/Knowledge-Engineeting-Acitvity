function analyzeWeather() {

    // Read sensor information
    const temp = Number(document.getElementById("temperature").value);
    const rain = Number(document.getElementById("rainfall").value);
    const moisture = Number(document.getElementById("moisture").value);
    const humidity = Number(document.getElementById("humidity").value);

    const tempAcc = Number(document.getElementById("tempAccuracy").value);
    const rainAcc = Number(document.getElementById("rainAccuracy").value);
    const soilAcc = Number(document.getElementById("soilAccuracy").value);

    // Validate inputs
    if (
        !Number.isFinite(temp) || temp < 0 || temp > 60 ||
        !Number.isFinite(rain) || rain < 0 || rain > 500 ||
        !Number.isFinite(moisture) || moisture < 0 || moisture > 100 ||
        !Number.isFinite(humidity) || humidity < 0 || humidity > 100 ||
        ![tempAcc, rainAcc, soilAcc].every(
            value => Number.isFinite(value) && value >= 1 && value <= 100
        )
    ) {
        alert("Please enter valid sensor values.");
        return;
    }

    // Knowledge Base
    const knowledge = {
        temperature: temp,
        rainfall: rain,
        soilMoisture: moisture,
        humidity: humidity,
        sensorAccuracy: {
            temperature: tempAcc,
            rainfall: rainAcc,
            soil: soilAcc
        }
    };

    document.getElementById("knowledge").innerHTML = `
        Temperature: ${temp} °C<br>
        Rainfall: ${rain} mm<br>
        Soil Moisture: ${moisture}%<br>
        Humidity: ${humidity}%<br>
        Temperature Sensor Reliability: ${tempAcc}%<br>
        Rainfall Sensor Reliability: ${rainAcc}%<br>
        Soil Sensor Reliability: ${soilAcc}%
    `;

    // Uncertainty Handling
    const confidence =
        (tempAcc + rainAcc + soilAcc) / 3;

    let uncertaintyLevel;

    if (confidence >= 85) {
        uncertaintyLevel = "Low Uncertainty";
    } else if (confidence >= 70) {
        uncertaintyLevel = "Medium Uncertainty";
    } else {
        uncertaintyLevel = "High Uncertainty";
    }

    document.getElementById("uncertainty").innerHTML = `
        Overall Confidence: ${confidence.toFixed(2)}%<br>
        Uncertainty Level: ${uncertaintyLevel}<br>
        Temperature Sensor: ${tempAcc}% reliable<br>
        Rainfall Sensor: ${rainAcc}% reliable<br>
        Soil Sensor: ${soilAcc}% reliable
    `;

    // Rule-Based Inference Engine
    let recommendations = [];
    let decisions = [];

    if (confidence < 70) {
        recommendations.push(
            "Verify sensor readings before taking major agricultural decisions."
        );
        decisions.push(
            "High uncertainty detected. Recheck the sensors."
        );
    } else {

        if (moisture < 30 && rain < 10) {
            recommendations.push("Irrigation is recommended.");
            decisions.push("Soil moisture is low and rainfall is insufficient.");
        }

        if (moisture >= 30 && moisture <= 70) {
            recommendations.push("Soil moisture is within the selected normal range.");
        }

        if (moisture > 70) {
            recommendations.push("Avoid additional irrigation.");
            decisions.push("Soil contains sufficient moisture.");
        }

        if (rain >= 50) {
            recommendations.push("Monitor excess rainfall and drainage.");
        }

        if (temp > 35) {
            recommendations.push("Monitor crops for heat stress.");
        }

        if (humidity > 80) {
            recommendations.push("Monitor crops for possible fungal diseases.");
        }

        if (recommendations.length === 0) {
            recommendations.push("Continue regular crop monitoring.");
        }
    }

    // Display Recommendation
    document.getElementById("recommendation").innerHTML =
        recommendations.map(item => "🌱 " + item).join("<br>");

    // Final Decision
    document.getElementById("systemStatus").innerText =
        uncertaintyLevel;

    document.getElementById("tempValue").innerText = temp + "°C";
    document.getElementById("rainValue").innerText = rain + " mm";
    document.getElementById("moistureValue").innerText = moisture + "%";

    document.getElementById("result").innerHTML = `
        <strong>Analysis Completed</strong><br>
        Confidence: ${confidence.toFixed(2)}%<br>
        Knowledge Status: ${uncertaintyLevel}<br>
        <strong>Decision:</strong><br>
        ${decisions.length
            ? decisions.join("<br>")
            : "Recommendations generated using available sensor knowledge."}
    `;
}

// Reset System
function resetSystem() {

    document.getElementById("temperature").value = 30;
    document.getElementById("rainfall").value = 20;
    document.getElementById("moisture").value = 40;
    document.getElementById("humidity").value = 60;

    document.getElementById("tempAccuracy").value = 90;
    document.getElementById("rainAccuracy").value = 80;
    document.getElementById("soilAccuracy").value = 85;

    document.getElementById("tempValue").innerText = "30°C";
    document.getElementById("rainValue").innerText = "20 mm";
    document.getElementById("moistureValue").innerText = "40%";

    document.getElementById("systemStatus").innerText = "Waiting";

    document.getElementById("knowledge").innerText =
        "Weather sensor information will appear here.";

    document.getElementById("uncertainty").innerText =
        "Waiting for sensor analysis...";

    document.getElementById("recommendation").innerText =
        "Waiting for analysis...";

    document.getElementById("result").innerText =
        "No decision has been made.";
}