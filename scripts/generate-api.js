/*
 * 预生成静态 JSON 数据接口：api/sales-<YYYY-MM-DD>.json
 * 数据来源与 admin.html 完全同源（assets/data-gen.js 的 buildRows），
 * 同一天生成的 JSON 数值与页面表格 / 导出的 xls 一致。
 *
 * 用法：node scripts/generate-api.js
 * 覆盖范围：2026-07-01 ~ 2026-12-31（过期后重新运行本脚本即可）
 */
'use strict';

var fs = require('fs');
var path = require('path');
var gen = require(path.join(__dirname, '..', 'assets', 'data-gen.js'));

var START = '2026-07-01';
var END = '2026-12-31';
var PLATFORM = '淘宝';
var OUT_DIR = path.join(__dirname, '..', 'api');

/* buildRows 的数值列可能带千分位逗号，统一转回原始数字 */
function toNumber(cell) {
  if (typeof cell === 'number') { return cell; }
  return parseFloat(String(cell).replace(/,/g, ''));
}

/* 转化率列形如 "2.38%"，转为小数 0.0238（保留 4 位，消除浮点尾差） */
function toRate(cell) {
  return Math.round(parseFloat(String(cell).replace('%', '')) * 100) / 10000;
}

/* buildRows 行（22 列，顺序见 assets/data-gen.js 的 HEADERS）→ API 商品对象 */
function rowToProduct(row) {
  return {
    product_id: row[1],                    // 商品ID
    product_name: row[2],                  // 商品名称
    item_no: row[5],                       // 货号
    visits: toNumber(row[8]),              // 商品访客数
    page_views: toNumber(row[9]),          // 商品浏览量
    product_favorites: toNumber(row[11]),  // 商品收藏人数
    cart_items: toNumber(row[12]),         // 商品加购件数
    cart_buyers: toNumber(row[13]),        // 商品加购人数
    orders: toNumber(row[14]),             // 支付买家数
    paid_items: toNumber(row[15]),         // 支付件数
    old_buyer_paying_count: toNumber(row[18]), // 支付老买家数
    avg_stay_duration: toNumber(row[10]),  // 平均停留时长
    gmv: toNumber(row[16]),                // 支付金额
    old_buyer_payment_amount: toNumber(row[19]), // 老买家支付金额
    refund_amount: toNumber(row[20]),      // 成功退款金额
    payment_conversion_rate: toRate(row[17])     // 商品支付转化率
  };
}

function eachDay(start, end, fn) {
  var d = new Date(start + 'T00:00:00Z');
  var last = new Date(end + 'T00:00:00Z');
  while (d <= last) {
    fn(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
  var count = 0;
  eachDay(START, END, function (dateStr) {
    var payload = {
      stat_date: dateStr,
      platform: PLATFORM,
      products: gen.buildRows(dateStr).map(rowToProduct)
    };
    var file = path.join(OUT_DIR, 'sales-' + dateStr + '.json');
    fs.writeFileSync(file, JSON.stringify(payload, null, 2) + '\n', 'utf8');
    count++;
  });
  console.log('generated ' + count + ' files into ' + OUT_DIR);
}

main();
