export default function generatePassword(len) {
  var pwd = [],
    cc = String.fromCharCode,
    R = Math.random,
    S = ['!', '@', '#', '$', '%', '^', '&', '*'],
    rnd,
    i;
  pwd.push(S[0 | (R() * S.length)]);
  pwd.push(cc(48 + (0 | (R() * 10)))); // push a number
  pwd.push(cc(65 + (0 | (R() * 26)))); // push an upper case letter

  for (i = 3; i < len; i++) {
    rnd = 0 | (R() * 62); // generate upper OR lower OR number
    pwd.push(cc(48 + rnd + (rnd > 9 ? 7 : 0) + (rnd > 35 ? 6 : 0)));
  }

  // shuffle letters in password
  return pwd
    .sort(function () {
      return R() - 0.5;
    })
    .join('');
}
