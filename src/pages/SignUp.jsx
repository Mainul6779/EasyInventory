import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SignUp = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [error, setError] = useState("");

  const handleRegister = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const photo = form.photo.value;
    const email = form.email.value;
    const password = form.password.value;

    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    createUser(email, password, name, photo)
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-600 to-blue-600 px-4 SignUpDesign">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 text-white">
        <h3 className="text-3xl font-bold text-center mb-6 insideSignUpForm">Create Your Account</h3>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full p-3 mt-1 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Photo URL</label>
            <input
              type="text"
              name="photo"
              placeholder="Photo URL"
              required
              className="w-full p-3 mt-1 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full p-3 mt-1 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full p-3 mt-1 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Register
          </button>
        </form>

        <div className="flex justify-center gap-2 mt-4 text-sm" style={{paddingBottom:"20px"}}>
          <span>Already have an account?</span>
          <Link to="/login" className="text-blue-300 font-semibold hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
