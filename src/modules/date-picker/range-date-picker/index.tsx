import { DateTimeFormatter, LocalDate } from "@js-joda/core";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useStateRef } from "../../../components/hooks";
import { CalendarRef, RangeCalendar } from "./calendar";
import { DateInput, DateInputRef } from "./date-input";
import { Locale } from "@js-joda/locale_en";

const INVALID_DATE = "invalid_date";
type InvalidDate = typeof INVALID_DATE;

const formatter = DateTimeFormatter.ofPattern("uuuu-MM-dd").withLocale(Locale.ENGLISH);

interface RangeDatePickerProps {
  start?: string;
  end?: string;
  disabled?: boolean;
  withButtons?: boolean;
  onChange?: (s: string, e: string) => void;
}

export const RangeDatePicker = ({
  start,
  end,
  disabled = false,
  withButtons = false,
  onChange,
}: RangeDatePickerProps) => {
  const [actualStartDate, setActualStartDate] = useState<LocalDate | null>(null);
  const [actualEndDate, setActualEndDate] = useState<LocalDate | null>(null);
  const [startDate, setStartDate, startDateRef] = useStateRef<LocalDate | InvalidDate | null>(null);
  const [endDate, setEndDate, endDateRef] = useStateRef<LocalDate | InvalidDate | null>(null);
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
    if (start === startDate) {
      return;
    }
    if (start === INVALID_DATE) {
      setStartDate(null);
    } else if (start) {
      const val = LocalDate.parse(start);
      if (!startDate || startDate === INVALID_DATE || !val.isEqual(startDate)) {
        setStartDate(val);
        if (withButtons) {
          setActualStartDate(val);
        }
      }
    } else {
      setStartDate(null);
    }
  }, [start]);

  useEffect(() => {
    if (end === endDate) {
      return;
    }
    if (end === INVALID_DATE) {
      setEndDate(null);
    } else if (end) {
      const val = LocalDate.parse(end);
      if (!endDate || endDate === INVALID_DATE || !val.isEqual(endDate)) {
        setEndDate(val);
        if (withButtons) {
          setActualEndDate(val);
        }
      }
    } else {
      setEndDate(null);
    }
  }, [end]);

  useEffect(() => {}, [end]);

  useEffect(() => {
    if (open) {
      setHasSelectedStart(false);
      setHasSelectedEnd(false);
    }
  }, [open]);

  const performOnChangeHandler = (start: LocalDate | null | string, end: LocalDate | null | string) => {
    const startStr = typeof start === "string" ? start : !start ? "" : start.format(formatter);
    const endStr = typeof end === "string" ? end : !end ? "" : end.format(formatter);
    onChange?.(startStr, endStr);
  };

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
        if (startDateInputRef.current?.ref.current?.contains(e.target) && startDate && startDate !== INVALID_DATE) {
          calendarRef.current?.updateFocusedDate(startDate);
        } else if (endDateInputRef.current?.ref.current?.contains(e.target) && endDate && endDate !== INVALID_DATE) {
          calendarRef.current?.updateFocusedDate(endDate);
        }
        setOpen(true);
      }}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget)) {
          setOpen(false);
          setFocus(null);
          if (withButtons || !startDate || !endDate || startDate === INVALID_DATE || endDate === INVALID_DATE) {
            setStartDate(actualStartDate);
            setEndDate(actualEndDate);
            performOnChangeHandler(actualStartDate, actualEndDate);
          } else {
            setActualStartDate(startDate);
            setActualEndDate(endDate);
            performOnChangeHandler(startDate, endDate);
          }
        }
        // if (
        //   startDateInputRef.current?.ref.current?.contains(e.target) &&
        //   endDateInputRef.current?.ref.current?.contains(e.relatedTarget)
        // ) {
        //   if (startDate === INVALID_DATE && actualStartDate) {
        //     calendarRef.current?.updateFocusedDate(actualStartDate);
        //   }
        // }
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
            // if (val === INVALID_DATE) {
            //   startDateInputRef.current?.setValue(startDate);
            //   performOnChangeHandler(INVALID_DATE, endDateRef.current);
            // } else {
            //   if (!startDate || !val.isEqual(startDate)) {
            //     setHasSelectedStart(true);
            //   }
            //   setStartDate(val);
            //   if (endDate && val.isAfter(endDate)) {
            //     setEndDate(null);
            //   }
            //   calendarRef.current?.updateFocusedDate(val);
            //   performOnChangeHandler(val, endDateRef.current);
            // }
          }}
          onChangeRaw={(d, m, y) => {
            if (d && m && y.length === 4) {
              try {
                const val = LocalDate.of(parseInt(y), parseInt(m), parseInt(d));
                if (!startDate || startDate === INVALID_DATE || !val.isEqual(startDate)) {
                  setHasSelectedStart(true);
                }
                setStartDate(val);
                if (endDate && endDate !== INVALID_DATE && val.isAfter(endDate)) {
                  setEndDate(null);
                }
                calendarRef.current?.updateFocusedDate(val);
                performOnChangeHandler(val, endDate);
              } catch (err) {
                setStartDate(INVALID_DATE);
                performOnChangeHandler(INVALID_DATE, endDate);
              }
            } else if (!d && !m && !y) {
              setStartDate(INVALID_DATE);
              performOnChangeHandler("", endDate);
            } else {
              setStartDate(INVALID_DATE);
              performOnChangeHandler(INVALID_DATE, endDate);
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
            // if (val === INVALID_DATE) {
            //   endDateInputRef.current?.setValue(endDate);
            //   performOnChangeHandler(startDate, INVALID_DATE);
            // } else {
            //   if (!endDate || !val.isEqual(endDate)) {
            //     setHasSelectedEnd(true);
            //   }
            //   setEndDate(val);
            //   if (startDate && val.isBefore(startDate)) {
            //     setStartDate(null);
            //   }
            //   calendarRef.current?.updateFocusedDate(val);
            //   performOnChangeHandler(startDateRef.current, val);
            // }
          }}
          onChangeRaw={(d, m, y) => {
            if (d && m && y.length === 4) {
              try {
                const val = LocalDate.of(parseInt(y), parseInt(m), parseInt(d));
                if (!endDate || endDate === INVALID_DATE || !val.isEqual(endDate)) {
                  setHasSelectedEnd(true);
                }
                setEndDate(val);
                if (startDate && startDate !== INVALID_DATE && val.isBefore(startDate)) {
                  setStartDate(null);
                }
                calendarRef.current?.updateFocusedDate(val);
                performOnChangeHandler(startDate, val);
              } catch (err) {
                setEndDate(INVALID_DATE);
                performOnChangeHandler(startDate, INVALID_DATE);
              }
            } else if (!d && !m && !y) {
              setEndDate(INVALID_DATE);
              performOnChangeHandler(startDate, "");
            } else {
              setEndDate(INVALID_DATE);
              performOnChangeHandler(startDate, INVALID_DATE);
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
            } else if (focus === "end") {
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
            setOpen(false);
            setFocus(null);
          }}
          onConfirm={() => {
            if (startDate !== INVALID_DATE) {
              setActualStartDate(startDate);
            }
            if (endDate !== INVALID_DATE) {
              setActualEndDate(endDate);
            }
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
