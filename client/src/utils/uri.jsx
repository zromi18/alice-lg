
/*
 * URI Helpers
 * -----------
 *
 * Provide methods for handling query strings
 */

export const parseQueryString = function(query) {
  let result = {};
  // Ommit leading '?' if present
  if (query[0] === "?") {
    query = query.substr(1);
  }
  
  const params = query.split("&");
  for (let p of params) {
    let [k,v] = p.split("=", 2);
    result[decodeURIComponent(k)] = decodeURIComponent(v); 
  }

  return result;
}

