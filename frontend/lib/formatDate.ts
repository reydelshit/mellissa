import moment from 'moment';

export function formatDate(date: string, format = 'LL') {
  return moment(date).format(format);
}
