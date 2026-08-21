import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    academicYear: "",
    semester: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/register", form);

      toast.success("Registration successful 🎉");

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Background Circles */}
      <div className="absolute w-[600px] h-[600px] border border-gray-300 rounded-full"></div>
      <div className="absolute w-[800px] h-[800px] border border-gray-300 rounded-full"></div>

      {/* Register Card */}
      <div className="bg-white p-8 rounded-xl shadow-xl w-[420px] relative z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Student Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Academic Year */}
          <div>
            <label className="text-sm text-gray-600">Academic Year</label>
            <input
              name="academicYear"
              placeholder="e.g. 2024-2025"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="text-sm text-gray-600">Semester</label>
            <input
              name="semester"
              placeholder="Semester"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

// import { useState } from "react";
// import API from "../api/axios.js";
// import { useNavigate } from "react-router-dom";

// const Register = () => {

//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     academicYear: "",
//     semester: ""
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await API.post("/auth/register", form);
//       alert("Registration successful");
//       navigate("/login");
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   return (
//     <div>

//       <h2>Student Register</h2>

//       <form onSubmit={handleSubmit}>

//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           onChange={handleChange}
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//         />

//         <input
//           type="text"
//           name="academicYear"
//           placeholder="Academic Year"
//           onChange={handleChange}
//         />

//         <input
//           type="number"
//           name="semester"
//           placeholder="Semester"
//           onChange={handleChange}
//         />

//         <button type="submit">
//           Register
//         </button>

//       </form>

//     </div>
//   );
// };

// export default Register;
