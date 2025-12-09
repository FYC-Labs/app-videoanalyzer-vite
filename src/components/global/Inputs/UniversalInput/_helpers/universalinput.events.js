export const isEmailValid = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return email?.length && emailRegex.test(email);
};

export const formatPhone = (phone) => {
  if (!phone?.length) return '';

  const cleaned = phone?.replace(/\D/g, '');
  const length = cleaned?.length;

  if (length < 4) return cleaned;
  if (length < 7) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  return `(${cleaned?.slice(0, 3)}) ${cleaned?.slice(3, 6)}-${cleaned?.slice(6, 10)}`;
};

export const formatDate = (dateTime) => new Date(dateTime).toISOString().slice(0, 10);
export const formatTime = (dateTime) => {
  const date = new Date(dateTime);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
