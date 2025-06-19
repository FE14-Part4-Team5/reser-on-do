import { useEffect, useState, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Calendar from 'react-calendar';

import Dropdown from '../dropdown/Dropdown';

import { useToast } from '@/hooks/useToast';

import { formatDateToYMD } from '@/utils/datetime';

import type { GeneralInfoFormValues } from '../../schema/schema';

import ArrowDownIcon from '@/assets/icons/icon_alt arrow_down.svg?react';
import CalendarIcon from '@/assets/icons/icon_calendar.svg?react';
import PlusIcon from '@/assets/icons/icon_plus.svg?react';
import MinusIcon from '@/assets/icons/icon_minus.svg?react';
import ArrowLeft from '@/assets/icons/icon_alt arrow_left.svg?react';
import ArrowRight from '@/assets/icons/icon_alt arrow_right.svg?react';
import IconError from '@/assets/icons/modalwarning.svg';

import clsx from 'clsx';
import styles from './ScheduleSection.module.css';

const ScheduleSection = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const formattedDate = formatDateToYMD(date);

  const [showDropdownFor, setShowDropdownFor] = useState<'start' | 'end' | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [schedules, setSchedules] = useState<
    { id?: number; date: string; startTime: string; endTime: string }[]
  >([]);
  const [scheduleIdsToRemove, setScheduleIdsToRemove] = useState<number[]>([]);

  const removeSchedule = (indexToRemove: number) => {
    setSchedules(prev => {
      const item = prev[indexToRemove];
      setScheduleIdsToRemove(prevIds => {
        if (prevIds.includes(item.id!)) {
          return prevIds;
        }
        const nextIds = [...prevIds, item.id!];
        return nextIds;
      });
      const next = prev.filter((_, index) => index !== indexToRemove);
      return next;
    });
  };

  const handleClickCalendar = () => {
    setShowCalendar(prev => !prev);
  };

  const {
    register,
    setValue,
    formState: { errors, isSubmitted, submitCount },
  } = useFormContext<GeneralInfoFormValues>();

  const watchedSchedules = useWatch<GeneralInfoFormValues>({ name: 'schedules' });
  const watchedScheduleIdsToRemove = useWatch<GeneralInfoFormValues>({
    name: 'scheduleIdsToRemove',
  });

  useEffect(() => {
    register('schedules');
    register('scheduleIdsToRemove');
  }, [register]);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && Array.isArray(watchedSchedules) && watchedSchedules.length > 0) {
      const objectItems = watchedSchedules.filter(
        (item): item is { id?: number; date: string; startTime: string; endTime: string } =>
          typeof item === 'object' &&
          item !== null &&
          'date' in item &&
          'startTime' in item &&
          'endTime' in item
      );
      if (objectItems.length > 0) {
        setSchedules(objectItems);
        initializedRef.current = true;
      }
    }
  }, [watchedSchedules]);
  useEffect(() => {
    if (
      Array.isArray(watchedScheduleIdsToRemove) &&
      watchedScheduleIdsToRemove.length > 0 &&
      scheduleIdsToRemove.length === 0
    ) {
      const numericIds: number[] = watchedScheduleIdsToRemove
        .map(id => {
          if (typeof id === 'number') return id;
          if (typeof id === 'string' && !isNaN(Number(id))) return Number(id);
          return undefined;
        })
        .filter((id): id is number => typeof id === 'number');
      if (numericIds.length > 0) {
        setScheduleIdsToRemove(numericIds);
      }
    }
  }, [watchedScheduleIdsToRemove, scheduleIdsToRemove.length]);

  useEffect(() => {
    setValue('schedules', schedules);
  }, [schedules, setValue]);

  useEffect(() => {
    setValue('scheduleIdsToRemove', scheduleIdsToRemove);
  }, [scheduleIdsToRemove, setValue]);

  const timeToMinutes = (time: string): number => {
    const [hStr, mStr] = time.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    return h * 60 + m;
  };

  const hasOverlap = (intervals: { startTime: string; endTime: string }[]): boolean => {
    const arr = intervals
      .map(item => ({
        start: timeToMinutes(item.startTime),
        end: timeToMinutes(item.endTime),
      }))
      .filter(({ start, end }) => end > start)
      .sort((a, b) => a.start - b.start);
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1].end > arr[i].start) {
        return true;
      }
    }
    return false;
  };

  const { showToast } = useToast();

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
              {startTime || <div style={{ color: 'gray' }}>선택</div>}
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
              {endTime || <div style={{ color: 'gray' }}>선택</div>}
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
              const sameDateIntervals = schedules
                .filter(item => item.date === formattedDate)
                .map(item => ({ startTime: item.startTime, endTime: item.endTime }));
              const newInterval = { startTime, endTime };

              if (hasOverlap([...sameDateIntervals, newInterval])) {
                showToast({
                  label: '해당 날짜에 시간대가 겹칩니다. 다른 시간대를 선택해 주세요.',
                  iconSrc: IconError,
                  style: { color: 'pink' },
                });
                return;
              }
              setSchedules(prev => {
                const next = [...prev, { date: formattedDate, startTime, endTime }];
                return next;
              });
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

      {schedules.length > 0 && (
        <div className={styles.schedulesWrapper}>
          {schedules.map((s, idx) => (
            <div key={`${s.date}-${s.startTime}-${s.endTime}`} className={styles.scheduleTag}>
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
      )}
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

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
