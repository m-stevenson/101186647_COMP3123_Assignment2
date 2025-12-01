// src/pages/EmployeeListPage.js
import React, { useEffect, useState } from "react";
import api from "../api/axios";

const BACKEND_URL = "http://localhost:8081";

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);

  const [filters, setFilters] = useState({
    department: "",
    position: "",
  });

  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    salary: "",
    date_of_joining: "",
    department: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");

// fetch employees
  const fetchEmployees = async () => {
    try {
      let res;
      if (filters.department || filters.position) {
        res = await api.get("/emp/employees/search", { params: filters });
      } else {
        res = await api.get("/emp/employees");
      }
      setEmployees(res.data);
    } catch (err) {
      console.log("Error fetching employees");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters]);

  // add employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(newEmployee).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (profilePicture) formData.append("profile_picture", profilePicture);

      await api.post("/emp/employees", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewEmployee({
        first_name: "",
        last_name: "",
        email: "",
        position: "",
        salary: "",
        date_of_joining: "",
        department: "",
      });
      setProfilePicture(null);
      setError("");

      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add employee");
    }
  };

// delete employee
  const handleDelete = async (id) => {
    if (!window.confirm("Delete employee?")) return;
    try {
      await api.delete(`/emp/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch {
      alert("Failed to delete employee.");
    }
  };

// filter change and new employee change handlers
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleNewEmployeeChange = (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold">Employee Management</h1>

        <div className="grid gap-6">

          {/* add employee */}
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>

            {error && <p>{error}</p>}

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ["first_name", "First Name"],
                  ["last_name", "Last Name"],
                  ["email", "Email"],
                  ["position", "Position"],
                  ["salary", "Salary"],
                  ["date_of_joining", "Date of Joining"],
                  ["department", "Department"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-sm font-medium">{label}</label>
                    <input
                      type={name === "salary" ? "number" : name === "date_of_joining" ? "date" : "text"}
                      name={name}
                      value={newEmployee[name]}
                      onChange={handleNewEmployeeChange}
                      required
                      className="w-full rounded-xl border px-4 py-2 text-sm"
                    />
                  </div>
                ))}

                {/* profile picture */}
                <div>
                  <label className="block text-sm font-medium">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                    className="w-full text-sm"
                  />
                </div>
              </div>

              <button className="px-6 py-2 rounded-xl bg-rose-400 hover:bg-rose-500 text-white text-sm justify-end">
                  Add Employee
              </button>
            </form>
          </section>
        </div>

          {/* search */}
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Search Employees</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                placeholder="Filter by Department"
                className="w-full rounded-xl px-4 py-2 text-sm"
              />

              <input
                type="text"
                name="position"
                value={filters.position}
                onChange={handleFilterChange}
                placeholder="Filter by Position"
                className="w-full rounded-xl px-4 py-2 text-sm"
              />
            </div>
          </section>

        {/* employee list */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Employee List</h2>

          {employees.length === 0 ? (
            <p className="text-sm">No employees found.</p>
          ) : (
            <table className="min-w-full text-sm overflow-x-auto">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left">Picture</th>
                  <th className="py-2 pr-4 text-left">Name</th>
                  <th className="py-2 pr-4 text-left">Email</th>
                  <th className="py-2 pr-4 text-left">Position</th>
                  <th className="py-2 pr-4 text-left">Department</th>
                  <th className="py-2 pr-4 text-left">Salary</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td className="py-2 pr-4">
                      {emp.profile_picture ? (
                        <img
                          src={`${BACKEND_URL}/uploads/${emp.profile_picture}`}
                          className="w-10 h-10 rounded-xl object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs">
                          N/A
                        </div>
                      )}
                    </td>

                    <td className="py-2 pr-4">
                      {emp.first_name} {emp.last_name}
                    </td>

                    <td className="py-2 pr-4">{emp.email}</td>
                    <td className="py-2 pr-4">{emp.position}</td>
                    <td className="py-2 pr-4">{emp.department}</td>
                    <td className="py-2 pr-4">{emp.salary}</td>

                    <td className="py-2 pl-4 text-right">
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="px-3 py-1 rounded-xl text-xs bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        Delete Employee
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
