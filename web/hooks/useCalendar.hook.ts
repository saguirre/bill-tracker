import { useState, useEffect } from 'react';

import {
  nextMonday,
  addDays,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  subDays,
  getDaysInMonth,
  startOfMonth,
  endOfMonth,
  getDay,
} from 'date-fns';
import enLocale from 'date-fns/locale/en-US';

import { Day } from '../models/day';
import { useRouter } from 'next/router';

export const useCalendar = (language: string) => {
  const today = new Date();
  const router = useRouter();
  const [currentMonthName, setCurrentMonthName] = useState<string>();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [currentYear, setCurrentYear] = useState<number>(2000);
  const [selectedDay, setSelectedDay] = useState<Day>();
  const [locale, setLocale] = useState<Locale>(enLocale);
  const [weekdays, setWeekdays] = useState<string[]>([]);
  const [days, setDays] = useState<Day[]>([]);

  const initLocale = () => {
    setLocale(enLocale);
  };

  const initWeekdays = () => {
    const weekdayRandomStart = new Date('2000-01-01');
    const weekdayList: string[] = [];
    const monday = nextMonday(weekdayRandomStart);
    for (let i = 0; i < 7; i++) {
      const day = addDays(monday, i);
      weekdayList.push(format(day, 'EEEE', { locale }).at(0)?.toLocaleUpperCase() || '');
    }
    setWeekdays(weekdayList);
  };

  const moveToNextMonth = () => {
    setCurrentMonth((current) => addMonths(current, 1));
  };

  const moveToPreviousMonth = () => {
    setCurrentMonth((current) => subMonths(current, 1));
  };

  const generateDay = (date: Date) => {
    return {
      date: date,
      weekday: format(date, 'EEEE', { locale }),
      formattedDate: format(date, 'dd-MM-yyyy', { locale }),
      isCurrentMonth: isSameMonth(date, currentMonth),
      isSelected: false,
      isToday: isToday(date),
      isValid: true,
    };
  };

  const populatePreviousMonthDays = (firstDayInMonth: Date, firstWeekdayInMonth: number, days: Day[]) => {
    if (firstWeekdayInMonth === 0) {
      firstWeekdayInMonth = 7;
    }
    for (let i = firstWeekdayInMonth - 1; i > 0; i--) {
      const day = subDays(firstDayInMonth, i);
      days.push(generateDay(day));
    }
  };

  const populateCurrentMonthDays = (firstDayInMonth: Date, daysInMonth: number, days: Day[]) => {
    for (let i = 0; i < daysInMonth; i++) {
      const day = addDays(firstDayInMonth, i);
      days.push(generateDay(day));
    }
  };

  const populateNextMonthDays = (lastDayInMonth: Date, lastWeekdayInMonth: number, days: Day[]) => {
    for (let i = 1; i < 8 - lastWeekdayInMonth; i++) {
      const day = addDays(lastDayInMonth, i);
      days.push(generateDay(day));
    }
  };

  const getMonthName = () => {
    const formattedCurrentMonth = format(currentMonth, 'LLLL', { locale });
    return (
      formattedCurrentMonth.at(0)?.toLocaleUpperCase() + formattedCurrentMonth.slice(1, formattedCurrentMonth.length)
    );
  };

  const populateCalendar = () => {
    setCurrentMonthName(getMonthName());
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayInMonth = startOfMonth(currentMonth);
    const lastDayInMonth = endOfMonth(currentMonth);
    const firstWeekdayInMonth = getDay(firstDayInMonth);
    const lastWeekdayInMonth = getDay(lastDayInMonth);
    const days: Day[] = [];
    populatePreviousMonthDays(firstDayInMonth, firstWeekdayInMonth, days);
    populateCurrentMonthDays(firstDayInMonth, daysInMonth, days);
    populateNextMonthDays(lastDayInMonth, lastWeekdayInMonth, days);
    setCurrentYear(currentMonth.getFullYear());
    setDays(days);
  };

  const selectCurrentDay = (day: Day) => {
    if (!day.isValid) {
      return null;
    }
    if (!isSameMonth(currentMonth, day.date)) {
      setCurrentMonth(day.date);
    }
    setSelectedDay(day);
  };

  useEffect(() => {
    if (router.isReady) {
      initLocale();
      initWeekdays();
      populateCalendar();
    }
  }, []);

  useEffect(() => {
    if (currentMonth) {
      populateCalendar();
    }
  }, [currentMonth]);

  return {
    weekdays,
    days,
    setDays,
    currentMonth,
    currentYear,
    setCurrentMonth,
    currentMonthName,
    selectedDay,
    selectCurrentDay,
    moveToPreviousMonth,
    moveToNextMonth,
  };
};
