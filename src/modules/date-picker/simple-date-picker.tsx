import { DayOfWeek, LocalDate, DateTimeFormatter } from "@js-joda/core";
import "@js-joda/timezone";
import { Locale } from "@js-joda/locale_en";
import { useMemo, useState } from "react";
import styled from "styled-components";

export const SimpleDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(LocalDate.now());
  const [focusedDate, setFocusedDate] = useState(LocalDate.now());
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

  return (
    <Grid
      role="grid"
      tabIndex={0}
      aria-activedescendant={focusedDate.toString()}
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
            setSelectedDate(focusedDate);
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
            return (
              <Cell
                role="gridcell"
                key={date}
                id={date}
                aria-selected={day.equals(selectedDate)}
                $focused={day.equals(focusedDate)}
                aria-current={day.equals(today) ? "date" : undefined}
                aria-label={label}
                onClick={() => {
                  setSelectedDate(day);
                  setFocusedDate(day);
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

const Cell = styled.div<{ $focused?: boolean }>`
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
    props["aria-selected"] &&
    `
    background: rgba(255,170,187, 0.2);
  `};
`;
