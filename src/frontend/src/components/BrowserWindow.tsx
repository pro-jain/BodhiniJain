interface BrowserWindowProps {
  url: string;
}

export default function BrowserWindow({ url }: BrowserWindowProps) {
  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{ background: "#0f0d18" }}
    >
      <iframe
        title="In-app browser"
        src={url}
        className="w-full h-full"
        style={{ border: "none" }}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  );
}
