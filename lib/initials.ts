export function getInitials(displayName: string) {
  if (displayName.trim() === '') {
    return '?';
  }

  const initials = displayName
    .replace(/\s\s+/g, ' ') // collapse adjacent spaces to one
    .trim() // remove any leading or trailing spaces
    .toUpperCase()
    .split(' ') // returns array of names
    .map((n) => n[0]); // returns array of initials

  switch (initials.length) {
    case 0:
      return '?';
    case 1:
      return initials[0];
    case 2: // empt
      return initials[0] + initials[1];
    case 3:
      // return initials[0] + initials[1] + initials[2];
      return initials[0] + initials[2];
    default: // 4 or more
      return initials[0];
  }
}

// const testNames = [
//   'K',
//   'John Smith',
//   'John Alan Smith',
//   'John Alan Lee Smith',
//   'JohnSmith',
//   'John St.Charles',
//   'John DeWalt',
//   'John Smith-Phillips',
//   'Lorenzo de Zavala',
// ];
// console.log(testNames.map((n) => getInitials(n)));
