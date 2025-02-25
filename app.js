const API_KEY = 'VSG9L5IX4MEOO1Q8';


let chart;
let currentChartMode = '1D';  


function searchStock() {

    const stockSymbol = document.getElementById('stock-search').value.toUpperCase();
    const timeRange = currentChartMode;  
    let startDate = '';
    let interval = '';
    let monthRange = '';

    if (getStartDateForTimeRange(timeRange) === 'TIME_SERIES_INTRADAY') {

        startDate = 'TIME_SERIES_INTRADAY';
        interval = '&interval=5min';
    }
    else if (getStartDateForTimeRange(timeRange) === 'TIME_SERIES_INTRADAY-') {

        startDate = 'TIME_SERIES_INTRADAY';
        interval = '&interval=60min&outputsize=full';
    }
    else if (getStartDateForTimeRange(timeRange) === 'TIME_SERIES_MONTHLY') {

        const today = new Date();  
        const month = today.getMonth() - 1 === -1 ? 12 : today.getMonth();
        const year = today.getMonth() - 1 === -1 ? today.getFullYear() - 1 : today.getFullYear();
        const monthText = month < 10 ? `0${month}` : month;
        
        startDate = 'TIME_SERIES_MONTHLY';
        monthRange = `&month=${year}-${monthText}`;
    }
    if (stockSymbol) {

        const url = `https://www.alphavantage.co/query?function=${startDate}&symbol=${stockSymbol}${interval}${monthRange}&apikey=${API_KEY}`;

        fetch(url)
        .then(response => response.json())
        .then(data => {

            if (data) {

                const labels = [];
                const prices = [];
                let index = 0;

                for (const fields in data) {

                    if (index < 1) {

                        index++;
                    }
                    else if (index === 1) {

                        for (const field in data[fields]) {

                            labels.push(field);
                            prices.push(data[fields][field]['4. close']);
                        }

                        break;
                    }
                }
                
                chart.data.labels = labels;
                chart.data.datasets[0].data = prices;
                chart.data.datasets[0].label = `Stock Price of ${stockSymbol} (${timeRange})`;
                chart.update();
            }
            else {

                alert(`Error: Stock data not found for ${stockSymbol}.`);
            }
        })
        .catch(error => console.error('Error fetching historical stock data:', error));
    }
    else {

        alert('Error: Please enter a stock symbol.');
    }
}


function getStartDateForTimeRange(timeRange) {

    switch (timeRange) {
        case '1D':
            return 'TIME_SERIES_INTRADAY';  
        case '1M':
            return 'TIME_SERIES_INTRADAY-'; 
        case 'Max':
            return 'TIME_SERIES_MONTHLY';  
        default:
            return 'TIME_SERIES_INTRADAY';  
    }
}


function initializeChart() {

    const ctx = document.getElementById('portfolioGraph').getContext('2d');

    chart = new Chart(ctx, {

        type: 'line',
        data: {

            labels: [],  
            datasets: [{

                label: 'Stock Price',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)'
            }]
        },
        options: {

            responsive: true,
            scales: {

                y: {

                    beginAtZero: false  
                }
            }
        }
    });
}


function updateChart(timeRange) {

    currentChartMode = timeRange; 
    searchStock();
}


window.onload = function () {

    initializeChart();  
};

