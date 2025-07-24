import React, { useState, useEffect } from "react";

const EditInvoiceForm = ({ invoiceData, onSave }) => {
  const [invoiceNo, setInvoiceNo] = useState(invoiceData?.invoiceNo || "");
  const [date, setDate] = useState(invoiceData?.date ? invoiceData.date.substring(0,10) : "");
  const [customer, setCustomer] = useState(invoiceData?.customer || "");
  const [balance, setBalance] = useState(invoiceData?.balance || 0);

  const [items, setItems] = useState(invoiceData?.items || [
    { item: "LD SALE", unitPrice: 0, qty: 0, amount: 0 },
  ]);

  // Calculate total amount
  const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);

  // Handle item change
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === "item" ? value : Number(value);
    newItems[index].amount = newItems[index].unitPrice * newItems[index].qty;
    setItems(newItems);
  };

  // Add new item row
  const addItem = () => {
    setItems([...items, { item: "LD SALE", unitPrice: 0, qty: 0, amount: 0 }]);
  };

  // Remove item row
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSave = () => {
    const invoice = {
      invoiceNo,
      date,
      customer,
      balance,
      items,
      totalAmount,
    };
    onSave(invoice);
  };

  // Sample customers for dropdown
  const customers = [
    "Poly Colour Polyethene",
    "Customer A",
    "Customer B",
  ];

  // Sample item options
  const itemOptions = ["LD SALE", "HD SALE", "Sample Item"];

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h2>Invoice Management</h2>
      <h4>Add/Edit Invoice</h4>

      <label>Invoice No:</label>
      <input
        type="text"
        value={invoiceNo}
        onChange={(e) => setInvoiceNo(e.target.value)}
        className="form-control mb-2"
      />

      <label>Date:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="form-control mb-2"
      />

      <label>Customer:</label>
      <select
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        className="form-control mb-2"
      >
        <option value="">Select Customer</option>
        {customers.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label>Balance:</label>
      <input
        type="number"
        value={balance}
        onChange={(e) => setBalance(Number(e.target.value))}
        className="form-control mb-4"
      />

      <h5>Items</h5>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Item</th>
            <th>Unit Price</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>
                <select
                  className="form-control"
                  value={item.item}
                  onChange={(e) => handleItemChange(i, "item", e.target.value)}
                >
                  {itemOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleItemChange(i, "unitPrice", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={item.qty}
                  onChange={(e) => handleItemChange(i, "qty", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={item.amount.toFixed(2)}
                  readOnly
                />
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeItem(i)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}

          <tr>
            <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>
              Total Amount:
            </td>
            <td>
              <input
                type="number"
                className="form-control"
                value={totalAmount.toFixed(2)}
                readOnly
              />
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <button className="btn btn-info mr-2" onClick={addItem}>
        Add Item
      </button>
      <button className="btn btn-success mr-2" onClick={handleSave}>
        Save
      </button>
      <button className="btn btn-primary mr-2">Print</button>
      <button className="btn btn-primary mr-2">Print AOD</button>
      <button
        className="btn btn-warning"
        onClick={() => {
          setInvoiceNo("");
          setDate("");
          setCustomer("");
          setBalance(0);
          setItems([{ item: "LD SALE", unitPrice: 0, qty: 0, amount: 0 }]);
        }}
      >
        Clear
      </button>
    </div>
  );
};

export default EditInvoiceForm;
