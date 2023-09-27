# rc-qrcode-scan React二维码扫描器

## 使用/Usage

```bash
$ npm install cjm-scan
```

```jsx
function App() {
  const scanCodeRef = useRef();
  const [scanResult, setScanResult] = useState('');

  function startScan() {
    scanCodeRef.current?.initScan();
  }

  return (
    <div>
      <button onClick={startScan}>扫一扫</button>
      <p>扫描结果: {scanResult}</p>
      <ScanQrCodeH5
        ref={scanCodeRef}
        scanTips="请一定要对准二维码哦～"
        onScanSuccess={(text) => {
          setScanResult(text);
        }}
        // onScanError={(err) => {
        //   console.log(err);
        // }}
      />
    </div>
  );
}
```

#### Props
|  属性 | 类型       | 默认值    | 说明 |
| --- |----------|--------| --- |
|  scanTips | string   | 请对准二维码 | 顶部提示语 |
|  onScanSuccess | function | null   | 扫描成功回调 |
|  onScanError | function | null   | 扫描失败回调 |
|  onClose | function | null   | 关闭回调 |

#### Functions
| 方法 | 说明 |
|----| --- |
|  initScan | 开始扫描 |
|  stopScan | 关闭扫描 |
|  getError | 获取错误信息 |

## 预览/Preview

![demo.gif](https://raw.githubusercontent.com/Fa-haxiki/rc-qrcode-scan/main/screenshot/demo.gif)


## 开发/Development

> Node >= 14.20.0

```bash
1. npm install
2. npm run dev
3. npm run start:examples // 开启demo调试
4. npm run link // 把本地的包link到examples中
```
## LICENSE

MIT
