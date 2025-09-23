
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-sm bg-white">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-yellow-700">OwlExchange</span>
        </div>

        <div className="flex items-center border rounded-full px-3 py-1 bg-gray-50">
          <input
            type="text"
            placeholder="Search donations, trades, sales..."
            className="bg-transparent outline-none w-64 text-sm"
          />
        </div>

        <button
          className="border rounded-full px-6 py-2 hover:bg-gray-100"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-20">
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-yellow-700">OwlExchange</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Your community platform for sharing, trading, and giving. Connect with neighbors 
          to donate items, make sustainable swaps, and build a stronger local community.
        </p>
        <button
          className="mt-6 rounded-full px-8 py-3 text-lg bg-yellow-600 text-white hover:bg-yellow-700"
          onClick={() => navigate("/login")}
        >
          Join Our Community
        </button>
      </header>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-20 max-w-5xl mx-auto">
        <div className="shadow-md rounded-2xl p-6 text-center bg-white">
          <h3 className="font-semibold text-lg">Donate & Share</h3>
          <p className="text-gray-600 text-sm mt-2">
            Give items a second life by donating to community members who need them.
          </p>
        </div>

        <div className="shadow-md rounded-2xl p-6 text-center bg-white">
          <h3 className="font-semibold text-lg">Trade & Exchange</h3>
          <p className="text-gray-600 text-sm mt-2">
            Swap items you no longer need for things that bring you joy.
          </p>
        </div>

        <div className="shadow-md rounded-2xl p-6 text-center bg-white">
          <h3 className="font-semibold text-lg">Build Community</h3>
          <p className="text-gray-600 text-sm mt-2">
            Connect with neighbors and create lasting relationships through sustainable exchanges.
          </p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
