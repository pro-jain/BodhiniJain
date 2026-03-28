import {
  Battery,
  Bluetooth,
  ChevronDown,
  ChevronRight,
  Lock,
  Power,
  Settings,
  SunMedium,
  Volume2,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";

const ASSET_BASE = import.meta.env.BASE_URL || "/";

interface TopBarProps {
  onActivitiesClick: () => void;
  onPowerClick?: () => void;
  brightness: number;
  onBrightnessChange: (value: number) => void;
}

export default function TopBar({
  onActivitiesClick,
  onPowerClick,
  brightness,
  onBrightnessChange,
}: TopBarProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [volume, setVolume] = useState(72);
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const batteryLevel = 80;
  const batteryRemaining = "2:55 remaining";

  const handlePowerAction = () => {
    setMenuOpen(false);
    onPowerClick?.();
  };

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-2"
      style={{
        height: "30px",
        background:
          "linear-gradient(90deg, rgba(30,14,40,0.9) 0%, rgba(14,12,22,0.92) 60%, rgba(30,14,40,0.9) 100%)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.7), 0 6px 18px rgba(0,0,0,0.35)",
      }}
    >
      {/* Left: Activities */}
      <button
        type="button"
        onClick={onActivitiesClick}
        className="flex items-center gap-1.5 px-2 py-0.5 rounded text-sm font-medium transition-ubuntu hover:bg-white/10 text-white/90"
        style={{ fontSize: "13px" }}
      >
        <img src={`${ASSET_BASE}app-icon.svg`} alt="Activities" width={16} height={16} />
        Activities
      </button>

      {/* Center: Date & Time */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/95 px-2 py-1 rounded-full"
        style={{ fontSize: "13px" }}
      >
        <span className="font-medium">{date}</span>
        <span className="opacity-50">·</span>
        <span className="font-medium tabular-nums">{time}</span>
      </div>

      {/* Right: System tray */}
      <div className="flex items-center gap-0.5 pr-1 text-white/85" style={{ fontSize: "12px" }}>
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/10 transition-ubuntu"
              aria-label="System menu"
            >
              <Wifi
                size={14}
                aria-label="WiFi"
                className={!wifiOn ? "opacity-50" : undefined}
              />
              <Volume2 size={14} aria-label="Volume" />
              <div className="flex items-center gap-0.5">
                <Battery size={14} aria-label="Battery" />
                <span className="tabular-nums">{batteryLevel}%</span>
              </div>
              <ChevronDown size={14} aria-hidden />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={6}
            className="w-80 rounded-xl border border-white/10 bg-[rgba(10,7,16,0.96)] p-4 text-white shadow-2xl backdrop-blur-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex w-28 items-center gap-2 text-sm text-white/85">
                  <Volume2 size={15} />
                  <span>Volume</span>
                </div>
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0] ?? 0)}
                  max={100}
                  className="flex-1"
                  trackColor="rgba(255,255,255,0.15)"
                  rangeColor="#6fb2ff"
                  thumbColor="#6fb2ff"
                />
                <span className="w-10 text-right text-xs text-white/60 tabular-nums">{volume}%</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex w-28 items-center gap-2 text-sm text-white/85">
                  <SunMedium size={15} />
                  <span>Brightness</span>
                </div>
                <Slider
                  value={[brightness]}
                  onValueChange={(value) => onBrightnessChange(value[0] ?? 0)}
                  max={100}
                  className="flex-1"
                  trackColor="rgba(255,255,255,0.15)"
                  rangeColor="#6fb2ff"
                  thumbColor="#6fb2ff"
                />
                <span className="w-10 text-right text-xs text-white/60 tabular-nums">{brightness}%</span>
              </div>

              <div className="h-px bg-white/10" />

              <div className="space-y-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-ubuntu hover:bg-white/5"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Wifi size={16} />
                    <div>
                      <div className="text-sm font-semibold text-white">Bodhini&apos;s Wifi</div>
                      <div className="text-xs text-white/60">Connected · Secure</div>
                    </div>
                  </div>
                  <Switch
                    checked={wifiOn}
                    onCheckedChange={(checked) => setWifiOn(Boolean(checked))}
                    aria-label="Toggle WiFi"
                  />
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-ubuntu hover:bg-white/5"
                >
                  <div className="flex items-center gap-3 text-left">
                    <Bluetooth size={16} />
                    <div>
                      <div className="text-sm font-semibold text-white">Bluetooth</div>
                      <div className="text-xs text-white/60">Off</div>
                    </div>
                  </div>
                  <Switch
                    checked={bluetoothOn}
                    onCheckedChange={(checked) => setBluetoothOn(Boolean(checked))}
                    aria-label="Toggle Bluetooth"
                  />
                </button>

                <div className="flex w-full items-center justify-between rounded-lg px-3 py-2">
                  <div className="flex items-center gap-3 text-left">
                    <Battery size={16} />
                    <div>
                      <div className="text-sm font-semibold text-white">Battery</div>
                      <div className="text-xs text-white/60">
                        {batteryRemaining} ({batteryLevel}%)
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-white/60" aria-hidden />
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-1 rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-white transition-ubuntu hover:bg-white/10"
                >
                  <Settings size={15} />
                  Settings
                </button>
                <button
                  type="button"
                  onClick={handlePowerAction}
                  className="flex items-center justify-center gap-1 rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-white transition-ubuntu hover:bg-white/10"
                >
                  <Lock size={15} />
                  Lock
                </button>
                <button
                  type="button"
                  onClick={handlePowerAction}
                  className="flex items-center justify-center gap-1 rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-white transition-ubuntu hover:bg-white/10"
                >
                  <Power size={15} />
                  Power
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
