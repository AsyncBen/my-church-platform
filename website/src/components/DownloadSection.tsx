import React from "react";
import { Smartphone } from "lucide-react";
import { Link } from "react-router";

// Types
type StoreType = "apple" | "google";

interface AppStoreBadgeProps {
  store: StoreType;
}

interface MenuItem {
  icon: string;
  label: string;
  val: string;
}

interface QRCell {
  isFilled: boolean;
  style: React.CSSProperties;
}

// Components
const AppStoreBadge: React.FC<AppStoreBadgeProps> = ({ store }) => {
  const storeConfig: Record<StoreType, { icon: string; subtitle: string; name: string }> = {
    apple: {
      icon: "🍎",
      subtitle: "Download on the",
      name: "App Store",
    },
    google: {
      icon: "▶",
      subtitle: "Get it on",
      name: "Google Play",
    },
  };

  const { icon, subtitle, name } = storeConfig[store];

  return (
    <a
      href="#"
      className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-xl"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(8px)",
        minWidth: 180,
      }}
    >
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div>
        <div className="text-white/50 text-xs">{subtitle}</div>
        <div className="text-white font-semibold text-base leading-tight" style={{ fontFamily: "var(--font-display)" }}>
          {name}
        </div>
      </div>
    </a>
  );
};

const QRCode: React.FC = () => {
  const generateQRPattern = (): QRCell[] => {
    const cornerPositions: number[] = [
      0, 1, 2, 6, 7, 8, 12, 13, 14, 15, 5, 35, 36, 37, 38, 42, 43, 44, 47, 48, 49,
    ];
    
    return Array.from({ length: 49 }, (_, i) => {
      const isFilled: boolean = cornerPositions.includes(i) || Math.random() > 0.55;
      
      return {
        isFilled,
        style: {
          width: 6,
          height: 6,
          background: isFilled ? "#0F1C3F" : "transparent",
          borderRadius: 1,
        },
      };
    });
  };

  const qrCells: QRCell[] = React.useMemo(() => generateQRPattern(), []);

  return (
    <div
      className="p-4 rounded-2xl flex flex-col items-center gap-2"
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
    >
      {/* Simulated QR pattern */}
      <div
        className="w-24 h-24 rounded-xl flex items-center justify-center"
        style={{ background: "#fff" }}
      >
        <div
          className="grid gap-0.5"
          style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, padding: 6 }}
        >
          {qrCells.map((cell: QRCell, index: number) => (
            <div
              key={`qr-cell-${index}`}
              style={cell.style}
              role="img"
              aria-label={`QR code module ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="text-white/50 text-xs text-center">Scan to download</div>
    </div>
  );
};

const PreviewPhone: React.FC = () => {
  const menuItems: MenuItem[] = [
    { icon: "📖", label: "Daily Verse", val: "Psalm 23:1" },
    { icon: "📣", label: "Announcements", val: "3 new" },
    { icon: "👥", label: "Youth Ministry", val: "5 msgs" },
    { icon: "💛", label: "Give", val: "Quick access" },
  ];

  const bottomNavIcons: string[] = ["🏠", "📖", "👥", "🔔", "👤"];

  return (
    <div
      className="relative rounded-[2.5rem] overflow-hidden shadow-2xl"
      style={{
        width: 200,
        height: 400,
        background: "#0F1C3F",
        border: "2px solid rgba(255,255,255,0.12)",
        boxShadow: "0 40px 80px rgba(27,58,122,0.5), 0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="p-5 pt-7">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "var(--church-gold)" }}
          >
            <span style={{ fontSize: 14 }}>✝</span>
          </div>
          <span style={{ fontFamily: "var(--font-display)", color: "#fff", fontWeight: 700, fontSize: 14 }}>
            My Church
          </span>
        </div>

        <div className="text-white/40 text-xs mb-3">Good morning, Sarah 👋</div>

        <div
          className="rounded-xl p-3 mb-3"
          style={{ background: "rgba(200,150,44,0.12)", border: "1px solid rgba(200,150,44,0.2)" }}
        >
          <div className="text-xs mb-1" style={{ color: "var(--church-gold-light)" }}>📅 UPCOMING</div>
          <div className="text-white/80 text-xs font-medium">Sunday Service · 10:00 AM</div>
          <div className="text-white/40 text-xs">Grace Community Church</div>
        </div>

        {menuItems.map((item: MenuItem) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 py-2 border-b border-white/5"
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            <div className="flex-1">
              <div className="text-white/70 text-xs">{item.label}</div>
            </div>
            <div className="text-white/40 text-xs">{item.val}</div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-around"
        style={{ background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {bottomNavIcons.map((icon: string, index: number) => (
          <button 
            key={`nav-icon-${index}`} 
            style={{ fontSize: 16, opacity: index === 0 ? 1 : 0.4 }}
            aria-label={`Navigation item ${index + 1}`}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export const DownloadSection: React.FC = () => {
  return (
    <section
      id="download"
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0B1A40 0%, #1B3A7A 60%, #0F2455 100%)",
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(200,150,44,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text + downloads */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
              style={{
                background: "rgba(200,150,44,0.15)",
                border: "1px solid rgba(200,150,44,0.3)",
                color: "var(--church-gold-light)",
              }}
            >
              <Smartphone size={14} />
              Available Now
            </div>

            <h2
              className="text-white mb-5 leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Your Church,
              <br />
              <em style={{ color: "var(--church-gold-light)" }}>Always in Your Pocket</em>
            </h2>

            <p className="text-white/60 text-base leading-relaxed mb-10">
              Download the My Church app and stay connected to your congregation, your
              sermons, your ministry, and your calling — anywhere, any time.
            </p>

            {/* Download buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <AppStoreBadge store="apple" />
              <AppStoreBadge store="google" />
            </div>

            {/* QR row */}
            <div className="flex items-center gap-4">
              <QRCode />
              <div>
                <div className="text-white/80 text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  Scan to Download
                </div>
                <div className="text-white/40 text-xs leading-relaxed">
                  Point your camera at the QR code<br />to get the app instantly.
                </div>
              </div>
            </div>
          </div>

          {/* Phones */}
          <div className="flex justify-center items-end gap-6">
            <div className="translate-y-8 opacity-70 scale-90">
              <PreviewPhone />
            </div>
            <div>
              <PreviewPhone />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;