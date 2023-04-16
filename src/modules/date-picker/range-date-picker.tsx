import React from "react";
import { DayOfWeek, LocalDate, DateTimeFormatter } from "@js-joda/core";
import "@js-joda/timezone";
import { Locale } from "@js-joda/locale_en";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import styled from "styled-components";

const INPUT_FORMAT = "dd-MM-YYYY";
const INVALID_DATE = "invalid_date";

interface DateInputProps {
  focused: boolean;
  value: LocalDate | null;
  hoverDate?: LocalDate | null;
  onChange: (val: LocalDate | typeof INVALID_DATE) => void;
}

interface DateInputRef {
  setValue: (val: LocalDate | null) => void;
}

const DateInputComponent: React.ForwardRefRenderFunction<DateInputRef, DateInputProps> = (
  { focused, value, hoverDate, onChange },
  ref
) => {
  const [day, setDay] = useStateRef<string>("");
  const [month, setMonth] = useStateRef<string>("");
  const [year, setYear] = useStateRef<string>("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const updateStateFromValue = (val: LocalDate | null) => {
    if (value) {
      setDay(value.dayOfMonth().toString().padStart(2, "0"));
      setMonth(value.monthValue().toString().padStart(2, "0"));
      setYear(value.year().toString());
    } else {
      setDay("");
      setMonth("");
      setYear("");
    }
  };

  useEffect(() => {
    updateStateFromValue(value);
  }, [value]);

  useImperativeHandle(ref, () => {
    return {
      setValue(value: LocalDate | null) {
        updateStateFromValue(value);
      },
    };
  });

  return (
    <InputWrapper
      ref={wrapperRef}
      $focused={focused}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget)) {
          try {
            const date = LocalDate.of(parseInt(year), parseInt(month), parseInt(day));
            onChange(date);
          } catch (err) {
            onChange(INVALID_DATE);
          }
        }
      }}
    >
      <Input
        name="day"
        $hoverStyle={!!hoverDate}
        value={hoverDate ? hoverDate.dayOfMonth().toString().padStart(2, "0") : day}
        onChange={(e) => {
          setDay(e.target.value);
        }}
        maxLength={2}
        onBlur={() => {
          if (day.length === 1) {
            setDay(day.padStart(2, "0"));
          }
        }}
      />
      <>/</>
      <Input
        name="month"
        $hoverStyle={!!hoverDate}
        value={hoverDate ? hoverDate.monthValue().toString().padStart(2, "0") : month}
        onChange={(e) => {
          setMonth(e.target.value);
        }}
        maxLength={2}
        onBlur={() => {
          if (month.length === 1) {
            setMonth(month.padStart(2, "0"));
          }
        }}
      />
      <>/</>
      <YearInput
        name="year"
        $hoverStyle={!!hoverDate}
        value={hoverDate ? hoverDate.year() : year}
        onChange={(e) => {
          setYear(e.target.value);
        }}
        maxLength={4}
      />
    </InputWrapper>
  );
};

const DateInput = forwardRef(DateInputComponent);

