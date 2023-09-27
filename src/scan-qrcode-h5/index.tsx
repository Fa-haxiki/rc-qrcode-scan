import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  ChangeEventHandler,
} from "react";
import {
  Html5Qrcode,
  QrcodeErrorCallback,
  QrcodeSuccessCallback,
} from "html5-qrcode";
import "./index.css";

export type ScanQrCodeH5Ref = {
  /**
   * 开始扫描
   */
  initScan: Function;
  /**
   * 停止扫描
   */
  stopScan: Function;
  /**
   * 获取错误信息
   */
  getError: () => string;
};

export type ScanQrCodeH5Props = {
  /**
   * 顶部提示语
   */
  scanTips?: string;
  /**
   * 扫描成功回调
   */
  onScanSuccess?: QrcodeSuccessCallback;
  /**
   * 扫描失败回调
   */
  onScanError?: QrcodeErrorCallback;
  /**
   * 关闭回调
   */
  onClose?: Function;
};

const ScanQrCodeH5 = forwardRef<ScanQrCodeH5Ref, ScanQrCodeH5Props>(
  ({ scanTips = "请对准二维码", onScanSuccess, onScanError, onClose }, ref) => {
    const html5QrCodeRef = useRef<Html5Qrcode>();
    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
      return () => {
        stopScan();
      };
    }, []);

    useImperativeHandle(ref, () => ({
      initScan,
      stopScan,
      getError: () => error,
    }));

    const onSuccess: QrcodeSuccessCallback = useCallback(
      (_decodedText, _result) => {
        stopScan();
        onScanSuccess?.(_decodedText, _result);
      },
      [],
    );

    const onFail: QrcodeErrorCallback = useCallback((_errorMessage, _error) => {
      onScanError?.(_errorMessage, _error);
    }, []);

    const startScan = useCallback(() => {
      html5QrCodeRef.current
        ?.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: window.innerWidth * 0.8 - 15,
              height: window.innerWidth * 0.8 - 15,
            },
            aspectRatio: 1.0,
          },
          onSuccess,
          onFail,
        )
        .catch((err) => {
          // 错误信息处理仅供参考，具体情况看输出！！！
          if (typeof err === "string") {
            setError(err);
          } else {
            if (err.name === "NotAllowedError")
              setError("您需要授予相机访问权限");
            if (err.name === "NotFoundError") setError("这个设备上没有摄像头");
            if (err.name === "NotSupportedError")
              setError("摄像头访问只支持在安全的上下文中，如https或localhost");
            if (err.name === "NotReadableError") setError("相机被占用");
            if (err.name === "OverconstrainedError")
              setError("安装摄像头不合适");
            if (err.name === "StreamApiNotSupportedError")
              setError("此浏览器不支持流API");
          }
        });
    }, []);

    const stopScan = useCallback(() => {
      if (!html5QrCodeRef.current?.isScanning) {
        setError("");
        setOpen(false);
        return;
      }
      html5QrCodeRef.current
        ?.stop()
        .then(() => {
          setError("");
          setOpen(false);
          html5QrCodeRef.current?.clear();
        })
        .catch((err) => {
          setError("Unable to stop scanning." + JSON.stringify(err));
        });
    }, []);

    const initScan = useCallback(() => {
      setOpen(true);
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            html5QrCodeRef.current = new Html5Qrcode("cjm-qrcode-reader");
            startScan();
          }
        })
        .catch(() => {
          setError("您需要授予相机访问权限");
        });
    }, []);

    const closeScan = useCallback(() => {
      onClose?.();
      stopScan();
    }, []);

    const scanFile = useCallback((file: File) => {
      html5QrCodeRef.current
        ?.scanFileV2(file, false)
        .then((res) => {
          onSuccess(res.decodedText, res);
        })
        .catch(() => {
          setError("扫不到码，请重试");
          startScan();
        });
    }, []);

    const onPhotoChange: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        if (!e.target.files?.length) {
          return;
        }
        const file = e.target.files[0];
        if (html5QrCodeRef.current?.isScanning) {
          html5QrCodeRef.current
            ?.stop()
            .then(() => {
              html5QrCodeRef.current?.clear();
              scanFile(file);
            })
            .catch((err) => {
              setError("无法停止扫码，请刷新页面重试。" + JSON.stringify(err));
            });
        } else {
          scanFile(file);
        }
      },
      [],
    );

    return (
      <div className="cjm-scan-container" data-open={open}>
        <div className="cjm-scan-mask">
          <div className="cjm-scan-tips">{scanTips}</div>
          <div id="cjm-qrcode-reader" className="cjm-qrcode-reader" />
          <p className="cjm-scan-error">{error}</p>
          <div className="cjm-actions">
            <div className="cjm-scan-close" onClick={closeScan}>
              关闭
            </div>
            <label htmlFor="cjm-photos-input">
              <div className="cjm-scan-photos">相册</div>
            </label>
            <input
              id="cjm-photos-input"
              name="cjm-photos-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onPhotoChange}
            />
          </div>
        </div>
      </div>
    );
  },
);

export default ScanQrCodeH5;
