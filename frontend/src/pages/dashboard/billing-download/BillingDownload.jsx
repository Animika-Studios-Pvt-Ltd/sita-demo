import React from 'react';
import jsPDF from 'jspdf';

const BillingDownload = ({ order }) => {
  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.text(`Invoice for Order ${order._id}`, 10, 10);
    doc.text(`Name: ${order.name}`, 10, 20);
    doc.text(`Email: ${order.email}`, 10, 30);
    doc.text(
      `Address: ${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country} - ${order.address.zipcode}`,
      10,
      40
    );

    doc.text(`Status: ${order.status}`, 10, 50);

    let y = 60;
    order.products.forEach((product, index) => {
      doc.text(`${index + 1}. ${product.title} - $${product.price}`, 10, y);
      y += 10;
    });

    doc.text(`Total Price: $${order.totalPrice}`, 10, y + 10);

    doc.save(`Invoice_${order._id}.pdf`);
  };

  return (
    <div>
      <h2>Billing / Invoice</h2>
      <button onClick={() => downloadInvoice(order)}>Download Invoice</button>
    </div>
  );
};

export default BillingDownload;
