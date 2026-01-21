import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    code: "",
    title: "",
    date: "",
    fees: "",
    capacity: "",
    ageGroup: "",
  });

  const fetchEvents = async () => {
    const res = await axios.get("/api/events");
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/events", form);
    setForm({ code: "", title: "", date: "", fees: "", capacity: "", ageGroup: "" });
    fetchEvents();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Workshop / Event Calendar</h2>

      {/* Add Event */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input placeholder="Code" onChange={e => setForm({...form, code: e.target.value})} />
        <input placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} />
        <input type="date" onChange={e => setForm({...form, date: e.target.value})} />
        <input placeholder="Fees" onChange={e => setForm({...form, fees: e.target.value})} />
        <input placeholder="Capacity" onChange={e => setForm({...form, capacity: e.target.value})} />
        <input placeholder="Age Group" onChange={e => setForm({...form, ageGroup: e.target.value})} />
        <button className="bg-indigo-600 text-white p-2 col-span-2">Add Event</button>
      </form>

      {/* List */}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Code</th>
            <th>Title</th>
            <th>Date</th>
            <th>Fees</th>
            <th>Capacity</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e._id}>
              <td>{e.code}</td>
              <td>{e.title}</td>
              <td>{e.date}</td>
              <td>{e.fees}</td>
              <td>{e.capacity}</td>
              <td>{e.ageGroup}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageEvents;
