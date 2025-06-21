import { useEffect, useRef, useState } from 'react';
import { useToast } from './useToast';
import { useFormContext, useWatch } from 'react-hook-form';
import type { GeneralInfoFormValues } from '@/pages/add-edit-experiences/schema/schema';
import { formatDateToYMD, hasOverlap } from '@/utils/datetime';
import IconError from '@/assets/icons/modalwarning.svg';

export const useScheduleSection = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [schedules, setSchedules] = useState<
    { id?: number; date: string; startTime: string; endTime: string }[]
  >([]);
  const [scheduleIdsToRemove, setScheduleIdsToRemove] = useState<number[]>([]);
  const [showDropdownFor, setShowDropdownFor] = useState<'start' | 'end' | null>(null);

  const {
    register,
    setValue,
    formState: { errors, isSubmitted, submitCount },
  } = useFormContext<GeneralInfoFormValues>();

  useEffect(() => {
    register('schedules');
    register('scheduleIdsToRemove');
  }, [register]);

  const watchedSchedules = useWatch<GeneralInfoFormValues>({ name: 'schedules' });
  const watchedScheduleIdsToRemove = useWatch<GeneralInfoFormValues>({
    name: 'scheduleIdsToRemove',
  });

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

  const handleClickCalendar = () => {
    setShowCalendar(prev => !prev);
  };

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

  const formattedDate = formatDateToYMD(date);
  const addSchedule = () => {
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

    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    const newSchedules = [...schedules, { date: formattedDate, startTime, endTime }];
    const sortedSchedules = newSchedules.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return toMinutes(a.startTime) - toMinutes(b.startTime);
    });

    setSchedules(sortedSchedules);
    setStartTime('');
    setEndTime('');
  };

  const removeSchedule = (indexToRemove: number) => {
    setSchedules(prev => {
      const item = prev[indexToRemove];
      if (item.id !== undefined) {
        setScheduleIdsToRemove(prevIds => {
          if (prevIds.includes(item.id!)) {
            return prevIds;
          }
          const nextIds = [...prevIds, item.id!];
          return nextIds;
        });
      }
      const next = prev.filter((_, index) => index !== indexToRemove);
      return next;
    });
  };

  const { showToast } = useToast();

  return {
    date,
    setDate,
    showCalendar,
    setShowCalendar,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    schedules,
    setSchedules,
    scheduleIdsToRemove,
    setScheduleIdsToRemove,
    showDropdownFor,
    setShowDropdownFor,
    errors,
    isSubmitted,
    submitCount,
    addSchedule,
    removeSchedule,
    formattedDate,
    handleClickCalendar,
  };
};

export const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
