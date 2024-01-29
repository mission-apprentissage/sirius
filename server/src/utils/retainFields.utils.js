const retainFields = (obj, fields) => {
  const filterObject = (obj, fields) => {
    let result = {};
    Object.keys(obj).forEach((key) => {
      if (fields.includes(key) || fields.some((field) => field.startsWith(key + "."))) {
        if (obj[key] instanceof Object && !Array.isArray(obj[key])) {
          let nestedFields = fields
            .filter((field) => field.startsWith(key + "."))
            .map((field) => field.substring(field.indexOf(".") + 1));
          result[key] = filterObject(obj[key], nestedFields);
        } else {
          result[key] = obj[key];
        }
      }
    });
    return result;
  };

  if (Array.isArray(obj)) {
    return obj.map((item) => filterObject(item, fields));
  } else {
    return filterObject(obj, fields);
  }
};

module.exports = retainFields;
