# 軽量版NCMBデータストアライブラリ

データストアを利用するのに特化したJavaScriptライブラリです。機能は限定的なので注意してください。

## 使い方

### データ取得

```js
const applicationKey = 'e61...669';
const clientKey = '65c...247';
const ncmb = new NcmbDS(applicationKey, clientKey);

(async () => {
  const Hello = ncmb.Query('Hello');
  const res = await Hello.fetchAll();
  console.log(res);
})();
```

レスポンス

```js
[
  NCMBObject {
    ncmb: NcmbDS {
    },
    className: 'Group',
    fields: {
      objectId: 'M5S6nu7G653eVMmI',
      createDate: 2019-04-10T06:13:28.429Z,
      updateDate: 2019-04-10T06:13:28.430Z,
      acl: [Object],
      name: 'Group1'
    }
  },
  NCMBObject {
    ncmb: NcmbDS {
    },
    className: 'Group',
    fields: {
      objectId: 'KGOr1xCmWCNfVOJ8',
      createDate: 2019-04-10T06:13:32.424Z,
      updateDate: 2019-04-10T06:13:32.425Z,
      acl: [Object],
      name: 'Group2'
    }
  },
  NCMBObject {
    ncmb: NcmbDS {
    },
    className: 'Group',
    fields: {
      objectId: 'c9MPyM5pViVJf6aH',
      createDate: 2019-04-10T06:13:36.348Z,
      updateDate: 2019-04-10T06:13:36.349Z,
      acl: [Object],
      name: 'Group3'
    }
  }
]
```

## サイズ

- 標準のJavaScript SDK -> 1,033,919バイト（約1MB）
- 軽量版 -> 10,701バイト（約10KB）

## ライセンス

MIT

