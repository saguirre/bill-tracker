export interface Day {
  weekday: string;
  formattedDate: string;
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isValid: boolean;
  billCount?: number;
}
