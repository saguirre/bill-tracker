import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { isAfter, isSameDay } from 'date-fns';
import { useEffect } from 'react';

import { useCalendar } from '../../hooks/useCalendar.hook';
import { Bill } from '../../models/bill/bill';
import { Day } from '../../models/day';
import { CalendarButton } from './CalendarButton';

interface HomeCalendarProps {
  onSelectDate: (bills: Bill[]) => void;
  bills?: Bill[];
}

export const HomeCalendar: React.FC<HomeCalendarProps> = ({ bills, onSelectDate }) => {
  const {
    moveToPreviousMonth,
    moveToNextMonth,
    currentMonthName,
    weekdays,
    days,
    setDays,
    selectedDay,
    currentYear,
    selectCurrentDay,
  } = useCalendar('en');

  const markBillDueDatesInCalendar = (bills: Bill[]) => {
    setDays((current) => {
      return current.map((currentDay) => {
        const billDueDates = bills.filter(
          (bill) => bill?.dueDate && isSameDay(new Date(bill.dueDate), new Date(currentDay.date))
        );
        return {
          ...currentDay,
          billCount: billDueDates.length,
        };
      });
    });
  };

  useEffect(() => {
    if (bills) {
      markBillDueDatesInCalendar(bills);
    }
  }, [bills, currentMonthName]);

  return (
    <div className="w-full">
      <div className="px-2 py-6 rounded-box border border-base-300 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-9">
        <div className="flex flex-row w-full px-4 items-center justify-between text-base-content">
          <div className="flex-start text-lg font-semibold">
            {currentMonthName} {currentYear}
          </div>
          <div className="flex flex-row items-center gap-4">
            <button
              type="button"
              onClick={() => moveToPreviousMonth()}
              className="btn btn-sm btn-circle btn-ghost border border-base-300 -m-1.5 flex flex-none items-center justify-center text-base-content hover:border-base-300 hover:bg-base-200"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => moveToNextMonth()}
              className="btn btn-sm btn-circle btn-ghost border border-base-300 -m-1.5 flex flex-none items-center justify-center text-base-content hover:border-base-300 hover:bg-base-200"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-base-content">
          {weekdays?.map((weekday, index) => (
            <div key={weekday + index}>{weekday}</div>
          ))}
        </div>
        <div className="isolate mt-2 grid grid-cols-7 gap-x-1 bg-base-100 text-sm">
          {days.map((day, dayIdx) => (
            <CalendarButton
              key={day.formattedDate}
              day={day}
              dayIdx={dayIdx}
              days={days}
              billCount={day.billCount}
              selectedDay={selectedDay}
              onClick={(day: Day) => {
                if (day.isValid) {
                  selectCurrentDay(day);
                  setDays((current) => {
                    return current.map((currentDay) => {
                      return { ...currentDay, isSelected: day.formattedDate === currentDay.formattedDate };
                    });
                  });
                  onSelectDate(
                    bills
                      ?.filter((bill) => bill?.dueDate && isSameDay(new Date(bill?.dueDate), day.date))
                      ?.sort((a, b) =>
                        isAfter(new Date(a.dueDate || new Date()), new Date(b.dueDate || new Date())) ? 1 : -1
                      ) ?? []
                  );
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
