import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { MessageSquare, HelpCircle } from 'lucide-react';

const HelpSupport = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const faqs = [
    {
      question: 'How long can I borrow a book?',
      answer: 'Books can be borrowed for up to 10 days.',
    },
    {
      question: 'What should I do if the book is not available?',
      answer: 'If the book is not available, then you can reserve the book by sending a request to the admin.',
    },
    {
      question: 'How do I check my book status?',
      answer: 'You can see the status of the book requests in the users book history.',
    },
    {
      question: 'How do I confirm whether the book borrow request is accepted or not?',
      answer: 'If the book is added into the users borrowed books section then the book borrowal is successful.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Help & Support</h1>

        <div className="grid gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <HelpCircle className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div> 
        </div>
        <div className='pt-10'>
        <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <HelpCircle className="w-6 h-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold">Need Further Assistance?</h2>
        </div>
        <p className="text-gray-700 ">
          For any queries or additional help, feel free to contact the admin via email:  <a href="surajbankupalli@gmail.com" className="hover:underline text-indigo-600 font-medium mt-2">
            surajbankupalli@gmail.com
          </a>
        </p>
  
      </div>
      </div>
      </div>
    </div>
  );
};

export default HelpSupport;