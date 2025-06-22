import { useRef, useState } from 'react';

import useDaumPostcode from './useDaumPostcode';

import type { UseFormSetValue } from 'react-hook-form';
import type { GeneralInfoFormValues } from '@/pages/add-edit-experiences/schema/schema';

export const useDaumPostcodeController = ({
  setValue,
  fieldName = 'address',
}: {
  setValue: UseFormSetValue<GeneralInfoFormValues>;
  fieldName?: keyof GeneralInfoFormValues;
}) => {
  const [sdkOpen, setSdkOpen] = useState(false);
  const postcodeRef = useRef<HTMLDivElement | null>(null);

  const loaded = useDaumPostcode();

  const openPostcode = () => {
    if (!loaded) return;
    setSdkOpen(true);
    const container = postcodeRef.current;
    if (!container) return;

    new window.daum.Postcode({
      oncomplete: data => {
        const selected = data.roadAddress || data.jibunAddress;
        setValue(fieldName, selected, { shouldValidate: true });
        setSdkOpen(false);
      },
      width: '100%',
      height: '100%',
    }).embed(container);
  };

  return {
    postcodeRef,
    sdkOpen,
    setSdkOpen,
    openPostcode,
  };
};
