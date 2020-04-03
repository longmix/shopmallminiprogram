function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  //var hour = date.getHours()
  //var minute = date.getMinutes()
  //var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') 
  //+ ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTime2(date) {
  var h = date.getHours()
  var m = date.getMinutes()
  return [h, m].map(formatNumber).join(':')
}


function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
  sprintf: sprintf
}

function checkStringEmpty(data){
  if(null == data || "" == data){
    return false;
  }
  return true;
}

function str_repeat(i, m) {
  for (var o = []; m > 0; o[--m] = i);
  return o.join('');
}

function sprintf() {
  var i = 0, a, f = arguments[i++], o = [], m, p, c, x, s = '';
  while (f) {
    if (m = /^[^\x25]+/.exec(f)) {

      o.push(m[0]);

    } else if (m = /^\x25{2}/.exec(f)) {

      o.push('%');

    } else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {

      if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
        throw ('Too few arguments.');

      }
      if (/[^s]/.test(m[7]) && (typeof (a) != 'number')) {

        throw ('Expecting number but found ' + typeof (a));

      }
      switch (m[7]) {
        case 'b': a = a.toString(2); break;
        case 'c': a = String.fromCharCode(a); break;
        case 'd': a = parseInt(a); break;
        case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
        case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
        case 'o': a = a.toString(8); break;
        case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
        case 'u': a = Math.abs(a); break;
        case 'x': a = a.toString(16); break;
        case 'X': a = a.toString(16).toUpperCase(); break;
      }
      a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+' + a : a);
      c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
      x = m[5] - String(a).length - s.length;
      p = m[5] ? str_repeat(c, x) : '';
      o.push(s + (m[4] ? a + p : p + a));

    } else {

      throw ('Huh ?!');

    }
    f = f.substring(m[0].length);

  }
  return o.join('');
}
