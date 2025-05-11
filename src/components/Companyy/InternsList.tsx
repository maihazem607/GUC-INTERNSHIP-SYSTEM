import { useState } from 'react';
import styles from './InternsList.module.css';

// Mock intern data type
const InternType = {
  current: 'current',
  completed: 'completed'
};

// Sample intern for demonstration
const sampleIntern = {
  id: '2',
  name: 'Jane Smith',
  email: 'jane@university.edu',
  university: 'SCAD',
  major: 'Interactive Design',
  internshipTitle: 'Frontend Developer Intern',
  startDate: new Date('2023-06-01'),
  endDate: new Date('2023-08-31'),
  status: 'current',
};

// Main component
const InternsList = () => {
  const [intern, setIntern] = useState({...sampleIntern});
  
  // Toggle status handler
  const handleStatusChange = () => {
    setIntern(prev => ({
      ...prev,
      status: prev.status === 'current' ? 'completed' : 'current'
    }));
  };
  
  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full border-collapse">
        <tbody>
          <tr className="hover:bg-blue-50 cursor-pointer border-b border-gray-100">
            {/* Profile Column */}
            <td className="py-4 pl-4 pr-2 w-64">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                  {intern.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <div className="font-medium text-gray-800">{intern.name}</div>
                  <div className="text-sm text-gray-500">{intern.email}</div>
                </div>
              </div>
            </td>
            
            {/* Internship Title */}
            <td className="py-4 px-2 w-48">
              <div className="font-medium text-gray-800">
                {intern.internshipTitle}
              </div>
            </td>
            
            {/* University & Major */}
            <td className="py-4 px-2 w-48">
              <div className="text-sm">
                <div className="text-gray-800">{intern.university}</div>
                <div className="inline-block px-2 py-1 mt-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {intern.major}
                </div>
              </div>
            </td>
            
            {/* Date Range */}
            <td className="py-4 px-2 w-48">
              <div className="text-sm text-gray-700">
                {new Date(intern.startDate).toLocaleDateString()} - {
                  intern.endDate 
                    ? new Date(intern.endDate).toLocaleDateString() 
                    : 'Present'
                }
              </div>
            </td>
            
            {/* Status Dropdown */}
            <td className="py-4 px-2 w-32">
              <select
                className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${intern.status === 'current' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}
                value={intern.status}
                onChange={handleStatusChange}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="current">CURRENT</option>
                <option value="completed">COMPLETED</option>
              </select>
            </td>
            
            {/* Actions */}
            <td className="py-4 px-4">
              {intern.status === 'current' ? (
                <button 
                  className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange();
                  }}
                >
                  Mark Complete
                </button>
              ) : (
                <button 
                  className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  Evaluate
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InternsList;