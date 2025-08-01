import { RefObject, useEffect, useRef, useState } from "react";

export const NeoMorphicDateTimePicker = ({
  selectedDate,
  onChange,
}: NeoMorphicDateTimePickerProps) => {
  const currentDateTime = new Date();
  const [error, setError] = useState<string | null>(null); // Added error state
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Added timeout ref

  const parseDate = (dateInput: Date | string | null | undefined): Date => {
    if (!dateInput) return new Date();
    if (dateInput instanceof Date) return dateInput;
    if (typeof dateInput === "string") {
      const parsed = new Date(dateInput);
      return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
    return new Date();
  };

  const initialDate = parseDate(selectedDate);
  if (initialDate.getTime() < currentDateTime.getTime()) {
    initialDate.setTime(currentDateTime.getTime());
  }

  const [date, setDate] = useState(initialDate.getDate());
  const [month, setMonth] = useState(initialDate.getMonth() + 1);
  const [year, setYear] = useState(initialDate.getFullYear());
  const [hour, setHour] = useState(initialDate.getHours());
  const [minute, setMinute] = useState(initialDate.getMinutes());

  const [isScrolling, setIsScrolling] = useState({
    date: false,
    month: false,
    year: false,
    hour: false,
    minute: false,
  });

  const dateRef = useRef<HTMLDivElement>(null as any);
  const monthRef = useRef<HTMLDivElement>(null as any);
  const yearRef = useRef<HTMLDivElement>(null as any);
  const hourRef = useRef<HTMLDivElement>(null as any);
  const minuteRef = useRef<HTMLDivElement>(null as any);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear timeout on unmount
      }
    };
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const parsedDate = parseDate(selectedDate);
      // Only update if the parsed date is different from current internal state
      const currentInternalDate = new Date(year, month - 1, date, hour, minute);

      if (parsedDate.getTime() !== currentInternalDate.getTime()) {
        setDate(parsedDate.getDate());
        setMonth(parsedDate.getMonth() + 1);
        setYear(parsedDate.getFullYear());
        setHour(parsedDate.getHours());
        setMinute(parsedDate.getMinutes());
      }
    }
  }, [selectedDate]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const days = Array.from(
    { length: getDaysInMonth(month, year) },
    (_, i) => i + 1
  ).filter((d) => {
    if (
      year === currentDateTime.getFullYear() &&
      month === currentDateTime.getMonth() + 1
    ) {
      return d >= currentDateTime.getDate();
    }
    return true;
  });

  const months = Array.from({ length: 12 }, (_, i) => i + 1).filter((m) => {
    if (year === currentDateTime.getFullYear()) {
      return m >= currentDateTime.getMonth() + 1;
    }
    return true;
  });

  const years = Array.from(
    { length: 21 },
    (_, i) => currentDateTime.getFullYear() + i
  );

  const hours = Array.from({ length: 24 }, (_, i) => i).filter((h) => {
    if (
      year === currentDateTime.getFullYear() &&
      month === currentDateTime.getMonth() + 1 &&
      date === currentDateTime.getDate()
    ) {
      return h >= currentDateTime.getHours();
    }
    return true;
  });

  const minutes = Array.from({ length: 60 }, (_, i) => i).filter((m) => {
    if (
      year === currentDateTime.getFullYear() &&
      month === currentDateTime.getMonth() + 1 &&
      date === currentDateTime.getDate() &&
      hour === currentDateTime.getHours()
    ) {
      return m >= currentDateTime.getMinutes();
    }
    return true;
  });

  useEffect(() => {
    const newTime = new Date(year, month - 1, date, hour, minute);
    let adjustedBecausePast = false;
    if (newTime.getTime() < currentDateTime.getTime()) {
      if (year < currentDateTime.getFullYear()) {
        setYear(currentDateTime.getFullYear());
      }
      if (
        year === currentDateTime.getFullYear() &&
        month < currentDateTime.getMonth() + 1
      ) {
        setMonth(currentDateTime.getMonth() + 1);
      }
      if (
        year === currentDateTime.getFullYear() &&
        month === currentDateTime.getMonth() + 1 &&
        date < currentDateTime.getDate()
      ) {
        setDate(currentDateTime.getDate());
      }
      if (
        year === currentDateTime.getFullYear() &&
        month === currentDateTime.getMonth() + 1 &&
        date === currentDateTime.getDate() &&
        hour < currentDateTime.getHours()
      ) {
        setHour(currentDateTime.getHours());
      }
      if (
        year === currentDateTime.getFullYear() &&
        month === currentDateTime.getMonth() + 1 &&
        date === currentDateTime.getDate() &&
        hour === currentDateTime.getHours() &&
        minute < currentDateTime.getMinutes()
      ) {
        setMinute(currentDateTime.getMinutes());
      }
    }

    // Check if date is in the past
    if (newTime.getTime() < currentDateTime.getTime()) {
      adjustedBecausePast = true;
      // Set all parts to current date/time
      setYear(currentDateTime.getFullYear());
      setMonth(currentDateTime.getMonth() + 1);
      setDate(currentDateTime.getDate());
      setHour(currentDateTime.getHours());
      setMinute(currentDateTime.getMinutes());
    }
    const maxDays = getDaysInMonth(month, year);
    if (date > maxDays) {
      setDate(maxDays);
    }
    // Show error if we adjusted because of past date
    if (adjustedBecausePast) {
      setError(
        "The selected time is in the past. Adjusted to the current time."
      );
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setError(null), 3000);
    }
  }, [year, month, date, hour, minute, onChange, selectedDate]); // Added onChange and selectedDate to dependency array

  useEffect(() => {
    if (onChange) {
      const newDateObj = new Date(year, month - 1, date, hour, minute);
      // Ensure selectedDate is parsed correctly before comparison
      const currentSelectedDate = selectedDate ? parseDate(selectedDate) : null;
      if (
        !currentSelectedDate || // if selectedDate was null/undefined initially
        newDateObj.getTime() !== currentSelectedDate.getTime()
      ) {
        onChange(newDateObj);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, month, year, hour, minute]); // onChange is excluded as per original logic, but consider adding if it can change

  const renderWheel = (
    values: (string | number)[],
    current: string | number,
    setter: (value: any) => void, // Consider a more specific type if possible
    type: keyof typeof isScrolling,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    useEffect(() => {
      const element = ref.current;
      if (!element) return;

      const handleWheelEvent = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (values.length === 0) return;
        const currentIndex = values.indexOf(current);
        if (currentIndex === -1) {
          setter(values[0]);
          return;
        }
        setIsScrolling((prev) => ({ ...prev, [type]: true }));
        const direction = e.deltaY > 0 ? 1 : -1;
        let newIndex = (currentIndex + direction) % values.length;
        if (newIndex < 0) newIndex = values.length - 1;
        setter(values[newIndex]);
        setTimeout(() => {
          setIsScrolling((prev) => ({ ...prev, [type]: false }));
        }, 50);
      };

      element.addEventListener("wheel", handleWheelEvent, { passive: false });

      return () => {
        element.removeEventListener("wheel", handleWheelEvent);
      };
    }, [ref, values, current, type]);

    if (values.length === 0) {
      return (
        <div
          className="relative h-32 overflow-hidden rounded-lg bg-gray-100 shadow-inner flex items-center justify-center"
          ref={ref}
        >
          <p className="text-gray-400 font-medium">No options</p>
        </div>
      );
    }
    const currentIndex = values.indexOf(current);

    useEffect(() => {
      if (currentIndex === -1 && values.length > 0) {
        setter(values[0]);
      }
    }, [values, current]);

    return (
      <div
        className="relative h-32 overflow-hidden rounded-lg bg-gray-100 shadow-inner"
        ref={ref}
      >
        <div className="absolute top-1/2 left-0 right-0 h-10 -mt-5 pointer-events-none z-10">
          <div className="h-full mx-1 bg-blue-100 bg-opacity-40 rounded-md border border-blue-200"></div>
        </div>
        <div
          className={`flex flex-col items-center justify-center h-full transition-transform duration-300 px-2 ${
            isScrolling[type] ? "transform translate-y-1" : ""
          }`}
        >
          {values.map((value, index) => {
            const relativePos =
              (index - currentIndex + values.length) % values.length;
            const wrappedPos =
              relativePos > values.length / 2
                ? relativePos - values.length
                : relativePos;

            if (wrappedPos >= -3 && wrappedPos <= 3) {
              const isSelected = wrappedPos === 0;
              const opacity = 1 - Math.abs(wrappedPos) * 0.2;
              const scale = 1 - Math.abs(wrappedPos) * 0.08;
              const translateY = wrappedPos * 24; // pixels instead of rem for more precise control

              return (
                <div
                  key={value}
                  className={`absolute py-1 px-3 font-mono text-2xl font-bold cursor-pointer transition-all duration-200
                    ${isSelected ? "text-blue-600 z-10" : "text-gray-500"}`}
                  style={{
                    opacity: opacity,
                    transform: `scale(${scale}) translateY(${translateY}px)`,
                    top: "calc(50% - 16px)",
                  }}
                  onClick={() => setter(value)}
                >
                  {value.toString().padStart(2, "0")}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-200 rounded-xl p-6 w-full">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Select Date & Time
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 bg-gray-50 p-5 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Date
          </h3>
          <div className="flex gap-3">
            <div className="w-[25%]">
              <p className="text-sm font-medium text-gray-500 mb-2 text-center">
                Day
              </p>
              {renderWheel(days, date, setDate, "date", dateRef)}
            </div>
            <div className="w-[25%]">
              <p className="text-sm font-medium text-gray-500 mb-2 text-center">
                Month
              </p>
              {renderWheel(months, month, setMonth, "month", monthRef)}
            </div>
            <div className="w-[50%]">
              <p className="text-sm font-medium text-gray-500 mb-2 text-center">
                Year
              </p>
              {renderWheel(years, year, setYear, "year", yearRef)}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-gray-50 p-5 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
            Time
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2 text-center">
                Hour
              </p>
              {renderWheel(hours, hour, setHour, "hour", hourRef)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2 text-center">
                Minute
              </p>
              {renderWheel(minutes, minute, setMinute, "minute", minuteRef)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 p-4 bg-gray-100 rounded-lg shadow-inner text-center">
        <p className="text-lg font-mono">
          Selected:{" "}
          <span className="text-blue-600 font-bold">{`${year}-${month
            .toString()
            .padStart(2, "0")}-${date.toString().padStart(2, "0")} ${hour
            .toString()
            .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`}</span>
        </p>
      </div>

      {/* Added error message display */}
      {error && (
        <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}
    </div>
  );
};
