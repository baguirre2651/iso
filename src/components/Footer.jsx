import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center py-6">
      <p className="text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} In Search Of. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
