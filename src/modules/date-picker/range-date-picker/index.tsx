import { LocalDate } from "@js-joda/core";
import { useRef, useState } from "react";
import styled from "styled-components";
import { CalendarRef, RangeCalendar } from "./calendar";
import { DateInput, DateInputRef } from "./date-input";

const INVALID_DATE = "invalid_date";

export const RangeDatePicker = () => {
  const [actualStartDate, setActualStartDate] = useState<LocalDate | null>(null);
  const [actualEndDate, setActualEndDate] = useState<LocalDate | null>(null);
  const [startDate, setStartDate] = useState<LocalDate | null>(null);
  const [endDate, setEndDate] = useState<LocalDate | null>(null);
  const [hoverDate, setHoverDate] = useState<LocalDate | null>(null);
  const [focus, setFocus] = useState<"start" | "end" | null>(null);
  const [open, setOpen] = useState(false);
  const startDateInputRef = useRef<DateInputRef>(null);
  const endDateInputRef = useRef<DateInputRef>(null);
  const calendarRef = useRef<CalendarRef>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <Wrapper
      ref={wrapperRef}
      tabIndex={-1}
      onFocus={() => {
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget)) {
          setOpen(false);
          setFocus(null);
        }
      }}
    >
      <Picker>
        <DateInput
          ref={startDateInputRef}
          focused={focus === "start"}
          value={startDate}
          hoverDate={focus === "start" ? hoverDate : null}
          placeholder="From"
          onFocus={() => setFocus("start")}
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
        <Separator>→</Separator>
        <DateInput
          ref={endDateInputRef}
          focused={focus === "end"}
          value={endDate}
          hoverDate={focus === "end" ? hoverDate : null}
          placeholder="To"
          onFocus={() => setFocus("end")}
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
      {open && (
        <CalendarWrapper>
          <RangeCalendar
            ref={calendarRef}
            currentFocus={focus!}
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
            onCancel={() => {
              setStartDate(actualStartDate);
              setEndDate(actualEndDate);
            }}
            onConfirm={() => {
              setActualStartDate(startDate);
              setActualEndDate(endDate);
            }}
          />
        </CalendarWrapper>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $focused?: boolean }>`
  width: fit-content;
  position: relative;
  border: 1px solid black;
  border-radius: 3px;
  display: flex;
  align-items: center;
  background-color: #fff;

  ${(props) => props.$focused && "box-shadow: 0 0 1px 1px #fab;"}
  :focus-within {
    box-shadow: 0 0 1px 1px #fab;
  }
`;

const CalendarWrapper = styled.div`
  position: absolute;
  top: calc(100% + 1rem);
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 2px 3px #0001;
  padding: 0.5rem;
`;

const Picker = styled.div`
  display: flex;
`;

const Separator = styled.div`
  width: 1rem;
  display: flex;
  align-items: center;
  color: #888;
`;
