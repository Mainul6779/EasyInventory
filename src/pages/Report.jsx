"use client";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const Report = () => {
      const { user } = useContext(AuthContext);
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [runningAverageSale, setRunningAverageSale] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [dailyReport, setDailyReport] = useState([]);

  useEffect(() => {
    // Fetch sales data from API
    fetch( `https://easyinventorys.vercel.app/sales?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setSalesData(data);
        setFilteredData(data);
        calculateReport(data);
      })
      .catch((err) => console.error("Error fetching sales data:", err));
  }, [user?.email]);

  useEffect(() => {
    if (month && year) {
      const filtered = salesData.filter((data) => {
        const saleDate = new Date(data.soldAt);
        return (
          saleDate.getMonth() + 1 === parseInt(month) &&
          saleDate.getFullYear() === parseInt(year)
        );
      });

      setFilteredData(filtered);
      calculateReport(filtered);
    } else {
      setFilteredData(salesData);
      calculateReport(salesData);
    }
  }, [month, year, salesData]);

  // const calculateReport = (data) => {
  //   const uniqueDates = [
  //     ...new Set(data.map((item) => new Date(item.soldAt).toDateString())),
  //   ];

  //   const totalSales = data.reduce(
  //     (sum, item) => sum + item.soldPrice,
  //     0
  //   );

  //   const totalProfit = data.reduce(
  //     (sum, item) => sum + (item.soldPrice - (item.rateWithTax * item.quantitySold)),
  //     0
  //   );

  //   const dailySales = uniqueDates.map((date) => {
  //     const dailyData = data.filter(
  //       (item) => new Date(item.soldAt).toDateString() === date
  //     );

  //     const sales = dailyData.reduce(
  //       (sum, item) => sum + item.soldPrice,
  //       0
  //     );

  //     const profit = dailyData.reduce(
  //       (sum, item) =>
  //         sum + (item.soldPrice - (item.rateWithTax * item.quantitySold)),
  //       0
  //     );

  //     return { date, sales, profit };
  //   });

  //   setRunningAverageSale(
  //     uniqueDates.length > 0 ? (totalSales / uniqueDates.length).toFixed(2) : 0
  //   );
  //   setMonthlySales(totalSales.toFixed(2));
  //   setMonthlyProfit(totalProfit.toFixed(2));
  //   setDailyReport(dailySales);
  // };

  const calculateReport = (data) => {
    if (!data || data.length === 0) {
      setRunningAverageSale(0);
      setMonthlySales(0);
      setMonthlyProfit(0);
      setDailyReport([]);
      return;
    }
  
    const uniqueDates = [
      ...new Set(data.map((item) => new Date(item.soldAt).toDateString())),
    ];
  
    const totalSales = data.reduce(
      (sum, item) => sum + (Number(item.soldPrice) || 0),
      0
    );
  
    const totalProfit = data.reduce(
      (sum, item) =>
        sum + ((Number(item.soldPrice) || 0) - (Number(item.rateWithTax) * Number(item.quantitySold) || 0)),
      0
    );
  
    const dailySales = uniqueDates.map((date) => {
      const dailyData = data.filter(
        (item) => new Date(item.soldAt).toDateString() === date
      );
  
      const sales = dailyData.reduce(
        (sum, item) => sum + (Number(item.soldPrice) || 0),
        0
      );
  
      const profit = dailyData.reduce(
        (sum, item) =>
          sum + ((Number(item.soldPrice) || 0) - (Number(item.rateWithTax) * Number(item.quantitySold) || 0)),
        0
      );
  
      return { date, sales, profit };
    });
  
    setRunningAverageSale(
      uniqueDates.length > 0 ? (totalSales / uniqueDates.length).toFixed(2) : "0.00"
    );
    setMonthlySales(totalSales.toFixed(2));
    setMonthlyProfit(totalProfit.toFixed(2));
    setDailyReport(dailySales);
  };
  

  const downloadCSV = () => {
    if (filteredData.length === 0) {
      alert("No data to download!");
      return;
    }

    // Define CSV headers
    let csvContent = "Item Name,Quantity Sold,Sold Price,Sold At\n";

    // Add sales data
    filteredData.forEach((data) => {
      csvContent += `${data.itemName},${data.quantitySold},${
        data.soldPrice
      },${new Date(data.soldAt).toLocaleString()}\n`;
    });

    // Create a Blob and download the file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Sales_History_${month}_${year}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8" style={{marginTop:"15px", marginBottom:"25px"}}>📊 Sales Report</h1>

      {/* Dropdowns */}
      <div className="flex gap-4 mb-8" style={{marginBottom:"20px"}}>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Year</option>
          {[
            ...new Set(
              salesData.map((data) => new Date(data.soldAt).getFullYear())
            ),
          ]
            .sort((a, b) => b - a)
            .map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
        </select>
      </div>

      {filteredData.length > 0 ? (
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 space-y-6" style={{padding:"15px"}}>
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-6 text-white">
            <div className="bg-blue-500 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-lg font-semibold">Running Avg Sale</h2>
              <p className="text-2xl font-bold">${runningAverageSale}</p>
            </div>
            <div className="bg-green-500 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-lg font-semibold">Total Sales</h2>
              <p className="text-2xl font-bold">${monthlySales}</p>
            </div>
            <div className="bg-yellow-500 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-lg font-semibold">Total Profit</h2>
              <p className="text-2xl font-bold">${monthlyProfit}</p>
            </div>
          </div>

          {/* Daily Report Table */}
          <div>
            <h2 className="text-xl font-semibold mb-3">📅 Daily Report</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Sales</th>
                  <th className="border border-gray-300 px-4 py-2">Profit</th>
                </tr>
              </thead>
              <tbody>
                {dailyReport.map(({ date, sales, profit }, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{date}</td>
                    <td className="border border-gray-300 px-4 py-2 text-blue-600 font-semibold">
                      ${sales}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-green-600 font-semibold">
                      ${profit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sales History */}
          <div className="historyreport" style={{marginTop:"15px",}}>
            <h2 className="text-xl font-semibold mb-3" style={{marginBottom:"10px"}}>🛍️ Sales History</h2>
            
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg bg-white">
  <thead className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
    <tr>
      <th className="py-3 px-5 text-left">Item Name</th>
      <th className="py-3 px-5 text-left">Quantity Sold</th>
      <th className="py-3 px-5 text-left">Sold Price</th>
    </tr>
  </thead>
  <tbody>
    {filteredData.map((data, index) => (
      <tr
        key={index}
        className="border-b hover:bg-gray-100 transition duration-300"
      >
        <td className="py-3 px-5 font-semibold text-gray-700">
          {data.itemName}
        </td>
        <td className="py-3 px-5 text-gray-600">{data.quantitySold}</td>
        <td className="py-3 px-5 text-green-600 font-medium">
          ${data.soldPrice}
        </td>
      </tr>
    ))}
  </tbody>
</table>


          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-lg">
          📌 Select a month and year to view the report.
        </div>
      )}

      <button
        onClick={downloadCSV}
        className="downloadbtns"
      >
        📥 Download CSV
      </button>
    </div>
  );
};

export default Report;
