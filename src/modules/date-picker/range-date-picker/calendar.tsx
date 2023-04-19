import { DateTimeFormatter, DayOfWeek, LocalDate } from "@js-joda/core";
import { Locale } from "@js-joda/locale_en";
import "@js-joda/timezone";
import { useEffect, useImperativeHandle, useMemo, useState } from "react";
import styled from "styled-components";
import { useStateRef } from "./use-state-ref";
import React from "react";

interface RangeCalendarProps {
  currentFocus: "start" | "end";
  startDate: LocalDate | null;
  endDate: LocalDate | null;
  onChange?: (start: LocalDate | null, end: LocalDate | null) => void;
  onHover?: (hover: LocalDate | null) => void;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export interface CalendarRef {
  updateFocusedDate: (date: LocalDate) => void;
}

const isBetween = (val: LocalDate, start: LocalDate, end: LocalDate): boolean => {
  return val.isBefore(end) && val.isAfter(start);
};

const RangeCalendarComponent: React.ForwardRefRenderFunction<CalendarRef, RangeCalendarProps> = (
  { currentFocus, startDate, endDate, onChange, onHover, onCancel, onConfirm },
  ref
) => {
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

  useImperativeHandle(
    ref,
    () => {
      return {
        updateFocusedDate(date) {
          setFocusedDate(date);
        },
      };
    },
    []
  );

  return (
    <Wrapper>
      <Header>
        <Month>{focusedDate.month().toString()}</Month>
        <Year>{focusedDate.year().toString()}</Year>
        <MonthButtonWrapper>
          <MonthButton
            onClick={() => {
              setFocusedDate(focusedDate.minusMonths(1));
            }}
          >
            &lt;
          </MonthButton>
          <MonthButton
            onClick={() => {
              setFocusedDate(focusedDate.plusMonths(1));
            }}
          >
            &gt;
          </MonthButton>
        </MonthButtonWrapper>
      </Header>
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
              const isBeforeStart =
                currentFocus === "end" &&
                !!selectedStartDate &&
                !!selectedEndDate &&
                focusedDate.isBefore(selectedStartDate);
              const isAfterEnd =
                currentFocus === "start" &&
                !!selectedStartDate &&
                !!selectedEndDate &&
                focusedDate.isAfter(selectedEndDate);
              const disabled = isBeforeStart || isAfterEnd;

              if (disabled) {
                return;
              }
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
              const isBeforeStart = currentFocus === "end" && !!selectedStartDate && day.isBefore(selectedStartDate);
              const isAfterEnd = currentFocus === "start" && !!selectedEndDate && day.isAfter(selectedEndDate);
              const disabled = isBeforeStart || isAfterEnd;
              const hoverAfterStart = !!hoveredDate && !!selectedStartDate && hoveredDate.isAfter(selectedStartDate);
              const hoverBeforeEnd = !!hoveredDate && !!selectedEndDate && hoveredDate.isBefore(selectedEndDate);
              const hovered =
                (hoverAfterStart && isBetween(day, selectedStartDate, hoveredDate)) ||
                (hoverBeforeEnd && isBetween(day, hoveredDate, selectedEndDate));

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
                  $hovered={day.equals(hoveredDate) || hovered}
                  $disabled={disabled}
                  aria-current={day.equals(today) ? "date" : undefined}
                  aria-label={label}
                  onMouseOver={() => {
                    if (!disabled) {
                      setHoveredDate(day);
                      onHover?.(day);
                    } else {
                      setHoveredDate(null);
                      onHover?.(null);
                    }
                  }}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }
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
      <ActionButton onClick={onCancel}>Cancel</ActionButton>
      <ActionButton onClick={onConfirm}>Confirm</ActionButton>
    </Wrapper>
  );
};

export const RangeCalendar = React.forwardRef(RangeCalendarComponent);

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

const Month = styled.span`
  margin: 0.5rem;
`;
const Year = styled.span`
  margin: 0.5rem;
`;

const MonthButtonWrapper = styled.div`
  margin-left: auto;
`;

const MonthButton = styled.button`
  padding: 0.5rem;
  color: #888;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;

const Wrapper = styled.div`
  width: fit-content;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  color: #888;
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    color: #000;
    background: #eee;
  }
`;
