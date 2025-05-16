import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newDate: string) => void;
  defaultDate: string;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ open, onClose, onSubmit, defaultDate }) => {
  const [newDate, setNewDate] = useState(defaultDate);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reschedule Consultation</DialogTitle>
        </DialogHeader>
        <Input
          type="datetime-local"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit(newDate)}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface CancelModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelModal: React.FC<CancelModalProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Consultation</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">Are you sure you want to cancel this consultation?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>No</Button>
          <Button variant="destructive" onClick={onConfirm}>Yes, Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block text-sm font-medium">Rating (1 to 5)</label>
          <Input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
          <Textarea
            placeholder="Write your feedback..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSubmit(rating, comment)}>Submit Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

