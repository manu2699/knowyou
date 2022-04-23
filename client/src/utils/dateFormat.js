/* eslint-disable import/no-anonymous-default-export */
export default (date) => {
  var d = new Date(date);
  // return `${d.getHours()}:${d.getMinutes()}, ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
}
