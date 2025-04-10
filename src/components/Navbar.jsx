import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Object Detector</h1>
      <ul className="flex gap-6">
        <li><a href="#" className="hover:text-gray-400">Home</a></li>
        <li><a href="#" className="hover:text-gray-400">Upload</a></li>
        <li><a href="#" className="hover:text-gray-400">About</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
