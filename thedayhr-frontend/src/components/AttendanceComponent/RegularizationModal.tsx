import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axiosInstance';
import "./ModalCSS.css"
import { Clock } from 'lucide-react';

interface RegularizationModalProps {
    isOpen: boolean;
    date: string;
    clockIn: string | null;
    onClose: () => void;
}

const RegularizationModal: React.FC<RegularizationModalProps> = ({ isOpen, date, clockIn, onClose }) => {
    const [showTimeInput, setShowTimeInput] = useState(false);

    useEffect(() => {
        // Prevent scrolling when modal is open
        if (isOpen) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "auto";
        }
    
        return () => {
          document.body.style.overflow = "auto";
        };
      }, [isOpen]);
    const [formData, setFormData] = useState({
        clockOutTime: "",
        note: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRequestRegularize = async () => {
        const { clockOutTime, note } = formData;

        if (!clockOutTime || !note){
            setError("Both clock-out time and note are required.");
            return;
        }

        setLoading(true);
        setError("");

        try{
            const response = await apiClient.post(
                "attendance/regularize/",
                {
                    date: date,
                    clock_out_time: clockOutTime,
                    note: note
                },
                { withCredentials: true }
            )
            console.log("attendance regularise response: ",response)
            
        }catch(error){
            setLoading(false);
            setError("Something went wrong. Please try again.")
        }
    };

    return (
        // <div className={`modal-container ${isOpen ? 'open' : ''}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity">
          {/* Modal Container */}
          <div
            className={`fixed right-0 top-0 h-full w-[40%] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} z-50 pt-16`}
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <h2 className="text-xl font-semibold text-gray-800">
                Request Attendance Regularization
              </h2>
              {/* Selected Date */}
              <div className="mt-4">
                <p className="text-sm text-gray-600">Selected Date</p>
                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                  {date}
                </div>
              </div>
              {/* Clock In/Out Section */}
              <div className="mt-6 flex justify-between">
                <div>
                  <label className="block text-sm text-gray-600">
                    Clock-in
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span>{clockIn}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600">
                    Clock-out
                  </label>
                  <div className="mt-1">
                    {showTimeInput ? (
                      <input
                        type="time"
                        name="clockOutTime"
                        value={formData.clockOutTime}
                        onChange={handleInputChange}
                        className="border rounded-md p-1"
                      />
                    ) : (
                      <button
                        onClick={() => setShowTimeInput(true)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm"
                      >
                        Missing
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {/* Notes Section */}
              <div className="mt-6">
                <label className="block text-sm text-gray-600">Note</label>
                <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                  rows={4}
                  className="mt-1 w-full border rounded-md p-2 text-sm"
                  placeholder="Enter your note here..."
                />
              </div>
              {/* Action Buttons */}
              <div className="mt-auto flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRequestRegularize}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Request
                </button>
              </div>
            </div>
        {/* </div> */}
        </div>
        </div>
    );
};

export default RegularizationModal;