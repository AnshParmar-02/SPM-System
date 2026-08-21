import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {

  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;

// const ProtectedRoute = ({ children, role }) => {
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("role");

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   if (role && role !== userRole) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// };

// export default ProtectedRoute;


// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const ProtectedRoute = ({ children, role }) => {

//   const { user } = useContext(AuthContext);
//   const token = localStorage.getItem("token");
//   const userRole = localStorage.getItem("role");

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   if(!token){
//     return <Navigate to="/login" />
//   }

//   if(role && role !== userRole){
//     return <Navigate to="/login" />
//   }

//   return children;
// };

// export default ProtectedRoute;