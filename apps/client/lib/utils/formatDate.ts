const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const now = new Date(date).toLocaleDateString('en-US', options);

  return now;
};

export default formatDate;
