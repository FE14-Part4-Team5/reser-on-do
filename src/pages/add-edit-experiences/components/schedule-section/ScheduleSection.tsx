import Calendar from 'react-calendar';

import Dropdown from '../dropdown/Dropdown';

import ArrowDownIcon from '@/assets/icons/icon_alt arrow_down.svg?react';
import CalendarIcon from '@/assets/icons/icon_calendar.svg?react';
import PlusIcon from '@/assets/icons/icon_plus.svg?react';
import MinusIcon from '@/assets/icons/icon_minus.svg?react';
import ArrowLeft from '@/assets/icons/icon_alt arrow_left.svg?react';
import ArrowRight from '@/assets/icons/icon_alt arrow_right.svg?react';

import clsx from 'clsx';
import styles from './ScheduleSection.module.css';
import { hours, useScheduleSection } from '@/hooks/useScheduleSection';

const ScheduleSection = () => {
  const {
    date,
    setDate,
    showCalendar,
    setShowCalendar,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    schedules,
    addSchedule,
    removeSchedule,
    showDropdownFor,
    setShowDropdownFor,
    errors,
    isSubmitted,
    submitCount,
    formattedDate,
    handleClickCalendar,
  } = useScheduleSection();
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
          <div onClick={addSchedule} role="button" className={styles.selectTimeButton}>
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
