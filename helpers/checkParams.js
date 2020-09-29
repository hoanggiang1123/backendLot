exports.checkQueryCrawler = (query) => {
  let area = from = to = ''
  if (Object.keys(query).length) {
    if (query.hasOwnProperty('area')) {
      area = query.area
    }
    if (query.hasOwnProperty('from')) {
      from = query.from
    }
    if (query.hasOwnProperty('to')) {
      to = query.to
    }
  }
  return { area, from, to }
}
