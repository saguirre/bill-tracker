import { Day } from '../../models/day';
import classNames from 'classnames';

interface Props {
  day: Day;
  billCount?: number;
  dayIdx: number;
  selectedDay?: Day;
  days: Day[];
  onClick: (day: Day) => void;
}

export const CalendarButton: React.FC<Props> = ({ day, dayIdx, selectedDay, billCount, days, onClick }) => {
  return (
    <button
      key={day.weekday + day.formattedDate + dayIdx}
      type="button"
      onClick={() => onClick(day)}
      className={classNames(
        'btn btn-circle btn-md btn-ghost relative',
        day.isValid ? 'bg-base-100 hover:bg-base-200 focus:z-10' : 'bg-base-content hover:cursor-not-allowed',
        day.isCurrentMonth ? 'bg-base-100' : 'bg-base-100 text-base-content',
        day.isSelected || day.isToday ? 'font-semibold' : '',
        day.isSelected ? 'text-base-100' : '',
        !day.isSelected && day.isCurrentMonth && !day.isToday ? 'text-base-content' : '',
        !day.isSelected && !day.isCurrentMonth && !day.isToday ? 'text-base-content/20' : '',
        day.isToday && !day.isSelected ? 'text-primary' : ''
      )}
    >
      <time
        dateTime={day.formattedDate}
        className={classNames(
          'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
          day?.isSelected || day?.formattedDate === selectedDay?.formattedDate ? 'bg-primary text-primary-content' : ''
        )}
      >
        {day?.formattedDate?.split('-')?.shift()?.replace(/^0/, '')}
      </time>
      {billCount && (
        <>
          {billCount === 1 && (
            <>
              <span className="absolute bottom-1 right-[21px] h-1 w-1 inline-flex items-center justify-center bg-primary text-xs font-medium leading-4 rounded-full"></span>
            </>
          )}
          {billCount === 2 && (
            <>
              <span className="absolute bottom-1 left-[17px] h-1 w-1 inline-flex items-center justify-center bg-primary text-xs font-medium leading-4 rounded-full"></span>
              <span className="absolute bottom-1 right-[17px] h-1 w-1 inline-flex items-center justify-center bg-secondary text-xs font-medium leading-4 rounded-full"></span>
            </>
          )}
          {billCount >= 3 && (
            <>
              <span className="absolute bottom-1 left-[14px] h-1 w-1 inline-flex items-center justify-center bg-primary text-xs font-medium leading-4 rounded-full"></span>
              <span className="absolute bottom-1 right-[21px] h-1 w-1 inline-flex items-center justify-center bg-secondary text-xs font-medium leading-4 rounded-full"></span>
              <span className="absolute bottom-1 right-[14px] h-1 w-1 inline-flex items-center justify-center bg-accent text-xs font-medium leading-4 rounded-full"></span>
            </>
          )}
        </>
      )}
    </button>
  );
};
