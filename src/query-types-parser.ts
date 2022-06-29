import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";

// Similar to https://github.com/xpepermint/query-types but with TypeScript support

function isObject(val: string) {
  return val.constructor === Object;
}

function isNumber(val: string) {
  return !isNaN(parseFloat(val));
}

function isBoolean(val: string) {
  return val === "false" || val === "true";
}

function isArray(val: string) {
  return Array.isArray(val);
}

function parseObject(obj: Record<string, any>) {
  var result: Record<string, any> = {};
  var key, val;
  for (key in obj) {
    val = parseValue(obj[key], key);
    if (val !== null) result[key] = val; // ignore null values
  }
  return result;
}

function parseArray(arr: []): any[] {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    result[i] = parseValue(arr[i]);
  }
  return result;
}

function parseNumber(val: string) {
  return Number(val);
}

function parseBoolean(val: string) {
  return val === "true";
}

function parseValue(val: any, key?: string) {
  if (typeof val == "undefined" || val == "") {
    return null;
  } else if (key === "docId" || key === "_id") {
    return new ObjectId(val);
  } else if (isBoolean(val)) {
    return parseBoolean(val);
  } else if (isArray(val)) {
    return parseArray(val);
  } else if (isObject(val)) {
    return parseObject(val);
  } else if (isNumber(val)) {
    return parseNumber(val);
  } else {
    return val;
  }
}

export default function () {
  return function (req: Request, res: Response, next: NextFunction) {
    req.query = parseObject(req.query);
    next();
  };
}
