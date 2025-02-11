import { useState, useContext } from "react";
import { FaUpload } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider"; // Import Auth Context

const Add = () => {
  const { user } = useContext(AuthContext); // Get Logged-in User
  const [itemId, setItemId] = useState("");
  const [itemName, setItemName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("0.00");
  const [mrp, setMrp] = useState("0.00");
  const [taxes, setTaxes] = useState("0");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const RateWithTax = parseFloat(calculateTotalRate(rate, taxes)).toFixed(2);

    // Include User Email
    const itemData = {
      itemId,
      itemName,
      brandName,
      quantity,
      rate,
      mrp,
      taxes,
      RateWithTax,
      userEmail: user.email,
    };

    try {
      console.log("Sending data:", itemData);

      const response = await fetch("https://easyinventorys.vercel.app/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (response.ok) {
        Swal.fire({
          title: "✅ Success!",
          text: "Item has been added successfully.",
          icon: "success",
          timer: 2000,
        });

        // Clear form
        setItemId("");
        setItemName("");
        setBrandName("");
        setQuantity("");
        setRate("0.00");
        setMrp("0.00");
        setTaxes("0");
        setImage(null);
      } else {
        Swal.fire({
          title: "❌ Error!",
          text: responseData.message || "Failed to add item.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "❌ Error!",
        text: "Something went wrong.",
        icon: "error",
      });
    }
  };

  // Function to calculate Rate including Taxes
  const calculateTotalRate = (rate, taxes) => {
    return parseFloat(rate) + parseFloat(taxes || 0);
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-600 px-6 py-12 addForm">
      <div className="max-w-lg w-full bg-white p-10 rounded-3xl shadow-2xl insideFOrumt">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-8 paddingtothetop">
          Add New Item
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              htmlFor="itemId"
              className="block font-medium text-gray-700 mb-3"
            >
              Item ID
            </label>
            <input
              type="text"
              id="itemId"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Item ID"
              required
            />
          </div>
          <div>
            <label
              htmlFor="itemName"
              className="block font-medium text-gray-700 mb-3"
            >
              Item Name
            </label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Item Name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="itemName"
              className="block font-medium text-gray-700 mb-3"
            >
              Brand Name
            </label>
            <input
              type="text"
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Brand Name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block font-medium text-gray-700 mb-3"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Quantity"
              required
            />
          </div>
          <div>
            <label
              htmlFor="rate"
              className="block font-medium text-gray-700 mb-3"
            >
              Rate (Cost Price)
            </label>
            <input
              type="number"
              id="rate"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              step="0.01"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Rate"
              required
            />
          </div>
          <div>
            <label
              htmlFor="mrp"
              className="block font-medium text-gray-700 mb-3"
            >
              MRP (Selling Price)
            </label>
            <input
              type="number"
              id="mrp"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              step="0.01"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter MRP"
              required
            />
          </div>
          <div>
            <label
              htmlFor="taxes"
              className="block font-medium text-gray-700 mb-3"
            >
              Taxes (in %)
            </label>
            <input
              type="number"
              id="taxes"
              value={taxes}
              onChange={(e) => setTaxes(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Taxes"
              required
            />
            <p className="text-gray-500 text-sm mt-2">
              Ignore taxes if already included in rates
            </p>
          </div>
          <div>
            <label
              htmlFor="image"
              className="block font-medium text-gray-700 mb-3"
            >
              Image
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="file"
                id="image"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="flex items-center justify-center w-full px-5 py-3 bg-indigo-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-indigo-600"
              >
                <FaUpload className="mr-2" /> Upload Image
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 rounded-lg shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Save Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
