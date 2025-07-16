'use client';
import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">Contact Information</h1>
      
      {/* Company Information */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mb-12">
        <h2 className="text-2xl font-semibold mb-8 text-gray-800">Company Details</h2>
        
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <FaMapMarkerAlt className="text-blue-600 text-2xl mt-1" />
            <div>
              <h3 className="font-medium text-lg mb-2 text-gray-800">Address</h3>
              <p className="text-gray-600">Levent Plaza</p>
              <p className="text-gray-600">Buyukdere Street No: 193</p>
              <p className="text-gray-600">34394 Levent, Istanbul</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <FaPhone className="text-blue-600 text-2xl mt-1" />
            <div>
              <h3 className="font-medium text-lg mb-2 text-gray-800">Phone</h3>
              <p className="text-gray-600">+90 (212) 555 0000</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <FaEnvelope className="text-blue-600 text-2xl mt-1" />
            <div>
              <h3 className="font-medium text-lg mb-2 text-gray-800">Email</h3>
              <p className="text-gray-600">info@ecommerce.com</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <FaClock className="text-blue-600 text-2xl mt-1" />
            <div>
              <h3 className="font-medium text-lg mb-2 text-gray-800">Business Hours</h3>
              <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Location</h2>
        <div className="bg-gray-100 w-full h-[400px] rounded-xl flex items-center justify-center shadow-lg">
          <p className="text-gray-500 text-lg">Map will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 