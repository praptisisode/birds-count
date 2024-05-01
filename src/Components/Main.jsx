import React, { useState } from "react";
import "../App.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

let nextId = 1;

const Main = () => {
  const [unit, setUnit] = useState(0);
  const [trader, setTrader] = useState("");
  const [current, setCurrent] = useState([]);
  const [total, setTotal] = useState(0);

  const handleChange = (e) => {
    const newValue = e.target.value;
    // You can add validation logic here if needed
    setUnit(newValue);
  };

  console.log(current);

  function formatDate(date) {
    let datePart = [date.getMonth() + 1, date.getDate(), date.getFullYear()]
      .map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0"))
      .join("-");
    let timePart = [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map((n, i) => n.toString().padStart(2, "0"))
      .join(":");
    return datePart + " " + timePart;
  }

  const onIncrement = () => {
    if (unit) {
      const confirmation = window.confirm(
        "Are you sure you want to add a unit?"
      );
      if (confirmation) {
        setTotal(Number(total) + Number(unit));
        setCurrent([
          ...current,
          { id: nextId++, noOfBirds: unit, time: formatDate(new Date()) },
        ]);
      }
    } else {
      alert("Please enter unit");
    }
  };

  const onDecrement = () => {
    if (unit) {
      const confirmation = window.confirm(
        "Are you sure you want to remove a unit?"
      );
      if (confirmation) {
        setTotal(total - unit);
        setCurrent([
          ...current,
          { id: nextId++, noOfBirds: `-${unit}`, time: formatDate(new Date()) },
        ]);
      }
    } else {
      alert("Please enter unit");
    }
  };

  const onUndo = () => {
    if (current.length) {
      let confirm = window.confirm("Are you sure u want to undo last entry?");
      if (confirm) {
        setTotal(Number(total) - Number(current[current.length - 1].noOfBirds));
        const copyArr = [...current];
        copyArr.splice(-1);
        setCurrent(copyArr);
      }
    }
  };

  const onDownload = () => {
    if (current.length && trader) {
      const table = document.getElementById("table-to-pdf");
      const pdf = new jsPDF("p", "pt", "a4");

      html2canvas(table).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.text("SISODE POULTRY FARM", 10, 20);
        pdf.text(`Trader: ${trader}`, 10, 40);
        pdf.text(
          `No. of units: ${current.length}      Total Birds: ${total}`,
          10,
          60
        );
        pdf.addImage(imgData, "PNG", 10, 80, imgWidth, imgHeight);
        pdf.save(`${total}-SPF`);
      });
    } else {
      alert("Make sure you have added birds and trader");
    }
  };

  return (
    <div>
      <div className="disp-flex space-around margin-10">
        <div>
          <label htmlFor="unit">Unit:&nbsp;</label>
          <input
            type="number"
            id="unit"
            name="unit"
            value={unit}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="trader">Trader:&nbsp;</label>
          <input
            type="text"
            id="trader"
            name="trader"
            value={trader}
            onChange={(e) => setTrader(e.target.value)}
          />
        </div>
      </div>
      <div className="disp-flex space-around margin-10">
        <div>No. of units: {current.length}</div>
        <div>Total birds: {total}</div>
      </div>
      <div className="disp-flex space-evenly margin-10">
        <button className="button" onClick={onIncrement}>
          Add
        </button>
        <button className="button" onClick={onDecrement}>
          Return
        </button>
        <button className="button" onClick={onUndo}>
          Undo
        </button>
        <button className="button" onClick={onDownload}>
          Download
        </button>
      </div>
      <Table data={current}></Table>
    </div>
  );
};

const Table = ({ data }) => {
  return (
    <table id="table-to-pdf" className="custom-table">
      <thead>
        <tr>
          <th>Sr. No.</th>
          <th>Unit</th>
          <th>Date and Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.id}</td>
            <td>{item.noOfBirds}</td>
            <td>{item.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Main;
