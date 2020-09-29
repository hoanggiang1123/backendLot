const https = require('https');
const cheerio = require('cheerio');

const { SCHEDULE } = require('../helpers/lotteryMockup')
const { getWeekDay, toSlug, transformDate, generateRandomTitle, sleep } = require('../helpers')
const LotoModel = require('../models/LotoModel')
const CityModel = require('../models/CityModel')

module.exports = class LotteryCraw {

  getCitySlug (date) {
    // const newdate = transformDate(date);
    const daySlug = getWeekDay(date);

    const cities = SCHEDULE[daySlug];

    let slug = '';

    if (cities[Object.keys(cities)[0]]) {
        slug = cities[Object.keys(cities)[0]].slug;
    }

    return slug;
  }

  getCrawLotteryUrl (area, startDate, endDate) {

    let newStartDate = transformDate(startDate);
    let newEndDate = transformDate(endDate);
    let current = new Date(newStartDate);
    let end = new Date(newEndDate);

    let dateArr = [];

    while(current <= end) {
        const newDate = new Date(current);
        let dateStr = newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear();
        const path = '/' + area + '/ngay-' + dateStr;
        let year = newDate.getFullYear();
        let month = newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth();
        let day =  newDate.getDate() < 10 ?  '0' + newDate.getDate() :  newDate.getDate();
        const dayStr = year + '-' + month + '-' + day;
        dateArr = [...dateArr, { path, dayStr }];
        current.setDate(current.getDate() + 1);
    }
    return dateArr;
  }

  getContent (path) {
    return new Promise((resolve, reject) => {
        const options = {
          hostname: 'xskt.com.vn',
          path: path,
          method: 'GET',
          timeout: 3000
        }
        var req = https.request(options, (res) => {
          res.setEncoding('utf8');
          let strData = '';
          res.on('data', data => {
            strData += data;
          })
          res.on('end', () => {
            resolve(strData);
          })
        })
        req.on('timeout', () => {
          resolve(null);
        })
        req.on('error', error => {
          reject(error)
        })
        req.end();
    });
  }

  getLotoNumber(str) {

    str = str.replace(new RegExp('<br>', 'g'),'-');

    let $ = cheerio.load(str);

    return toSlug($.text());
  }

  parseContentMb (table, date) {
    if (!table) return {};
    const $ = cheerio.load(table);

    const items = $('tr');

    let resp = {};

    if (items && items.length) {

        let data = {};

        for (let i = 1; i < items.length; i++) {

            let index = 'g8';
            let result = '';

            if (i === (items.length -1) && $(items[i]).find('td strong.red').length) {

                result = $(items[i]).find('td strong.red').text();
            } else if ($(items[i]).find('td').length > 2) {

                let indexNode = $(items[i]).find('td')[0];
                index = toSlug($(indexNode).text());

                let resultNode = $(items[i]).find('td')[1];
                result = this.getLotoNumber($(resultNode).html());
            }
            data[index] = result;

        }

        let city = this.getCitySlug(date);

        resp[city] =  data;
    }

    return resp;
  }

  parseContent (table) {
    if (!table) return {};
    const $ = cheerio.load(table);

    let resp = {};

    let col = $($('tr')[0]).find('th').length ? ($($('tr')[0]).find('th').length -1 ) : 0

    if (col === 0) return {};

    const items = $('tr');

    if (items && items.length) {

        let data = {};

        for (let i = 0; i < items.length; i++) {

            let row = 'td';

            if (i === 0) row = 'th';

            let rows = $(items[i]).find(row);

            for (let x = 0; x < col; x++) {

                let key = x + 1;

                if (i === 0 ) {

                    let index = toSlug($(rows[key]).text());

                    data[index] = {};
                } else {
                    let head = $(items[0]).find('th');

                    let index = toSlug($(head[key]).text());

                    let idex = toSlug($(rows[0]).text());

                    let value = this.getLotoNumber($(rows[key]).html());

                    data[index][idex] = value;

                }
            }
        }

        resp = data;
    }

    return resp;
  }

  async saveLotteries (urlArr, io) {

    let fail = [];

    for (const k of urlArr) {

      let path = k.path;
      let date = k.dayStr;
      let day = new Date(date).getDay();

      try {

        let content = await this.getContent(path);
        if(content === null) {
          await sleep(5000);
          content = await this.getContent(path);
        }

        if (content !== null) {

          const $ = cheerio.load(content);
          let table = $('table')[0];
          if (table) {

            let data = {};

            if ($(table).attr('id') === 'MB0') {
              data = this.parseContentMb(table, date);
            } else if ($(table).attr('id') === 'MN0' || $(table).attr('id') === 'MT0') {
              data = this.parseContent(table);
            } else {
              io.emit('SERVER_SEND_SAVE_LOTO', { status: 'warning', msg: 'No Lottery on ' + date })
            }

            if(Object.keys(data).length) {

              for (const key of Object.keys(data)) {

                if (data[key]) {

                  const checkSlug = path + '_' + key;
                  try {

                    const check = await LotoModel.checkLotteryExist(checkSlug);

                    if (check === false) {

                      const cityAreaObj = await CityModel.getCityBySlug(key);

                      let city = {};
                      let area = {};
                      let name = '';
                      let subname = '';

                      if (cityAreaObj !== null) {

                        city = { _id: cityAreaObj._id, name: cityAreaObj.name, slug: cityAreaObj.slug, code: cityAreaObj.code };
                        area = { _id: cityAreaObj.area._id, name: cityAreaObj.area.name, slug: cityAreaObj.area.slug, code: cityAreaObj.area.code, order: cityAreaObj.area.order }
                        name = generateRandomTitle(cityAreaObj.name, cityAreaObj.code);
                        subname = generateRandomTitle(cityAreaObj.area.name, cityAreaObj.area.code);
                      }

                      const { db, g1, g2, g3, g4, g5, g6, g7, g8 } = data[key];
                      const result = { db, g1, g2, g3, g4, g5, g6, g7, g8 };
                      const loto = { name, subname, result, area, city, date, day, check: checkSlug };

                      LotoModel.saveLoto(loto).then((res) => {
                        if (res === 'ok') {
                          console.log(`success ${checkSlug}`)
                          io.emit('SERVER_SEND_SAVE_LOTO', { status: 'success', msg: 'success ' + checkSlug })
                        }
                      }).catch(err => {
                        io.emit('SERVER_SEND_SAVE_LOTO', { status: 'error', msg: 'Error on crawling' + checkSlug })
                      });

                    } else {

                      console.log(`Lottery already exsit ${checkSlug}`);
                      io.emit('SERVER_SEND_SAVE_LOTO', { status: 'warning', msg: 'Lottery already exsit ' + checkSlug })
                    }

                  } catch (err) {
                    console.log(err);
                    io.emit('SERVER_SEND_SAVE_LOTO', { status: 'error', msg: 'Error on crawling' + checkSlug })
                  }

                }
              }
            }
          }

        } else {
          fail.push(k);
        }

      } catch (err) {
        io.emit('SERVER_SEND_SAVE_LOTO', { status: 'error', msg: 'Can not get loto content' })
      }
    }

    return fail
  }
}
