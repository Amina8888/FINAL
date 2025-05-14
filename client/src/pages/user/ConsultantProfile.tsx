import React from 'react';
import { StarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/solid';
import { Button } from '../../components/ui/button';

const ConsultantProfile: React.FC = () => {
  // Mock data for the consultant
  const consultant = {
    name: "Dr. Jane Smith",
    specialization: "Financial Advisor",
    rating: 4.8,
    reviewCount: 124,
    hourlyRate: 150,
    experience: 15,
    bio: "Dr. Jane Smith is a certified financial advisor with over 15 years of experience in personal and corporate finance. She specializes in investment strategies, retirement planning, and tax optimization.",
    education: [
      "Ph.D. in Economics, Stanford University",
      "MBA, Harvard Business School",
      "B.Sc. in Finance, University of Pennsylvania"
    ],
    certifications: [
      "Certified Financial Planner (CFP)",
      "Chartered Financial Analyst (CFA)"
    ],
    reviews: [
      { id: 1, author: "John D.", rating: 5, comment: "Dr. Smith provided excellent insights for my retirement planning. Highly recommended!" },
      { id: 2, author: "Sarah M.", rating: 4, comment: "Very knowledgeable and professional. Helped me understand complex investment strategies." }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt={consultant.name} />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{consultant.specialization}</div>
            <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">{consultant.name}</h1>
            <div className="mt-2 flex items-center">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1 text-gray-600">{consultant.rating} ({consultant.reviewCount} reviews)</span>
            </div>
            <p className="mt-2 text-gray-500">
              <span className="font-semibold">${consultant.hourlyRate}</span> / hour
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500">{consultant.bio}</p>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Experience & Education</h2>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">Experience</h3>
            <p className="mt-1 text-gray-600">{consultant.experience} years in financial advisory</p>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">Education</h3>
            <ul className="mt-1 list-disc list-inside text-gray-600">
              {consultant.education.map((edu, index) => (
                <li key={index}>{edu}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
            <ul className="mt-1 list-disc list-inside text-gray-600">
              {consultant.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
          {consultant.reviews.map((review) => (
            <div key={review.id} className="mt-6 border-t border-gray-100 pt-6">
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="ml-1 text-gray-600">{review.rating}</span>
                <span className="ml-4 text-gray-900">{review.author}</span>
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>

        <div className="px-8 py-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Book a Consultation</h2>
          <p className="mt-2 text-gray-600">Ready to get expert advice? Book a consultation with {consultant.name} now.</p>
          <div className="mt-4 flex space-x-4">
            <Button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Check Availability
            </Button>
            <Button className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700">
              <ClockIcon className="h-5 w-5 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantProfile;
