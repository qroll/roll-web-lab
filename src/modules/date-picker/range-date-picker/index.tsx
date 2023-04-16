import { LocalDate } from "@js-joda/core";
import { useRef, useState } from "react";
import styled from "styled-components";
import { CalendarRef, RangeCalendar } from "./calendar";
import { DateInput, DateInputRef } from "./date-input";

const INVALID_DATE = "invalid_date";

export const RangeDatePicker = () => {
  const [startDate, setStartDate] = useState<LocalDate | null>(null);
  const [endDate, setEndDate] = useState<LocalDate | null>(null);
  const [hoverDate, setHoverDate] = useState<LocalDate | null>(null);
  const [focus, setFocus] = useState<"start" | "end">("start");
  const startDateInputRef = useRef<DateInputRef>(null);
  const endDateInputRef = useRef<DateInputRef>(null);
  const calendarRef = useRef<CalendarRef>(null);

  return (
    <>
      <Picker>
        <DateInput
          ref={startDateInputRef}
          focused={focus === "start"}
          value={startDate}
          hoverDate={focus === "start" ? hoverDate : null}
          onChange={(val) => {
            if (val === INVALID_DATE) {
              startDateInputRef.current?.setValue(startDate);
            } else {
              setStartDate(val);
              if (endDate && val.isAfter(endDate)) {
                setEndDate(null);
              }
              setFocus("end");
              calendarRef.current?.updateFocusedDate(val);
            }
          }}
        />
        <Separator />
        <DateInput
          ref={endDateInputRef}
          focused={focus === "end"}
          value={endDate}
          hoverDate={focus === "end" ? hoverDate : null}
          onChange={(val) => {
            if (val === INVALID_DATE) {
              endDateInputRef.current?.setValue(endDate);
            } else {
              setEndDate(val);
              if (startDate && val.isBefore(startDate)) {
                setStartDate(null);
              }
              setFocus("start");
              calendarRef.current?.updateFocusedDate(val);
            }
          }}
        />
      </Picker>
      <RangeCalendar
        ref={calendarRef}
        currentFocus={focus}
        startDate={startDate}
        endDate={endDate}
        onChange={(start, end) => {
          if (focus === "start") {
            setFocus("end");
            setStartDate(start);
          } else {
            setFocus("start");
            setEndDate(end);
          }
        }}
        onHover={(hover) => {
          setHoverDate(hover);
        }}
      />
    </>
  );
};

const Picker = styled.div`
  display: flex;
`;

const Separator = styled.div`
  width: 1rem;
`;
