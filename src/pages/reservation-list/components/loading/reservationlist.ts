export interface Reservation {
  id: number;
  activity: {
    id: number;
    title: string;
    imageUrl: string;
  };
  status: 'pending' | 'confirmed' | 'declined' | 'canceled' | 'completed';
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  headCount: number;
  reviewSubmitted: boolean;
}

export interface ReservationsResponse {
  cursorId: number;
  totalCount: number;
  reservations: Reservation[];
}

// 예약 생성
export const createReservation = async (
  teamId: string,
  activityId: number,
  data: { scheduleId: number; headCount: number }
): Promise<Reservation> => {
  const accessToken = localStorage.getItem('accessToken') ?? '';

  const res = await fetch(
    `https://sp-globalnomad-api.vercel.app/${teamId}/activities/${activityId}/reservations`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error('예약 생성에 실패했습니다.');
  }

  return res.json();
};

// 예약 목록 조회
export const getReservations = async (
  teamId: string,
  cursorId?: number,
  size: number = 5
): Promise<ReservationsResponse> => {
  const accessToken = localStorage.getItem('accessToken') ?? '';

  let url = `https://sp-globalnomad-api.vercel.app/${teamId}/my-reservations?size=${size}`;
  if (cursorId !== undefined && cursorId !== 0) {
    url += `&cursorId=${cursorId}`;
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('예약 목록을 불러오는데 실패했습니다.');
  }

  return res.json();
};

// 예약 취소
export const cancelReservation = async (teamId: string, reservationId: number): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken') ?? '';

  const res = await fetch(
    `https://sp-globalnomad-api.vercel.app/${teamId}/my-reservations/${reservationId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: 'canceled' }),
    }
  );

  if (!res.ok) {
    throw new Error('예약 취소에 실패했습니다.');
  }
};
