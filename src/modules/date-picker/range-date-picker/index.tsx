import { LocalDate } from "@js-joda/core";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useStateRef } from "../../../components/hooks";
import { CalendarRef, RangeCalendar } from "./calendar";
import { DateInput, DateInputRef } from "./date-input";

const INVALID_DATE = "invalid_date";

interface RangeDatePickerProps {
  disabled?: boolean;
  withButtons?: boolean;
}

export const RangeDatePicker = ({ disabled = false, withButtons = false }: RangeDatePickerProps) => {
  const [actualStartDate, setActualStartDate] = useState<LocalDate | null>(null);
  const [actualEndDate, setActualEndDate] = useState<LocalDate | null>(null);
  const [startDate, setStartDate] = useState<LocalDate | null>(null);
  const [endDate, setEndDate] = useState<LocalDate | null>(null);
  const [hoverDate, setHoverDate] = useState<LocalDate | null>(null);
  const [focus, setFocus, focusRef] = useStateRef<"start" | "end" | null>(null);
  const [open, setOpen] = useState(false);
  const [hasSelectedStart, setHasSelectedStart, hasSelectedStartRef] = useStateRef(false);
  const [hasSelectedEnd, setHasSelectedEnd, hasSelectedEndRef] = useStateRef(false);
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
      tabIndex={disabled ? undefined : -1}
      $disabled={disabled}
      onFocus={(e) => {
        if (open) {
          return;
        }
        if (e.target === wrapperRef.current) {
          setFocus("start");
        }
        if (startDateInputRef.current?.ref.current?.contains(e.target) && startDate) {
          calendarRef.current?.updateFocusedDate(startDate);
        } else if (endDateInputRef.current?.ref.current?.contains(e.target) && endDate) {
          calendarRef.current?.updateFocusedDate(endDate);
        }
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget)) {
          setOpen(false);
          setFocus(null);
          if (withButtons) {
            setStartDate(actualStartDate);
            setEndDate(actualEndDate);
          } else {
            setActualStartDate(startDate);
            setActualEndDate(endDate);
          }
        }
      }}
      onKeyDown={(e) => {
        switch (e.key) {
          case "Escape":
            if (wrapperRef.current?.contains(document.activeElement)) {
              (document.activeElement as any).blur?.();
            }
            break;
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
          disabled={disabled}
          label="Start date"
          onFocus={() => {
            setFocus("start");
          }}
          onChange={(val) => {
            if (val === INVALID_DATE) {
              startDateInputRef.current?.setValue(startDate);
            } else {
              if (!startDate || !val.isEqual(startDate)) {
                setHasSelectedStart(true);
              }
              setStartDate(val);
              if (endDate && val.isAfter(endDate)) {
                setEndDate(null);
              }
              calendarRef.current?.updateFocusedDate(val);
            }
          }}
          onYearBlur={() => {
            if (!(hasSelectedStartRef.current && hasSelectedEndRef.current)) {
              setFocus("end");
            }
          }}
          onArrow={() => {
            calendarRef.current?.focus();
          }}
        />
        <Separator>→</Separator>
        <DateInput
          ref={endDateInputRef}
          focused={focus === "end"}
          value={endDate}
          hoverDate={focus === "end" ? hoverDate : null}
          placeholder="To"
          disabled={disabled}
          label="End date"
          onFocus={() => {
            setFocus("end");
          }}
          onChange={(val) => {
            if (val === INVALID_DATE) {
              endDateInputRef.current?.setValue(endDate);
            } else {
              if (!endDate || !val.isEqual(endDate)) {
                setHasSelectedEnd(true);
              }
              setEndDate(val);
              if (startDate && val.isBefore(startDate)) {
                setStartDate(null);
              }
              calendarRef.current?.updateFocusedDate(val);
            }
          }}
          onYearBlur={() => {
            if (!(hasSelectedStartRef.current && hasSelectedEndRef.current)) {
              setFocus("start");
            }
          }}
          onArrow={() => {
            calendarRef.current?.focus();
          }}
        />
      </Picker>
      <CalendarWrapper $open={open}>
        <RangeCalendar
          ref={calendarRef}
          currentFocus={focus!}
          startDate={startDate}
          endDate={endDate}
          withButtons={withButtons}
          selectAny={!hasSelectedStart && !hasSelectedEnd}
          onChange={(start, end) => {
            if (focus === "start") {
              setHasSelectedStart(true);
              if (!(hasSelectedStartRef.current && hasSelectedEndRef.current)) {
                setFocus("end");
              }
              setStartDate(start);
              if (!withButtons) {
                setActualStartDate(start);
              }
            } else if (focus === "end") {
              setHasSelectedEnd(true);
              if (!(hasSelectedStartRef.current && hasSelectedEndRef.current)) {
                setFocus("start");
              }
              setEndDate(end);
              if (!withButtons) {
                setActualEndDate(end);
              }
            }
          }}
          onHover={(hover) => {
            setHoverDate(hover);
          }}
          onCancel={() => {
            setStartDate(actualStartDate);
            setEndDate(actualEndDate);
            setOpen(false);
            setFocus(null);
          }}
          onConfirm={() => {
            setActualStartDate(startDate);
            setActualEndDate(endDate);
            setOpen(false);
            setFocus(null);
          }}
        />
      </CalendarWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ $focused?: boolean; $disabled?: boolean }>`
  width: fit-content;
  position: relative;
  border: 1px solid black;
  border-radius: 3px;
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.$disabled ? "#eee" : "#fff")};

  ${(props) => props.$focused && "box-shadow: 0 0 1px 1px #fab;"}
  :focus-within {
    box-shadow: 0 0 1px 1px #fab;
  }
`;

const CalendarWrapper = styled.div<{ $open: boolean }>`
  ${(props) => !props.$open && "display: none;"}
  position: absolute;
  top: calc(100% + 1rem);
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 2px 3px #0001;
  padding: 0.5rem;
  z-index: 1;
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
