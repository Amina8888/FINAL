import React, { useEffect, useState } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  Event as CalendarEvent,
} from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '@/contexts/AuthContext';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event extends CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const CalendarPage: React.FC = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await fetch('http://localhost:5085/api/consultant/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch consultations');

        const data = await res.json();

        const calendarEvents: Event[] = data.upcomingConsultations.map((item: any) => {
          const start = new Date(`${item.date} ${item.time}`);
          const end = new Date(start.getTime() + 30 * 60 * 1000); // +30 min

          return {
            id: item.id,
            title: `${item.topic} (${item.clientName})`,
            start,
            end,
          };
        });

        setEvents(calendarEvents);
      } catch (error) {
        console.error('Error loading calendar events:', error);
      }
    };

    fetchConsultations();
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Consultation Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        defaultView="week"
      />
    </div>
  );
};

export default CalendarPage;
