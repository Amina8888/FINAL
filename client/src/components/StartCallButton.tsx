import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { VideoIcon } from 'lucide-react';

interface StartCallButtonProps {
  roomId: string;
  label?: string;
  variant?: "default" | "ghost" | "outline";
}

const StartCallButton: React.FC<StartCallButtonProps> = ({ roomId, label, variant = "ghost" }) => {
  const [open, setOpen] = useState(false);

  const startCall = () => {
    setOpen(false);
    window.open(`/video/${roomId}`, '_blank', 'width=800,height=600');
  };

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)} className="flex items-center gap-2">
        {label ? (
          <>
            <VideoIcon className="w-4 h-4" />
            {label}
          </>
        ) : (
          <VideoIcon className="w-5 h-5" />
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Video Call</DialogTitle>
          </DialogHeader>
          <p>Do you want to start a video call?</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={startCall} className="bg-green-600 text-white hover:bg-green-700">Start Call</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StartCallButton;
