import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from './ui/button';
import { Label } from './ui/label';

interface SlotBookingModalProps {
  open: boolean;
  onClose: () => void;
  onBook: (datetime: Date, topic: string) => void;
}

const SlotBookingModal: React.FC<SlotBookingModalProps> = ({ open, onClose, onBook }) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [topic, setTopic] = useState('');

  const handleConfirm = () => {
    if (!selectedDateTime) {
      alert("Please select a date and time");
      return;
    }

    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    onBook(selectedDateTime, topic);
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-md">
        <Dialog.Title className="text-lg font-semibold mb-4">Book Consultation</Dialog.Title>

        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Select Date and Time</Label>
            <DatePicker
              selected={selectedDateTime}
              onChange={(date: Date | null) => setSelectedDateTime(date)}
              showTimeSelect
              timeIntervals={30}
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              className="w-full border px-3 py-2 rounded-md"
              placeholderText="Choose date and time"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">Topic</Label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md"
              placeholder="e.g. Legal advice, Project review"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-green-600 text-white hover:bg-green-700 mt-4"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default SlotBookingModal;
