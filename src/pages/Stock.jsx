import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Stock = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const defaultImage =
    "https://images.unsplash.com/photo-1519520104014-df63821cb6f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGFyZHdhcmUlMjBzaG9wfGVufDB8fDB8fHww";

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch("http://localhost:5000/inventory");
        if (!response.ok) throw new Error("Failed to fetch stock data");
        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStockData();
  }, []);

  // Open modal with item details
  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Handle Update
  const handleUpdate = async () => {
    if (!selectedItem) return;

    Swal.fire({
      title: "Update Item?",
      text: "Are you sure you want to update this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedItem = {
            itemName: selectedItem.itemName, 
            brandName: selectedItem.brandName, 
            itemId: selectedItem.itemId,
            quantity: selectedItem.quantity,
            rate: selectedItem.rate,
            mrp: selectedItem.mrp,
            taxes: selectedItem.taxes,
          };

          const response = await fetch(`http://localhost:5000/inventory/${selectedItem._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedItem),
          });

          if (!response.ok) throw new Error("Failed to update item");

          setItems((prevItems) =>
            prevItems.map((item) => (item._id === selectedItem._id ? { ...item, ...updatedItem } : item))
          );
          setFilteredItems((prevItems) =>
            prevItems.map((item) => (item._id === selectedItem._id ? { ...item, ...updatedItem } : item))
          );

          setShowModal(false);
          Swal.fire("Updated!", "Your item has been updated.", "success");
        } catch (error) {
          Swal.fire("Error!", error.message, "error");
        }
      }
    });
  };

  // Handle Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Item?",
      text: "This action cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`http://localhost:5000/inventory/${id}`, {
          method: "DELETE",
        });

        const updatedItems = items.filter((item) => item._id !== id);
        setItems(updatedItems);
        setFilteredItems(updatedItems);
        setShowModal(false);
        Swal.fire("Deleted!", "Your item has been removed.", "success");
      }
    });
  };

  // Handle Search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = items.filter(
      (item) =>
        item.itemName.toLowerCase().includes(query) ||
        item.itemId.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

   // Handle the Rate including Taxes
   const calculateTotalRate = (rate, taxes) => {
    return parseFloat(rate) + parseFloat(taxes || 0);
  };

  return (
    <div className="container">
      <h2 className="title stockDesign">Stock Details</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Name or Item ID..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
      />

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {filteredItems.map((item) => (
          <div key={item._id} className="card" onClick={() => openModal(item)}>
            <img src={item.image || defaultImage} alt={item.itemName} />
            <div className="info">
              <h3>{item.itemName}</h3>
              <p>Brand: {item.brandName}</p>
              <p>Item ID: {item.itemId}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Rate: ${parseFloat(item.rate || 0).toFixed(2)}</p>
               {/* Calculate Rate including Taxes */}
               <p>Rate(including Taxes): ${parseFloat(calculateTotalRate(item.rate, item.taxes)).toFixed(2)}</p>
              <p>MRP: ${parseFloat(item.mrp || 0).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Edit Item */}
      {showModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="editItem">Edit Item</h2>
            <label>Item Name</label>
            <input
              type="text"
              value={selectedItem.itemName}
              onChange={(e) => setSelectedItem({ ...selectedItem, itemName: e.target.value })}
            />
            <label>Brand Name</label>
            <input
              type="text"
              value={selectedItem.brandName}
              onChange={(e) => setSelectedItem({ ...selectedItem, brandName: e.target.value })}
            />
            <label>Item ID</label>
            <input
              type="text"
              value={selectedItem.itemId}
              onChange={(e) => setSelectedItem({ ...selectedItem, itemId: e.target.value })}
            />
            <label>Quantity</label>
            <input
              type="number"
              value={selectedItem.quantity}
              onChange={(e) => setSelectedItem({ ...selectedItem, quantity: e.target.value })}
            />
            <label>Rate</label>
            <input
              type="number"
              value={selectedItem.rate}
              onChange={(e) => setSelectedItem({ ...selectedItem, rate: e.target.value })}
            />
            <label>MRP</label>
            <input
              type="number"
              value={selectedItem.mrp}
              onChange={(e) => setSelectedItem({ ...selectedItem, mrp: e.target.value })}
            />
            <label>Taxes</label>
            <input
              type="number"
              value={selectedItem.taxes}
              onChange={(e) => setSelectedItem({ ...selectedItem, taxes: e.target.value })}
            />
            <div className="buttons">
              <button className="update" onClick={handleUpdate}>Update</button>
              <button className="delete" onClick={() => handleDelete(selectedItem._id)}>Delete</button>
              <button className="close" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
