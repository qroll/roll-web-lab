import { LocalDate } from "@js-joda/core";
import "@js-joda/timezone";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import { useStateRef } from "./use-state-ref";

const INVALID_DATE = "invalid_date";

interface DateInputProps {
  focused: boolean;
  value: LocalDate | null;
  hoverDate?: LocalDate | null;
  placeholder?: string;
  onChange: (val: LocalDate | typeof INVALID_DATE) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface DateInputRef {
  setValue: (val: LocalDate | null) => void;
  focus: () => void;
}

const DateInputComponent: React.ForwardRefRenderFunction<DateInputRef, DateInputProps> = (
  { focused, value, hoverDate, placeholder, onChange, onFocus, onBlur },
  ref
) => {
  const [day, setDay, dayRef] = useStateRef<string>("");
  const [month, setMonth, monthRef] = useStateRef<string>("");
  const [year, setYear, yearRef] = useStateRef<string>("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dayInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!focused && document.activeElement) {
      if (
        document.activeElement === dayInputRef.current ||
        document.activeElement === monthInputRef.current ||
        document.activeElement === yearInputRef.current
      ) {
        (document.activeElement as HTMLInputElement).blur();
      }
    }
    if (focused) {
      if (
        document.activeElement !== dayInputRef.current &&
        document.activeElement !== monthInputRef.current &&
        document.activeElement !== yearInputRef.current
      ) {
        dayInputRef.current?.focus();
      }
    }
  }, [focused]);

  useImperativeHandle(ref, () => {
    return {
      setValue(value: LocalDate | null) {
        updateStateFromValue(value);
      },
      focus() {
        dayInputRef.current?.focus();
      },
    };
  });

  const handleFullyFormedDate = () => {
    if (dayRef.current.length === 2 && monthRef.current.length === 2 && yearRef.current.length === 4) {
      try {
        const date = LocalDate.of(parseInt(yearRef.current), parseInt(monthRef.current), parseInt(dayRef.current));
        onChange(date);
      } catch (err) {}
    }
  };

  const hoverStyle = !!hoverDate && (value ? !hoverDate.isEqual(value) : true);

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
        onBlur?.();
      }}
      onFocus={() => {
        onFocus?.();
      }}
    >
      {!focused && !value && !hoverDate && (
        <Placeholder
          tabIndex={0}
          onFocus={() => {
            dayInputRef.current?.focus();
            onFocus?.();
          }}
        >
          {placeholder}
        </Placeholder>
      )}
      <Input
        ref={dayInputRef}
        name="day"
        placeholder="DD"
        $hoverStyle={hoverStyle}
        value={hoverDate ? hoverDate.dayOfMonth().toString().padStart(2, "0") : day}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/, "");
          setDay(value);
          if (value.length === 2) {
            monthInputRef.current?.select();
          }
        }}
        maxLength={2}
        onBlur={() => {
          if (dayRef.current.length === 1) {
            setDay(dayRef.current.padStart(2, "0"));
          }
          handleFullyFormedDate();
        }}
      />
      <>/</>
      <Input
        ref={monthInputRef}
        name="month"
        placeholder="MM"
        $hoverStyle={hoverStyle}
        value={hoverDate ? hoverDate.monthValue().toString().padStart(2, "0") : month}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/, "");
          setMonth(value);
          if (value.length === 2) {
            yearInputRef.current?.select();
          }
        }}
        maxLength={2}
        onBlur={() => {
          if (monthRef.current.length === 1) {
            setMonth(monthRef.current.padStart(2, "0"));
          }
          handleFullyFormedDate();
        }}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && month === "") {
            e.preventDefault();
            dayInputRef.current?.focus();
          }
        }}
      />
      <>/</>
      <YearInput
        ref={yearInputRef}
        name="year"
        placeholder="YYYY"
        $hoverStyle={hoverStyle}
        value={hoverDate ? hoverDate.year() : year}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/, "");
          setYear(value);
          if (value.length === 4) {
            try {
              const date = LocalDate.of(parseInt(value), parseInt(month), parseInt(day));
              onChange(date);
            } catch (err) {}
          }
        }}
        maxLength={4}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && year === "") {
            e.preventDefault();
            monthInputRef.current?.focus();
          }
        }}
      />
    </InputWrapper>
  );
};

export const DateInput = forwardRef(DateInputComponent);

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

const InputWrapper = styled.div<{ $focused?: boolean }>`
  display: flex;
  width: 10rem;
  padding: 0.5rem 1rem;
  position: relative;
  ${(props) => props.$focused && "border-bottom: 2px solid #fab;"}
`;

const Placeholder = styled.div`
  color: #888;
  position: absolute;
  background-color: #fff;
  left: 0;
  right: 0;
  margin: 0rem 1rem;
`;
