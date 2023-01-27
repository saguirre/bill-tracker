import { ArrowPathIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useState } from 'react';

export enum Recurrence {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}
interface RecurringBillDropdownProps {
  date: string;
}
export const RecurringBillDropdown: React.FC<RecurringBillDropdownProps> = ({ date }) => {
  const [selectedRecurrence, setSelectedRecurrence] = useState<Recurrence>(Recurrence.Daily);
  return (
    <div className="dropdown dropdown-right dropdown-top">
      <label tabIndex={0} className="btn btn-ghost btn-outline btn-xs gap-2 mt-2 text-primary pb-0.5 !pt-0.5">
        <ArrowPathIcon className="h-4 w-4" />
        Recurring
      </label>
      <div
        tabIndex={0}
        className="card border compact dropdown-content -mb-[53px] ml-1.5 shadow bg-base-100 rounded-box w-[430px]"
      >
        <div className="card-body w-full">
          <div className="btn-group">
            <button
              onClick={() => setSelectedRecurrence(Recurrence.Daily)}
              type="button"
              className={classNames('btn', selectedRecurrence === Recurrence.Daily ? 'btn-active' : '')}
            >
              Daily
            </button>
            <button
              onClick={() => setSelectedRecurrence(Recurrence.Weekly)}
              type="button"
              className={classNames('btn', selectedRecurrence === Recurrence.Weekly ? 'btn-active' : '')}
            >
              Weekly
            </button>
            <button
              onClick={() => setSelectedRecurrence(Recurrence.Monthly)}
              type="button"
              className={classNames('btn', selectedRecurrence === Recurrence.Monthly ? 'btn-active' : '')}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedRecurrence(Recurrence.Yearly)}
              type="button"
              className={classNames('btn', selectedRecurrence === Recurrence.Yearly ? 'btn-active' : '')}
            >
              Yearly
            </button>
          </div>
          <div className="mt-4 w-full">
            {selectedRecurrence === Recurrence.Daily && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <span className="font-bold">Repeat every</span>
                  <input
                    type="number"
                    defaultValue={1}
                    className="input w-full max-w-[40px] h-8 px-1 text-center border-base-content input-primary focus:border-none"
                  />
                  <span className="font-bold">days</span>
                </div>
                <span className="text-xs text-base-content/60">
                  This bill will repeat every day or every x amount of days depending on the value.
                </span>
              </div>
            )}
            {selectedRecurrence === Recurrence.Weekly && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <span className="font-bold">Repeat every</span>
                  <input
                    type="number"
                    defaultValue={1}
                    className="input w-full max-w-[40px] h-8 px-1 text-center border-base-content input-primary focus:border-none"
                  />
                  <span className="font-bold">weeks</span>
                </div>
                <span className="text-xs text-base-content/60">
                  This bill will repeat every x weeks on specific weekdays.
                </span>
                <div className="flex flex-row items-center justify-center">
                  <div className="form-control">
                    <label className="label cursor-pointer gap-1">
                      <input type="checkbox" checked={false} className="checkbox checkbox-sm checkbox-primary" />
                      <span className="label-text">Sun</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-1">
                      <input type="checkbox" checked={false} className="checkbox checkbox-sm checkbox-secondary" />
                      <span className="label-text">Mon</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-1">
                      <input type="checkbox" checked={false} className="checkbox checkbox-sm checkbox-accent" />
                      <span className="label-text">Tue</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-1">
                      <input type="checkbox" checked={false} className="checkbox checkbox-sm checkbox-success" />
                      <span className="label-text">Wed</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-1">
                      <input type="checkbox" checked={false} className="checkbox checkbox-sm checkbox-warning" />
                      <span className="label-text">Thu</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-1">
                      <input type="checkbox" checked={false} className="checkbox checkbox-sm checkbox-info" />
                      <span className="label-text">Fri</span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-1">
                      <input type="checkbox" checked={false} className="checkbox checkbox-sm checkbox-error" />
                      <span className="label-text">Sat</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            {selectedRecurrence === Recurrence.Monthly && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <span className="font-bold">Repeat every</span>
                  <input
                    type="number"
                    defaultValue={1}
                    className="input w-full max-w-[40px] h-8 px-1 text-center border-base-content input-primary focus:border-none"
                  />
                  <span className="font-bold">months</span>
                </div>
                <div className="flex flex-col items-start gap-2 border rounded-xl p-2">
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input type="radio" name="radio-10" className="radio checked:radio-primary" checked />
                      <span className="label-text">
                        <select className="select select-primary w-full max-w-xs">
                          <option disabled selected>
                            Day
                          </option>
                          {Array.from({ length: 31 }).map((day, index) => (
                            <option>{index + 1}</option>
                          ))}
                        </select>
                      </span>
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input type="radio" name="radio-10" className="radio checked:radio-secondary" checked />
                      <span className="label-text">
                        <span className="label-text">
                          <div className="flex flex-row items-center justify-start gap-1">
                            <select className="select select-secondary w-1/2">
                              <option disabled selected>
                                Day
                              </option>
                              {Array.from({ length: 31 }).map((day, index) => (
                                <option>{index + 1}</option>
                              ))}
                            </select>
                            <select className="select select-secondary w-2/3">
                              <option disabled selected>
                                Weekday
                              </option>
                              {Array.from([
                                'Sunday',
                                'Monday',
                                'Tuesday',
                                'Wednesday',
                                'Thursday',
                                'Friday',
                                'Saturday',
                              ]).map((day, index) => (
                                <option>{day}</option>
                              ))}
                            </select>
                          </div>
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <span className="text-xs text-base-content/60">
                  This bill will repeat every x months on a specific day of the month.
                </span>
              </div>
            )}
            {selectedRecurrence === Recurrence.Yearly && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <span className="font-bold">Repeat every</span>
                  <input
                    type="number"
                    defaultValue={1}
                    className="input w-full max-w-[40px] h-8 px-1 text-center border-base-content input-primary focus:border-none"
                  />
                  <span className="font-bold">years</span>
                </div>
                <div className="flex flex-col items-start gap-2 border rounded-xl p-2">
                  <div className="form-control">
                    <label className="label cursor-pointer gap-2">
                      <input type="radio" name="radio-10" className="radio checked:radio-primary" checked />
                      <span className="label-text">
                        <div className="flex flex-row items-center justify-start gap-2">
                          <select className="select select-secondary w-1/2">
                            <option disabled selected>
                              Day
                            </option>
                            {Array.from({ length: 31 }).map((day, index) => (
                              <option>{index + 1}</option>
                            ))}
                          </select>
                          <span className="font-bold">of</span>
                          <select className="select select-secondary w-2/3">
                            <option disabled selected>
                              Month
                            </option>
                            {Array.from([
                              'January',
                              'February',
                              'March',
                              'April',
                              'May',
                              'June',
                              'July',
                              'August',
                              'September',
                              'October',
                              'November',
                              'December',
                            ]).map((day, index) => (
                              <option>{day}</option>
                            ))}
                          </select>
                        </div>
                      </span>
                    </label>
                  </div>
                </div>
                <span className="text-xs text-base-content/60">
                  This bill will repeat every x years on a specific day of a specific month.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
