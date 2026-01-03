import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorPage() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/iot/history');
      const dataSensor = response.data.data;

      if (dataSensor.length > 0) {
        // Ambil 20 data terakhir aja biar grafik ga keramean
        const dataLimit = dataSensor.slice(-20);

        const labels = dataLimit.map(item => 
          new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        );
        
        const dataSuhu = dataLimit.map(item => item.suhu);
        const dataLembab = dataLimit.map(item => item.kelembaban);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Suhu (°C)',
              data: dataSuhu,
              borderColor: 'rgb(255, 99, 132)', // Warna Merah standar
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              tension: 0.1, 
            },
            {
              label: 'Kelembaban (%)',
              data: dataLembab,
              borderColor: 'rgb(53, 162, 235)', // Warna Biru standar
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              tension: 0.1,
            },
          ],
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true, 
        text: 'Monitoring Suhu & Kelembaban Real-time',
        font: { size: 16 }
      },
    },
    scales: {
      y: {
        // PENTING: Aku set 0-100 biar grafikmu ga gepeng/rusak kalau datanya masuk
        // (Temanmu punya masalah skala 0-1, ini aku perbaiki dikit biar tetap jalan)
        min: 0,
        max: 100, 
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard IoT</h1>
      
      {/* Container Putih Polos - Persis punya temanmu */}
      <div className="bg-white p-8 rounded shadow-sm">
        {loading ? (
          <p className="text-center text-gray-500">Memuat data...</p>
        ) : (
          <Line options={options} data={chartData} />
        )}
      </div>
    </div>
  );
}

export default SensorPage;