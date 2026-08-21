import { useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [role, setRole] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });
      toast.success("Login successful 🎉");

      // store token
      localStorage.setItem("token", res.data.token);

      // store user
      localStorage.setItem("user", JSON.stringify(res.data));

      login(res.data);

      const userRole = res.data.role;

      if (userRole === "student") navigate("/student-dashboard");
      if (userRole === "guide") navigate("/guide-dashboard");
      if (userRole === "coordinator") navigate("/coordinator-dashboard");
      if (userRole === "admin") navigate("/admin-dashboard");

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Background Circles */}
      <div className="absolute w-[600px] h-[600px] border border-gray-300 rounded-full"></div>
      <div className="absolute w-[800px] h-[800px] border border-gray-300 rounded-full"></div>

      {/* Login Card */}
      <div className="bg-white p-8 rounded-xl shadow-xl w-[380px] relative z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Log in to continue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Your password"
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center text-sm mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#" className="text-blue-500 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Button */}
          <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

          {/* Register */}
          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link to="/register">
              <span className="text-blue-500 cursor-pointer hover:underline">
                Create in 2 minutes
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

// import { useState, useContext } from "react";
// import API from "../api/axios";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Login = () => {

//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {

//       const res = await API.post("/auth/login", form);

//       login(res.data);

//       const role = res.data.user.role;

//       if (role === "student") navigate("/student-dashboard");
//       if (role === "guide") navigate("/guide-dashboard");
//       if (role === "coordinator") navigate("/coordinator-dashboard");
//       if (role === "admin") navigate("/admin-dashboard");

//     } catch (error) {
//       alert(error.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div>

//       <h2>Login</h2>

//       <form onSubmit={handleSubmit}>

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

//         <button type="submit">Login</button>

//       </form>

//     </div>
//   );
// };

// export default Login;

// import { useState, useContext } from "react";
// import API from "../api/axios.js";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//         const res = await API.post("/auth/login", form);
//         login(res.data);

//         // localStorage.setItem("token", res.data.token);
//         localStorage.setItem("role", res.data.user.role);

//         if (res.data.user.role === "student") {
//           navigate("/student-dashboard");
//         }

//         if (res.data.user.role === "guide") {
//           navigate("/guide-dashboard");
//         }

//         if (res.data.user.role === "coordinator") {
//           navigate("/coordinator-dashboard");
//         }

//         if (res.data.user.role === "admin") {
//           navigate("/admin-dashboard");
//         }

//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>

//       <form onSubmit={handleSubmit}>
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

//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;
