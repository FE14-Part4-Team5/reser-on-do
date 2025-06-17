import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';

import { formatDateToYMD } from '@/utils/datetime';

import Dropdown from '../dropdown/Dropdown';

import ArrowDownIcon from '@/assets/icons/icon_alt arrow_down.svg?react';
import CalendarIcon from '@/assets/icons/icon_calendar.svg?react';
import PlusIcon from '@/assets/icons/icon_plus.svg?react';
import MinusIcon from '@/assets/icons/icon_minus.svg?react';
import ArrowLeft from '@/assets/icons/icon_alt arrow_left.svg?react';
import ArrowRight from '@/assets/icons/icon_alt arrow_right.svg?react';

import styles from './ScheduleSection.module.css';
import { useFormContext } from 'react-hook-form';
import type { GeneralInfoFormValues } from '../../schema/schema';
import clsx from 'clsx';

const ScheduleSection = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const formattedDate = formatDateToYMD(date);

  const [showDropdownFor, setShowDropdownFor] = useState<'start' | 'end' | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const [schedules, setSchedules] = useState<
    { date: string; startTime: string; endTime: string }[]
  >([]);

  const isFirstRender = useRef(true);

  const removeSchedule = (indexToRemove: number) => {
    setSchedules(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleClickCalendar = () => {
    setShowCalendar(prev => !prev);
  };

  const {
    register,
    setValue,

    formState: { errors, isSubmitted, submitCount },
  } = useFormContext<GeneralInfoFormValues>();

  useEffect(() => {
    register('schedules');
  }, [register]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setValue('schedules', schedules);
  }, [schedules, setValue]);

  return (
    <div className={styles.scheduleSection}>
      <div className={styles.scheduleSectionTitle}>예약 가능한 시간대</div>
      <div className={styles.labelFlex}>
        <label htmlFor="date" className={styles.dateLabel}>
          날짜
        </label>
        <label htmlFor="startTime" className={styles.startTimeLabel}>
          시작 시간
        </label>
        <label htmlFor="endTime" className={styles.endTimeLabel}>
          종료 시간
        </label>
      </div>
      <div className={styles.dateWrapper}>
        <div onClick={handleClickCalendar} className={styles.calendarInputWrapper}>
          <input
            type="text"
            id="date"
            value={formattedDate}
            placeholder="yy/mm/dd"
            readOnly
            className={clsx(
              styles.dateInput,
              errors.schedules && !schedules.length && styles.error
            )}
          />
          <CalendarIcon className={styles.calendarIcon} />
        </div>
        <input type="hidden" name="date" value={formattedDate} />
        <div className={styles.selectTime}>
          <div
            onClick={() => setShowDropdownFor(prev => (prev === 'start' ? null : 'start'))}
            role="button"
            className={clsx(
              styles.selectTimeWrapper,
              errors.schedules && !schedules.length && styles.error
            )}
          >
            <div role="button" id="startTime" className={styles.selectStartTime}>
              {startTime || '0:00'}
            </div>
            <ArrowDownIcon />
            {showDropdownFor === 'start' && (
              <Dropdown
                options={hours}
                selected={startTime}
                onSelect={value => {
                  setStartTime(value);
                  setEndTime('');
                  setShowDropdownFor(null);
                }}
              />
            )}
          </div>
          <input type="hidden" name="startTime" value={startTime} />
          <div className={styles.selectTimeDash}>-</div>
          <div
            onClick={() => {
              if (!startTime || startTime === '23:00') return;
              setShowDropdownFor(prev => (prev === 'end' ? null : 'end'));
            }}
            role="button"
            className={clsx(
              styles.selectTimeWrapper,
              errors.schedules && !schedules.length && styles.error
            )}
          >
            <div role="button" id="endTime" className={styles.selectEndTime}>
              {endTime || '0:00'}
            </div>
            <ArrowDownIcon />
            {showDropdownFor === 'end' && (
              <Dropdown
                options={hours.filter(h => parseInt(h) > parseInt(startTime))}
                selected={endTime}
                onSelect={value => {
                  setEndTime(value);
                  setShowDropdownFor(null);
                }}
              />
            )}
          </div>
          <input type="hidden" name="endTime" value={endTime} />
          <div
            onClick={() => {
              if (!startTime || !endTime || startTime === '23:00') return;

              const newSchedule = {
                date: formattedDate,
                startTime,
                endTime,
              };

              setSchedules(prev => [...prev, newSchedule]);
              setStartTime('');
              setEndTime('');
            }}
            role="button"
            className={styles.selectTimeButton}
          >
            <PlusIcon className={styles.selectTimeButtonIcon} />
          </div>
        </div>
      </div>
      {(isSubmitted || submitCount > 0) && errors.schedules && schedules.length === 0 && (
        <p className={styles.errorMessage}>{errors.schedules?.message}</p>
      )}

      {schedules.length > 0 && <hr className={styles.hr} />}

      <div className={styles.schedulesWrapper}>
        {schedules.map((s, idx) => (
          <div key={idx} className={styles.scheduleTag}>
            <div className={styles.dateWrapper}>
              <div className={styles.calendarInputWrapper}>
                <div className={styles.dateInput}>{s.date}</div>
              </div>
              <div className={styles.selectTime}>
                <div className={styles.selectTimeWrapper}>
                  <div className={styles.selectStartTime}>{s.startTime}</div>
                </div>
                <div className={styles.selectTimeDash}>-</div>
                <div className={styles.selectTimeWrapper}>
                  <div className={styles.selectEndTime}>{s.endTime}</div>
                </div>
                <div className={styles.selectTimeButton} onClick={() => removeSchedule(idx)}>
                  <MinusIcon className={styles.selectTimeButtonIcon} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showCalendar && (
        <div className={styles.modalOverlay} onClick={() => setShowCalendar(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Calendar
              onChange={value => {
                if (value instanceof Date) {
                  setDate(value);
                  setShowCalendar(false);
                }
              }}
              value={date}
              prevLabel={<ArrowLeft style={{ width: 24, height: 24 }} />}
              nextLabel={<ArrowRight style={{ width: 24, height: 24 }} />}
              prev2Label={null}
              next2Label={null}
              locale="ko-KR"
              className={styles.calendar}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleSection;
