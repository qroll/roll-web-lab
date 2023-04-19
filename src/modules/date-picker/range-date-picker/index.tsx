import { LocalDate } from "@js-joda/core";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CalendarRef, RangeCalendar } from "./calendar";
import { DateInput, DateInputRef } from "./date-input";
import { useStateRef } from "./use-state-ref";

const INVALID_DATE = "invalid_date";

export const RangeDatePicker = () => {
  const [actualStartDate, setActualStartDate] = useState<LocalDate | null>(null);
  const [actualEndDate, setActualEndDate] = useState<LocalDate | null>(null);
  const [startDate, setStartDate] = useState<LocalDate | null>(null);
  const [endDate, setEndDate] = useState<LocalDate | null>(null);
  const [hoverDate, setHoverDate] = useState<LocalDate | null>(null);
  const [focus, setFocus] = useState<"start" | "end" | null>(null);
  const [open, setOpen] = useState(false);
  const [, setHasSelectedStart, hasSelectedStartRef] = useStateRef(false);
  const [, setHasSelectedEnd, hasSelectedEndRef] = useStateRef(false);
  const startDateInputRef = useRef<DateInputRef>(null);
  const endDateInputRef = useRef<DateInputRef>(null);
  const calendarRef = useRef<CalendarRef>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setHasSelectedStart(false);
      setHasSelectedEnd(false);
    }
  }, [open]);

  return (
    <Wrapper
      ref={wrapperRef}
      tabIndex={-1}
      onFocus={(e) => {
        if (document.activeElement === wrapperRef.current) {
          setFocus("start");
        }
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget)) {
          setOpen(false);
          setFocus(null);
          setStartDate(actualStartDate);
          setEndDate(actualEndDate);
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
          onFocus={() => {
            setFocus("start");
            if (startDate) {
              calendarRef.current?.updateFocusedDate(startDate);
            }
          }}
          onChange={(val) => {
            if (val === INVALID_DATE) {
              startDateInputRef.current?.setValue(startDate);
            } else {
              setStartDate(val);
              setHasSelectedStart(true);
              if (endDate && val.isAfter(endDate)) {
                setEndDate(null);
              }
              if (!(hasSelectedStartRef.current && hasSelectedEndRef.current)) {
                setFocus("end");
              }
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
          onFocus={() => {
            setFocus("end");
            if (endDate) {
              calendarRef.current?.updateFocusedDate(endDate);
            }
          }}
          onChange={(val) => {
            if (val === INVALID_DATE) {
              endDateInputRef.current?.setValue(endDate);
            } else {
              setEndDate(val);
              setHasSelectedEnd(true);
              if (startDate && val.isBefore(startDate)) {
                setStartDate(null);
              }
              if (!(hasSelectedStartRef.current && hasSelectedEndRef.current)) {
                setFocus("start");
              }
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
                setHasSelectedStart(true);
                if (!(hasSelectedStartRef.current && hasSelectedEndRef.current)) {
                  setFocus("end");
                }
                setStartDate(start);
              } else {
                setHasSelectedEnd(true);
                if (!(hasSelectedStartRef.current && hasSelectedEndRef.current)) {
                  setFocus("start");
                }
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
              setOpen(false);
              setFocus(null);
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
