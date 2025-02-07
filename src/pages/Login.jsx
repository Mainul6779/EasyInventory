import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";

const Login = () => {
  const { signIn, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
      .then((result) => {
        setError("");
        form.reset();
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        setError("");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 px-4 LoginDesign">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 text-white">
        <h3 className="text-3xl font-bold text-center mb-6 insideLoginForm">Welcome Back</h3>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-3 mt-1 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full p-3 mt-1 bg-white/20 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-200"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Login
          </button>
        </form>

        <div className="flex justify-center gap-2 mt-4 text-sm">
          <span>Don&apos;t have an account?</span>
          <Link to="/signUp" className="text-blue-300 font-semibold hover:underline">
            SignUp
          </Link>
        </div>

        <div className="mt-6 text-center" style={{padding:"10px"}}>
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-md hover:from-green-600 hover:to-green-800 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md LoginGoogleButton"
          >
            <FaGoogle className="mr-2" /> Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
