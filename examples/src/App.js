import React, { useRef, useState } from 'react';
import { ScanQrCodeH5 } from "cjm-scan";

function App() {
  const scanCodeRef = useRef();
  const [scanResult, setScanResult] = useState('');
  const [showScan, setShowScan] = useState(true);

  function startScan() {
    scanCodeRef.current?.initScan();
  }

  function toggleScan() {
    setShowScan(pre => !pre);
  }

  return (
    <div>
      <button onClick={startScan}>扫一扫</button>
      <button onClick={toggleScan}>扫码组件销毁/重启</button>
      <span>组件状态：{showScan ? 'live' : 'killed'}</span>
      <p>扫描结果: {scanResult}</p>
      {showScan && (
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
      )}
    </div>
  );
}

export default App;
