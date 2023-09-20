import React, { useRef, useState } from 'react';
import { ScanQrCodeH5 } from "cjm-scan/dist/esm";

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

export default App;
