import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../public/CreateEmployee.css"; 

const CreateEmployee = () => {

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    mobilenumber: "",
    designation: "",
    gender: "",
    course: "",
    imgupload: null, 
  });

  const [imgFileName, setImgFileName] = useState(""); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files[0]) {
      setEmployee({
        ...employee,
        imgupload: files[0],
      });
      setImgFileName(files[0].name); 
    }
  };

  const validateForm = () => {
    if (employee.name.length < 3) {
      return "Name should be at least 3 characters long.";
    }
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(employee.email)
    ) {
      return "Please enter a valid email address.";
    }
    if (!/^\d{10}$/.test(employee.mobilenumber)) {
      return "Please enter a valid 10-digit mobile number.";
    }
    if (!employee.course) {
      return "Course cannot be empty.";
    }
    if (!employee.imgupload) {
      return "Please upload an image.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("mobilenumber", employee.mobilenumber);
    formData.append("designation", employee.designation);
    formData.append("gender", employee.gender);
    formData.append("course", employee.course);
    formData.append("imgupload", employee.imgupload); 

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employee/create-employee",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } } 
      );
      toast.success("Employee created successfully!"); 
      setError(null);
      
      setEmployee({
        name: "",
        email: "",
        mobilenumber: "",
        designation: "",
        gender: "",
        course: "",
        imgupload: null, 
      });
      setImgFileName(""); 
      setInterval(() => {
        navigate("/employee-list");
      }, 3000);
     
    } catch (err) {
      console.error(err); 
      const errorMessage =
        err.response?.data?.message || "Error creating employee";
      setError(errorMessage);
      toast.error(errorMessage); 
    }
  };

  return (
    <div>
      <h2>Create Employee</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={employee.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={employee.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="mobilenumber">Mobile Number</label>
          <input
            type="text"
            name="mobilenumber"
            id="mobilenumber"
            value={employee.mobilenumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="designation">Designation</label>
          <input
            type="text"
            name="designation"
            id="designation"
            value={employee.designation}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="gender">Gender</label>
          <select
            name="gender"
            id="gender"
            value={employee.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-control">
          <label htmlFor="course">Course</label>
          <input
            type="text"
            name="course"
            id="course"
            value={employee.course}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="imgupload">Image</label>
          <input
            type="file"
            name="imgupload"
            id="imgupload"
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png"
            required
          />
          {imgFileName && <p>Selected file: {imgFileName}</p>} 
        </div>

        <button type="submit" className="btn">
          Create Employee
        </button>
      </form>
      <ToastContainer stacked />
    </div>
  );
};

export default CreateEmployee;
