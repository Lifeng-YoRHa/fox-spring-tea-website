/*
 * 共享数据生成逻辑：admin.html（浏览器）与 scripts/generate-api.js（node）共用。
 * 同一「商品ID+日期」生成的数据恒定（FNV-1a 风格 hash + LCG 确定性伪随机）。
 */
(function (global) {
  'use strict';

  /* ============ 商品清单（固定 ID / 货号 / 名称） ============ */
  var PRODUCTS = [
    { id: '900000000001', sku: 'A1-S短款',       name: 'ZAMST/赞斯特运动护踝轻薄篮球跑步羽毛球稳定踝关节A1-S短款护具' },
    { id: '900000000002', sku: 'A2-DX',          name: '【球星同款】ZAMST赞斯特篮球排球稳定踝关节硬运动护踝护具A2-DX' },
    { id: '900000000003', sku: 'A1',             name: 'ZAMST/赞斯特运动护踝篮球足球跑步防扭伤中度支撑护踝A1' },
    { id: '900000000004', sku: 'A1长款',         name: 'ZAMST赞斯特护踝运动跑步篮球排球防崴脚A1长款护具' },
    { id: '900000000005', sku: 'EK-3',           name: 'ZAMST/赞斯特运动护膝篮球跑步登山羽毛球髌骨带护膝EK-3' },
    { id: '900000000006', sku: 'EK-5',           name: 'ZAMST赞斯特护膝运动篮球跑步专业半月板韧带护膝EK-5' },
    { id: '900000000007', sku: 'ZK-7',           name: 'ZAMST/赞斯特专业运动护膝篮球排球滑雪强支撑护膝ZK-7' },
    { id: '900000000008', sku: 'ZK-3',           name: 'ZAMST赞斯特护膝轻薄透气跑步健身羽毛球运动护膝ZK-3' },
    { id: '900000000009', sku: 'Wrist Wrap',     name: 'ZAMST/赞斯特运动护腕篮球羽毛球网球扭伤防护护腕' },
    { id: '900000000010', sku: 'Filmista护踝',   name: 'ZAMST赞斯特Filmista飞斯特轻薄运动护踝足球跑步护具' },
    { id: '900000000011', sku: 'Bodymate护腰',   name: 'ZAMST/赞斯特Bodymate运动护腰健身篮球跑步腰部支撑护具' },
    { id: '900000000012', sku: 'AT-1',           name: 'ZAMST赞斯特跟腱护具运动跑步篮球跟腱保护护具AT-1' },
    { id: '900000000013', sku: 'IK-1',           name: 'ZAMST/赞斯特运动护膝跑步骑行健身轻薄透气护膝IK-1' },
    { id: '900000000014', sku: 'SK-3',           name: 'ZAMST赞斯特护肩运动篮球排球羽毛球肩部支撑护具SK-3' },
    { id: '900000000015', sku: 'Elbow Sleeve',   name: 'ZAMST/赞斯特运动护肘篮球网球羽毛球手臂加压护肘' }
  ];

  /* 表头：必需列 + 参照真实文件补充的无关列（主商品ID/商品类型/商品状态/商品标签） */
  var HEADERS = [
    '统计日期', '商品ID', '商品名称', '主商品ID', '商品类型', '货号', '商品状态', '商品标签',
    '商品访客数', '商品浏览量', '平均停留时长', '商品收藏人数', '商品加购件数', '商品加购人数',
    '支付买家数', '支付件数', '支付金额', '商品支付转化率', '支付老买家数', '老买家支付金额', '成功退款金额'
  ];
  /* 文本列（左对齐，导出为字符串），其余为数值列 */
  var TEXT_COLS = { '统计日期': 1, '商品ID': 1, '商品名称': 1, '主商品ID': 1, '商品类型': 1, '货号': 1, '商品状态': 1, '商品标签': 1, '商品支付转化率': 1 };

  /* ============ 确定性伪随机数（hash + LCG） ============ */
  function hashSeed(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function makeRng(seed) {
    var state = seed >>> 0;
    return function () {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function randInt(rng, min, max) {
    return min + Math.floor(rng() * (max - min + 1));
  }

  function fmtInt(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function fmtMoney(n) {
    var parts = n.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  /* ============ 数据生成：同一 商品ID+日期 结果恒定 ============ */
  function buildRows(dateStr) {
    var rows = [];
    for (var i = 0; i < PRODUCTS.length; i++) {
      var p = PRODUCTS[i];
      var rng = makeRng(hashSeed(p.id + '|' + dateStr));

      var visitors = randInt(rng, 200, 1500);
      var views = Math.round(visitors * (1.8 + rng() * 1.4));
      var staySec = 8 + rng() * 12;                    // 平均停留时长（秒）
      var favs = randInt(rng, 0, 30);                  // 收藏人数
      var cartItems = randInt(rng, 10, Math.max(10, Math.round(visitors * 0.15)));
      var cartBuyers = Math.max(1, Math.round(cartItems * (0.6 + rng() * 0.2)));
      var payBuyers = randInt(rng, 1, Math.max(1, Math.round(cartBuyers * 0.6)));
      var payItems = payBuyers + randInt(rng, 0, Math.max(1, Math.round(payBuyers * 0.3)));
      var unitPrice = 249 + randInt(rng, 0, 200);
      var payAmount = payItems * unitPrice;
      var convRate = (payBuyers / visitors * 100);
      var oldBuyers = randInt(rng, 0, payBuyers);
      var oldAmount = oldBuyers > 0 ? Math.round(payAmount * (0.05 + rng() * 0.2) * 100) / 100 : 0;
      var refund = Math.round(payAmount * rng() * 0.2 * 100) / 100;

      rows.push([
        dateStr,                       // 统计日期
        p.id,                          // 商品ID
        p.name,                        // 商品名称
        p.id,                          // 主商品ID
        '主商品',                       // 商品类型
        p.sku,                         // 货号
        '当前在线',                     // 商品状态
        '-',                           // 商品标签
        fmtInt(visitors),              // 商品访客数
        fmtInt(views),                 // 商品浏览量
        Math.round(staySec * 100) / 100, // 平均停留时长（数值）
        fmtInt(favs),                  // 商品收藏人数
        fmtInt(cartItems),             // 商品加购件数
        fmtInt(cartBuyers),            // 商品加购人数
        fmtInt(payBuyers),             // 支付买家数
        fmtInt(payItems),              // 支付件数
        fmtMoney(payAmount),           // 支付金额
        convRate.toFixed(2) + '%',     // 商品支付转化率
        fmtInt(oldBuyers),             // 支付老买家数
        fmtMoney(oldAmount),           // 老买家支付金额
        fmtMoney(refund)               // 成功退款金额
      ]);
    }
    return rows;
  }

  var api = {
    PRODUCTS: PRODUCTS,
    HEADERS: HEADERS,
    TEXT_COLS: TEXT_COLS,
    hashSeed: hashSeed,
    makeRng: makeRng,
    randInt: randInt,
    fmtInt: fmtInt,
    fmtMoney: fmtMoney,
    buildRows: buildRows
  };

  /* node/CommonJS 环境导出；浏览器环境挂到全局（保持原 admin.html 的全局变量用法） */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.PRODUCTS = PRODUCTS;
    global.HEADERS = HEADERS;
    global.TEXT_COLS = TEXT_COLS;
    global.buildRows = buildRows;
  }
})(typeof window !== 'undefined' ? window : globalThis);
