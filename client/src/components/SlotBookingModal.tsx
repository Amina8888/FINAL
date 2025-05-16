import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
}

interface SlotBookingModalProps {
  open: boolean;
  slots: Slot[];
  onClose: () => void;
  onBook: (slotId: string) => void;
}

const SlotBookingModal: React.FC<SlotBookingModalProps> = ({ open, slots, onClose, onBook }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Time Slot</DialogTitle>
        </DialogHeader>

        {slots.length === 0 ? (
          <p className="text-sm text-gray-600">No available slots</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {slots.map((slot) => (
              <div key={slot.id} className="flex justify-between items-center border px-3 py-2 rounded">
                <span className="text-sm">
                  {new Date(slot.startTime).toLocaleString()} — {new Date(slot.endTime).toLocaleTimeString()}
                </span>
                <Button size="sm" onClick={() => onBook(slot.id)}>Book</Button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlotBookingModal;
