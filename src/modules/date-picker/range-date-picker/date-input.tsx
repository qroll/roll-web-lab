import { LocalDate } from "@js-joda/core";
import "@js-joda/timezone";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import { useStateRef } from "../../../components/hooks";

const INVALID_DATE = "invalid_date";
type InvalidDate = typeof INVALID_DATE;

interface DateInputProps {
  focused: boolean;
  value: LocalDate | InvalidDate | null;
  hoverDate?: LocalDate | null;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  onChange: (val: LocalDate | typeof INVALID_DATE) => void;
  onChangeRaw: (d: string, m: string, y: string) => void;
  onFocus?: () => void;
  onArrow?: () => void;
  onYearBlur?: () => void;
}

export interface DateInputRef {
  setValue: (val: LocalDate | null) => void;
  focus: () => void;
  ref: React.RefObject<HTMLDivElement>;
}

const DateInputComponent: React.ForwardRefRenderFunction<DateInputRef, DateInputProps> = (
  {
    focused,
    value,
    hoverDate,
    placeholder,
    disabled = false,
    label,
    onChange,
    onChangeRaw,
    onFocus,
    onArrow,
    onYearBlur,
  },
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
    if (val) {
      if (parseInt(day) !== val.dayOfMonth()) {
        setDay(val.dayOfMonth().toString().padStart(2, "0"));
      }
      if (parseInt(month) !== val.monthValue()) {
        setMonth(val.monthValue().toString().padStart(2, "0"));
      }
      setYear(val.year().toString());
    } else {
      setDay("");
      setMonth("");
      setYear("");
    }
  };

  useEffect(() => {
    if (value !== INVALID_DATE) {
      updateStateFromValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (focused) {
      if (!wrapperRef.current?.contains(document.activeElement)) {
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
      ref: wrapperRef,
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

  const hoverStyle = !!hoverDate && (value instanceof LocalDate ? !hoverDate.isEqual(value) : true);

  return (
    <InputWrapper
      role="group"
      aria-label={label}
      ref={wrapperRef}
      $focused={focused}
      onFocus={() => {
        onFocus?.();
      }}
      onKeyDown={(e) => {
        switch (e.key) {
          case "ArrowDown":
          case "ArrowUp":
            onArrow?.();
            break;
        }
      }}
    >
      {!focused && !value && !hoverDate && (
        <Placeholder
          tabIndex={disabled ? undefined : 0}
          $disabled={disabled}
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
        aria-label="day"
        name="day"
        placeholder="DD"
        autoComplete="off"
        disabled={disabled}
        $hoverStyle={hoverStyle}
        value={hoverDate ? hoverDate.dayOfMonth().toString().padStart(2, "0") : day}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/, "");
          setDay(value);
          if (value.length === 2) {
            monthInputRef.current?.select();
          }
          onChangeRaw?.(value, month, year);
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
        aria-label="month"
        name="month"
        placeholder="MM"
        autoComplete="off"
        disabled={disabled}
        $hoverStyle={hoverStyle}
        value={hoverDate ? hoverDate.monthValue().toString().padStart(2, "0") : month}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/, "");
          setMonth(value);
          if (value.length === 2) {
            yearInputRef.current?.select();
          }
          onChangeRaw?.(day, value, year);
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
        aria-label="year"
        name="year"
        placeholder="YYYY"
        autoComplete="off"
        disabled={disabled}
        $hoverStyle={hoverStyle}
        value={hoverDate ? hoverDate.year() : year}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/, "");
          setYear(value);
          if (value.length === 4) {
            try {
              const date = LocalDate.of(parseInt(value), parseInt(month), parseInt(day));
              onChange(date);
              onYearBlur?.();
            } catch (err) {}
          }
          onChangeRaw?.(day, month, value);
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

const Placeholder = styled.div<{ $disabled?: boolean }>`
  color: #888;
  position: absolute;
  background-color: ${(props) => (props.$disabled ? "#eee" : "#fff")};
  left: 0;
  right: 0;
  margin: 0rem 1rem;
`;
