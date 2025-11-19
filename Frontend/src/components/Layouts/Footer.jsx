import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold">SavoryNotes</span>
            </div>
            <p className="text-gray-400">Your AI-powered cooking companion</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Recipes</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/recipes" className="hover:text-white">
                  Browse All
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 SavoryNotes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
