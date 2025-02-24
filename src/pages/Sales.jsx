import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import moment from "moment";

const Sales = () => {
  const { user } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemName, setItemName] = useState("");
  const [quantitySold, setQuantitySold] = useState("");
  const [soldPrice, setSoldPrice] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [basePrice, setBasePrice] = useState(""); // Store base price (MRP)
  const [salesData, setSalesData] = useState([]); // Store all sales data
  const [todaysSales, setTodaysSales] = useState([]); // Filtered sales for today

  // Fetch inventory data
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`https://easyinventorys.vercel.app/inventory?email=${user?.email}`);
        if (!response.ok) throw new Error("Failed to fetch inventory");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };
    fetchItems();
  }, [user?.email]);

  // Fetch sales data
  const fetchSales = useCallback(async () => {
    if (!user?.email) return;
    try {
      const response = await fetch(
        `https://easyinventorys.vercel.app/sales?email=${user?.email}`
      );
      if (!response.ok) throw new Error("Failed to fetch sales data");
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchSales();
    }
  }, [user?.email]);

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");
    const todaysFilteredSales = salesData.filter(
      (sale) => moment(sale.soldAt).format("YYYY-MM-DD") === today
    );
    setTodaysSales(todaysFilteredSales);
  }, [salesData]); // ✅ No missing dependencies

 // Search items in inventory

  const handleItemSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setItemName(value);
  
    if (value.trim()) {
      const filtered = items.filter(
        (item) =>
          item.itemName.toLowerCase().includes(value) ||
          item.itemId.toString().includes(value) // Ensure itemId is a string for comparison
      );
  
      setFilteredItems(filtered);
  
      if (filtered.length === 1) {
        setBasePrice(filtered[0].mrp);
        setSoldPrice(filtered[0].mrp);
        setItemCost(filtered[0].rate);
      }
    } else {
      setFilteredItems([]);
      setBasePrice("");
      setSoldPrice("");
      setItemCost("");
    }
  };
  

  // Handle selecting an item from search results
  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setItemName(`${item.itemId} - ${item.itemName}`);
    setBasePrice(item.mrp);
    setSoldPrice(item.mrp);
    setItemCost(item.rate);
    setFilteredItems([]);
  };

  // Auto-update sold price based on quantity
  useEffect(() => {
    if (basePrice && quantitySold && !isNaN(quantitySold)) {
      setSoldPrice((basePrice * parseFloat(quantitySold)).toFixed(2));
    }
  }, [quantitySold, basePrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const soldPriceNum = parseFloat(soldPrice);
    const itemCostNum = parseFloat(itemCost);
    const quantityNum = parseInt(quantitySold, 10);

    if (!quantityNum || quantityNum <= 0) {
      Swal.fire({
        title: "Error!",
        text: "Quantity must be greater than 0.",
        icon: "error",
      });
      return;
    }

    if (soldPriceNum < itemCostNum) {
      Swal.fire({
        title: "Error!",
        text: "Sold price cannot be lower than item cost.",
        icon: "error",
      });
      return;
    }

    if (!selectedItem) {
      Swal.fire({
        title: "Error!",
        text: "Please select a valid item.",
        icon: "error",
      });
      return;
    }

    if (!user?.email) {
      Swal.fire({
        title: "Error!",
        text: "User email is missing!",
        icon: "error",
      });
      return;
    }

    const itemFromInventory = items.find(
      (item) => item.itemId === selectedItem.itemId
    );
    if (!itemFromInventory) {
      Swal.fire({
        title: "Error!",
        text: "Item not found in inventory.",
        icon: "error",
      });
      return;
    }

    const totalRate =
      parseFloat(itemFromInventory.rate) +
      parseFloat(itemFromInventory.taxes || 0);

    const salesData = {
      itemId: selectedItem.itemId,
      itemName: selectedItem.itemName,
      brandName: selectedItem.brandName,
      quantitySold: quantityNum,
      soldPrice: soldPriceNum.toFixed(2),
      itemCost: itemFromInventory.rate,
      rateWithTax: totalRate.toFixed(2),
      soldAt: new Date().toISOString(),
      userEmail: user.email,
    };

    try {
      const response = await fetch("https://easyinventorys.vercel.app/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(salesData),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "✅ Success!",
          text: "Sale recorded successfully.",
          icon: "success",
          timer: 2000,
        });

        // Reset form fields
        setSelectedItem(null);
        setItemName("");
        setQuantitySold("");
        setSoldPrice("");
        setItemCost("");

        fetchSales(); // Refresh sales
      } else {
        Swal.fire({
          title: "Error!",
          text: result.message || "Failed to record sale.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-400 to-blue-600 px-6 py-12 Salesdesign">
      <div
        className="max-w-lg w-full bg-white p-10 rounded-3xl shadow-2xl mb-8"
        style={{ marginTop: "20px" }}
      >
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8 insideSalesForm">
          Record a Sale
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="itemName"
              className="block text-gray-700 font-medium mb-3"
            >
              Item ID - Item Name
            </label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={handleItemSearch}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Search Item Name"
              required
            />
            {filteredItems.length > 0 && (
              <ul className="border border-gray-300 rounded-lg mt-2 max-h-40 overflow-y-auto bg-white">
                {filteredItems.map((item) => (
                  <li
                    key={item.itemId}
                    className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                    onClick={() => handleItemSelect(item)}
                  >
                    {item.itemId} - {item.itemName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label
              htmlFor="itemCost"
              className="block text-gray-700 font-medium mb-3"
            >
              Cost per Item
            </label>
            <input
              type="number"
              id="itemCost"
              value={itemCost}
              readOnly
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="quantitySold"
              className="block text-gray-700 font-medium mb-3"
            >
              Quantity Sold
            </label>
            <input
              type="number"
              id="quantitySold"
              value={quantitySold}
              onChange={(e) => setQuantitySold(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter Quantity Sold"
              required
            />
          </div>
          <div>
            <label
              htmlFor="soldPrice"
              className="block text-gray-700 font-medium mb-3"
            >
              Product Sold At Price
            </label>
            <input
              type="number"
              id="soldPrice"
              value={soldPrice}
              onChange={(e) => setSoldPrice(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter Sold Price"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Sold
          </button>
        </form>
      </div>

      {/* Today's Sale Section */}
      <div
        className="max-w-4xl w-full bg-white p-6 rounded-xl shadow-lg"
        style={{ padding: "15px", marginTop: "15px", marginBottom: "15px" }}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">
          📆 Today&apos;s Sales
        </h2>
        {todaysSales.length > 0 ? (
          <ul className="divide-y divide-gray-300">
            {todaysSales.map((sale) => (
              <li
                key={sale._id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">{sale.itemName}</p>
                  <p className="text-gray-600 text-sm">
                    Quantity: {sale.quantitySold} | Sold At: ${sale.soldPrice}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {moment(sale.soldAt).format("hh:mm A")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">No sales recorded today.</p>
        )}
      </div>
    </div>
  );
};

export default Sales;
