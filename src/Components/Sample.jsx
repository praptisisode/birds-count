import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TableToPDF = () => {
  const [data, setData] = useState([
    { name: 'John', age: 30, gender: 'Male' },
    { name: 'Jane', age: 25, gender: 'Female' },
    { name: 'Doe', age: 40, gender: 'Male' },
  ]);

  const downloadPDF = () => {
    const table = document.getElementById('table-to-pdf');
    const pdf = new jsPDF('p', 'pt', 'a4');

    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('table.pdf');
    });

    // Add state data
    pdf.text('State Data:', 10, 250);
    data.forEach((item, index) => {
      pdf.text(
        `${index + 1}. Name: ${item.name}, Age: ${item.age}, Gender: ${item.gender}`,
        10,
        270 + index * 20
      );
    });
  };

  return (
    <div>
      <button onClick={downloadPDF}>Download PDF</button>
      <table id="table-to-pdf">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>{item.gender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableToPDF;
