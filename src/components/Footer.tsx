import React from "react";
import { Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Gratitude. All rights reserved.
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