export const RangeDatePicker = () => {
  const [startDate, setStartDate] = useState<LocalDate | null>(null);
  const [endDate, setEndDate] = useState<LocalDate | null>(null);
  const [hoverDate, setHoverDate] = useState<LocalDate | null>(null);
  const [focus, setFocus] = useState<"start" | "end">("start");
  const startDateInputRef = useRef<DateInputRef>(null);
  const endDateInputRef = useRef<DateInputRef>(null);

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
            }
          }}
        />
      </Picker>
      <RangeCalendar
        currentFocus={focus}
        startDate={startDate}
        endDate={endDate}
        onChange={(start, end) => {
          if (focus === "start") {
            setFocus("end");
            if (endDate) {
              setEndDate(null);
            }
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

interface RangeCalendarProps {
  currentFocus: "start" | "end";
  startDate: LocalDate | null;
  endDate: LocalDate | null;
  onChange?: (start: LocalDate | null, end: LocalDate | null) => void;
  onHover?: (hover: LocalDate | null) => void;
}

const useStateRef = <T,>(initialValue: T) => {
  const [val, setVal] = useState<T>(initialValue);
  const ref = useRef<T>(initialValue);

  const setter = useCallback((v: T) => {
    ref.current = v;
    setVal(v);
  }, []) as typeof setVal;

  return [val, setter, ref] as const;
};

export const RangeCalendar = ({ currentFocus, startDate, endDate, onChange, onHover }: RangeCalendarProps) => {
  const [selectedStartDate, setSelectedStartDate, selectedStartDateRef] = useStateRef<LocalDate | null>(startDate);
  const [selectedEndDate, setSelectedEndDate, selectedEndDateRef] = useStateRef<LocalDate | null>(endDate);
  const [focusedDate, setFocusedDate] = useState(LocalDate.now());
  const [hoveredDate, setHoveredDate] = useState<LocalDate | null>(null);
  const today = useMemo(() => LocalDate.now(), []);

  const days = useMemo(() => {
    const today = focusedDate.withDayOfMonth(1);
    const startOfWeek = today.with(DayOfWeek.MONDAY);
    const weeks: LocalDate[][] = [];
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        week.push(startOfWeek.plusDays(i * 7 + j));
      }
      weeks.push(week);
    }
    return weeks;
  }, [focusedDate]);

  useEffect(() => {
    setSelectedStartDate(startDate);
  }, [startDate]);

  useEffect(() => {
    setSelectedEndDate(endDate);
  }, [endDate]);

  return (
    <Grid
      role="grid"
      tabIndex={0}
      aria-activedescendant={focusedDate.toString()}
      onMouseLeave={() => {
        setHoveredDate(null);
        onHover?.(null);
      }}
      onKeyDown={(e) => {
        switch (e.key) {
          case "ArrowUp": {
            e.preventDefault();
            setFocusedDate(focusedDate.minusDays(7));
            break;
          }
          case "ArrowDown": {
            e.preventDefault();
            setFocusedDate(focusedDate.plusDays(7));
            break;
          }
          case "ArrowLeft": {
            e.preventDefault();
            setFocusedDate(focusedDate.minusDays(1));
            break;
          }
          case "ArrowRight": {
            e.preventDefault();
            setFocusedDate(focusedDate.plusDays(1));
            break;
          }
          case "Enter":
          case "Space": {
            e.preventDefault();
            if (currentFocus === "start") {
              setSelectedStartDate(focusedDate);
            } else {
              setSelectedEndDate(focusedDate);
            }
            setFocusedDate(focusedDate);
            onChange?.(selectedStartDateRef.current, selectedEndDateRef.current);
            break;
          }
        }
      }}
    >
      {days[0].map((day) => {
        const dayName = day.format(DateTimeFormatter.ofPattern("eee").withLocale(Locale.ENGLISH));
        return <HeaderCell key={dayName}>{dayName}</HeaderCell>;
      })}
      {days.map((week, i) => (
        <Row role="row" key={i}>
          {week.map((day) => {
            const date = day.toString();
            const label = day.format(DateTimeFormatter.ofPattern("d MMMM uuuu").withLocale(Locale.ENGLISH));
            const isBeforeStart = !!selectedStartDate && !!selectedEndDate && day.isBefore(selectedStartDate);
            const isAfterEnd = !!selectedStartDate && !!selectedEndDate && day.isAfter(selectedEndDate);
            return (
              <Cell
                role="gridcell"
                key={date}
                id={date}
                aria-selected={
                  day.equals(selectedStartDate) ||
                  day.equals(selectedEndDate) ||
                  (!!selectedStartDate &&
                    !!selectedEndDate &&
                    day.isAfter(selectedStartDate) &&
                    day.isBefore(selectedEndDate))
                }
                $focused={day.equals(focusedDate)}
                $hovered={day.equals(hoveredDate)}
                $disabled={isBeforeStart || isAfterEnd}
                aria-current={day.equals(today) ? "date" : undefined}
                aria-label={label}
                onMouseOver={() => {
                  setHoveredDate(day);
                  onHover?.(day);
                }}
                onClick={() => {
                  if (currentFocus === "start") {
                    setSelectedStartDate(day);
                  } else {
                    setSelectedEndDate(day);
                  }
                  setFocusedDate(day);
                  onChange?.(selectedStartDateRef.current, selectedEndDateRef.current);
                }}
              >
                {day.dayOfMonth()}
              </Cell>
            );
          })}
        </Row>
      ))}
    </Grid>
  );
};

// INPUT STYLES

const Picker = styled.div`
  display: flex;
`;

const Input = styled.input<{ $hoverStyle?: boolean }>`
  width: 1.5rem;
  border: none;
  display: flex;
  justify-content: center;
  outline: none;

  ${(props) => props.$hoverStyle && "color: #888;"}
`;

const YearInput = styled.input<{ $hoverStyle?: boolean }>`
  width: 3rem;
  border: none;
  display: flex;
  justify-content: center;
  outline: none;

  ${(props) => props.$hoverStyle && "color: #888;"}
`;

const InputWrapper = styled.div<{ $focused: boolean }>`
  border: 1px solid black;
  border-radius: 3px;
  display: flex;
  width: fit-content;
  padding: 0.5rem 1rem;

  ${(props) => props.$focused && "box-shadow: 0 0 1px 1px #fab;"}
  :focus-within {
    box-shadow: 0 0 1px 1px #fab;
  }
`;

const Separator = styled.div`
  width: 1rem;
`;

// CALENDAR STYLES

const Grid = styled.div`
  width: fit-content;
  padding: 2rem;

  display: grid;
  grid-template-columns: repeat(7, 1.5rem);
  column-gap: 1rem;
  row-gap: 0.5rem;
  align-items: center;
  justify-items: center;

  border: 1px solid transparent;
  border-radius: 5px;

  &:focus-within {
    border: 1px solid #baf;
  }
`;

const Row = styled.div`
  display: contents;
`;

const HeaderCell = styled.div`
  font-size: 0.8rem;
`;

const Cell = styled.div<{ $focused?: boolean; $hovered?: boolean; $disabled?: boolean }>`
  height: 2.5rem;
  width: 2.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  ${(props) =>
    props.$focused &&
    `
    background: rgba(187,170,255, 0.2);
    border: 1px solid #baf;
  `}

  ${(props) =>
    props.$hovered &&
    `
    background: rgba(170,187,255, 0.2);
  `}

  ${(props) =>
    props.$disabled &&
    `
    color: #aaa;
    background: transparent;
  `}

  ${(props) =>
    props["aria-selected"] &&
    `
    background: rgba(255,170,187, 0.2);
  `};
`;
