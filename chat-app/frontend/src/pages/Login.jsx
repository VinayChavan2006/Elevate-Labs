import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useLoginMutation } from "../redux/api/userSlice.js";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { socket } from "../socket/socket.js";

const Login = () => {
  // use rtk query for login
  const [login, { isLoading, error }] = useLoginMutation();

  // diapatch the actions
  const dispatch = useDispatch();

  // useNavigate for navigation
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      if(response?.error){
        toast.error(response?.error?.data?.message || "Login failed");
        return;
      }
      if (Object.keys(response?.data).length !== 0) {
        dispatch(setCredentials({ ...response?.data }));
      }
      socket.emit('setup',response?.data?._id);
      toast.success("Login successful");
      // socket.emit('setup',{userId: response?.data?._id})
      navigate("/chat");
    } catch (error) {
      toast.error(
        error?.data?.message || "Login failed, please try again"
      );
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-6">
            {/* Placeholder for a logo or app icon, themed blue */}
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 64 64"
              >
                <path
                  fill="#85cbf8"
                  d="M32 4A28 28 0 1 0 32 60A28 28 0 1 0 32 4Z"
                ></path>
                <path
                  fill="#8d6c9f"
                  d="M32,61C16.01,61,3,47.991,3,32S16.01,3,32,3s29,13.009,29,29S47.99,61,32,61z M32,5 C17.112,5,5,17.112,5,32s12.112,27,27,27s27-12.112,27-27S46.888,5,32,5z"
                ></path>
                <path
                  fill="#8d6c9f"
                  d="M9.979 39.605c-.431 0-.828-.28-.958-.714-.158-.529.142-1.086.671-1.245l1.916-.574c.529-.162 1.087.143 1.245.671s-.142 1.086-.671 1.245l-1.916.574C10.17 39.591 10.073 39.605 9.979 39.605zM12.251 44.78c-.341 0-.672-.174-.859-.487-.283-.474-.129-1.088.346-1.372l1.717-1.026c.472-.284 1.087-.129 1.371.345.283.474.129 1.088-.346 1.372l-1.717 1.026C12.603 44.735 12.426 44.78 12.251 44.78zM15.718 49.245c-.257 0-.513-.098-.708-.294-.39-.391-.39-1.024.002-1.414l1.416-1.413c.391-.391 1.023-.389 1.414.002.39.391.39 1.024-.002 1.414l-1.416 1.413C16.229 49.147 15.974 49.245 15.718 49.245zM20.173 52.722c-.176 0-.353-.046-.514-.143-.474-.284-.627-.898-.343-1.372l1.03-1.714c.284-.474.898-.627 1.372-.342.474.284.627.898.343 1.372l-1.03 1.714C20.844 52.549 20.513 52.722 20.173 52.722zM25.345 55.007c-.096 0-.192-.014-.289-.043-.528-.16-.828-.718-.668-1.247l.578-1.915c.159-.528.716-.827 1.246-.668.528.16.828.718.668 1.247l-.578 1.915C26.172 54.728 25.774 55.007 25.345 55.007z"
                ></path>
                <g>
                  <path
                    fill="#8d6c9f"
                    d="M32,55c-0.553,0-1-0.448-1-1s0.447-1,1-1c11.579,0,21-9.42,21-21s-9.421-21-21-21s-21,9.42-21,21 c0,0.552-0.447,1-1,1s-1-0.448-1-1C9,19.318,19.317,9,32,9s23,10.318,23,23S44.683,55,32,55z"
                  ></path>
                </g>
                <g>
                  <path
                    fill="#fff8ee"
                    d="M40.501,21.149c-0.734,0.29-21.568,9.074-21.568,9.074s-1.009,0.345-0.929,0.982 c0.08,0.637,0.903,0.929,0.903,0.929l5.362,1.805c0,0,1.619,5.309,1.938,6.317c0.319,1.009,0.574,1.033,0.574,1.033 c0.296,0.129,0.567-0.077,0.567-0.077l3.465-3.159l5.401,4.141c1.46,0.637,1.991-0.69,1.991-0.69l3.721-19.064 C42.256,20.964,41.276,20.844,40.501,21.149z"
                  ></path>
                </g>
                <g>
                  <path
                    fill="#8d6c9f"
                    d="M36.96,43.366c-0.33,0-0.715-0.068-1.146-0.256l-0.208-0.123l-4.736-3.631l-2.848,2.595 c-0.388,0.301-0.966,0.502-1.548,0.291c-0.761-0.234-1.09-1.272-1.22-1.685c-0.261-0.821-1.383-4.494-1.792-5.835l-4.874-1.641 c-0.158-0.056-1.424-0.539-1.576-1.751c-0.134-1.067,0.776-1.773,1.598-2.053c0.786-0.334,20.788-8.767,21.524-9.058l0.001,0 c0.853-0.335,1.688-0.253,2.24,0.218c0.392,0.335,0.802,0.994,0.526,2.222l-3.768,19.217c-0.039,0.096-0.403,0.951-1.312,1.324 C37.603,43.289,37.312,43.366,36.96,43.366z M36.713,41.316c0.111,0.04,0.252,0.072,0.351,0.033 c0.082-0.034,0.151-0.122,0.188-0.175l3.693-18.926c0.019-0.083,0.03-0.151,0.037-0.208c-0.035,0.01-0.073,0.022-0.114,0.039 c-0.597,0.236-14.351,6.031-21.546,9.065c-0.033,0.012-0.065,0.025-0.097,0.039c0.01,0.004,0.019,0.008,0.028,0.012l5.822,1.96 l0.149,0.492c0.001,0,1.617,5.3,1.936,6.306c0.007,0.021,0.014,0.042,0.021,0.062l3.577-3.266L36.713,41.316z"
                  ></path>
                </g>
                <g>
                  <path
                    fill="#8d6c9f"
                    d="M37.859,25.764c0.027-0.451-0.602-0.129-0.602-0.129l-13.098,8.113c0,0,1.729,5.5,2.048,6.509 c0.318,1.009,0.754,1.181,0.754,1.181l0.978-6.224c0,0,9.257-8.627,9.655-8.999C37.992,25.844,37.859,25.764,37.859,25.764z"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Login to your account
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-800"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end mb-6">
              <Link href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-md"
            >
              <LogIn size={20} className="mr-2" />{" "}
              {!isLoading ? "Log In" : "Logging In..."}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
