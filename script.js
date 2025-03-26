document.addEventListener('DOMContentLoaded', () => {
const ctx = document.getElementById('myChart').getContext('2d');
const categoriesGastos = ['Alquiler', 'Comida', 'Transporte', 'Entretenimiento', 'Otros'];
const datosGastos = [1500, 800, 50, 120, 500];
const categoriesIngresos = ['Salario', 'Freelance', 'Inversiones', 'Otros'];
const datosIngresos = [2500, 1200, 800, 400];

const title = document.getElementById('chart-title');
    const btnGastos = document.getElementById('btnGastos');
    const btnIngresos = document.getElementById('btnIngresos');

    if (!title || !btnGastos || !btnIngresos) {
        console.error("Elementos HTML faltantes, revisa el index.html.");
        return;
    }






Chart.register(ChartDataLabels);

let currentType = 'Gastos';
const myChart = new Chart(ctx, getConfig(currentType));

function getConfig(type) {
    const isGasto = type === 'Gastos';
    return {
    type: 'doughnut',
    data: {
        labels: categoriesGastos,
            datasets: [{
                data: datosGastos,
                backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 2
            }]
        },
                options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: { padding: 10 },
                plugins: {
                legend: { display: false },
                datalabels: {
                color: '#000',
                formatter: (value, ctx) => {
                let label = ctx.chart.data.labels[ctx.dataIndex];
                return `${label}: ${value}`;
        },
                anchor: 'center',
                align: 'center',
                font: { weight: 'bold', size: 10 }
                    }
                }
            }
        };
    }


function actualizarGrafico(tipo) {
    title.textContent = tipo === 'gastos' ? 'Gastos' : 'Ingresos';
    myChart.data.labels = tipo === 'gastos' ? categoriesGastos : categoriesIngresos;
    myChart.data.datasets[0].data = tipo === 'gastos' ? datosGastos : datosIngresos;
    myChart.update();
}

btnGastos.addEventListener('click', () => actualizarGrafico('gastos'));
btnIngresos.addEventListener('click', () => actualizarGrafico('ingresos'));
});