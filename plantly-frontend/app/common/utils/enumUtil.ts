export function mapPlacementEnumToString(placement: 'sunny' | 'semi_shade' | 'shade'){
  if(placement === 'sunny'){
    return 'Sunny';
  }

  if(placement === 'shade'){
    return 'Shade';
  }

  if(placement === 'semi_shade'){
    return 'Semi-Shade';
  }

  return '';
}

export function mapMonthToString(monthNr: number, offset: number = 1){
  return MONTHS[monthNr+offset];
}

export function mapMonthArrayToString(months: number[], offset: number = 1){
  return  months.map(m => mapMonthToString(m, offset)).join(', ')
}

const MONTHS = [
  "", // index 0 is unused to align with 1-based month numbers
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]