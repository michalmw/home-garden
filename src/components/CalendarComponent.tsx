"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css"; // Import our custom styles

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarComponentProps {
  value: Value;
  onChange: (value: Value) => void;
  tileContent: (props: { date: Date; view: string }) => JSX.Element | null;
  className?: string;
}

export default function CalendarComponent({
  value,
  onChange,
  tileContent,
  className = "",
}: CalendarComponentProps) {
  return (
    <Calendar
      onChange={onChange}
      value={value}
      locale="pl-PL"
      tileContent={tileContent}
      className={`w-full p-3 bg-white rounded-lg shadow-md ${className}`}
    />
  );
}
