const toSlug = (str) => {
  str = str.toLowerCase();
  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  str = str.replace(/(đ)/g, 'd');
  str = str.replace(/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/g, 'A');
  str = str.replace(/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/g, 'E');
  str = str.replace(/(Ì|Í|Ị|Ỉ|Ĩ)/g, 'I');
  str = str.replace(/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/g, 'O');
  str = str.replace(/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/g, 'U');
  str = str.replace(/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/g, 'Y');
  str = str.replace(/(Đ)/g, 'D');
  str = str.replace(/(\.)/g, '');
  str = str.replace(/(\“|\”|\‘|\’|\,|\!|\&|\;|\@|\#|\%|\~|\`|\=|\_|\'|\]|\[|\}|\{|\)|\(|\+|\^)/g, '-');
  str = str.replace(/( )/g, '-');
  return str;
}

const transformDate = (date) => {

  let newdate = '';

  const dateArr = date.split('-');

  if(dateArr.length === 3) {
      newdate = dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0];
  }

  return newdate;
}

const getWeekDay = (date) => {

  const dayOfWeek = new Date(date).getDay();

  return isNaN(dayOfWeek) ? null :
  ['chu-nhat', 'thu-2', 'thu-3', 'thu-4', 'thu-5', 'thu-6', 'thu-7'][dayOfWeek];
}

const sleep = (second) => {
  return new Promise(resolve => setTimeout(resolve,second));
}

const generateRandomTitle =  (fullname, sumname) => {

  let kq = ['Kết quả', 'KQ'];
  let kqStr = kq[Math.floor(Math.random() * kq.length)];
  let xs = ['xổ số', 'xs', 'sx'];
  let xsStr = xs[Math.floor(Math.random() * xs.length)];
  let area = [fullname, sumname];
  let areaStr = area[Math.floor(Math.random() * area.length)];

  return kqStr + ' ' + xsStr + ' ' + areaStr;
}

module.exports = {
  toSlug,
  transformDate,
  getWeekDay,
  sleep,
  generateRandomTitle
}
