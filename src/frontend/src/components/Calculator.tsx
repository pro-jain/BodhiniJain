import { useMemo, useState } from "react";

const buttons = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "=",
  "+",
];

function isSafeExpression(expr: string) {
  return /^[0-9+\-*/.()\s]*$/.test(expr);
}

export default function Calculator() {
  const [expr, setExpr] = useState("0");
  const [error, setError] = useState<string | null>(null);

  const display = useMemo(() => (expr === "" ? "0" : expr), [expr]);

  const append = (val: string) => {
    setError(null);
    setExpr((prev) => {
      if (prev === "0" && /[0-9.]/.test(val)) return val;
      return prev + val;
    });
  };

  const clearAll = () => {
    setExpr("0");
    setError(null);
  };

  const backspace = () => {
    setError(null);
    setExpr((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
  };

  const evaluate = () => {
    if (!isSafeExpression(expr)) {
      setError("Invalid characters");
      return;
    }
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${expr || "0"})`)();
      const next = Number.isFinite(result) ? result.toString() : "0";
      setExpr(next);
      setError(null);
    } catch (e) {
      setError("Error");
    }
  };

  const handlePress = (val: string) => {
    if (val === "=") {
      evaluate();
    } else {
      append(val);
    }
  };

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        background: "linear-gradient(160deg, rgba(18,18,24,0.95), rgba(12,8,16,0.9))",
        color: "white",
        padding: "12px",
        gap: "12px",
      }}
    >
      <div
        className="rounded-lg px-3 py-2"
        style={{
          minHeight: "72px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 6px rgba(0,0,0,0.35)",
        }}
      >
        <div className="text-xs text-white/60" style={{ minHeight: "16px" }}>
          {error ?? ""}
        </div>
        <div
          className="text-right font-mono font-semibold"
          style={{ fontSize: "24px", wordBreak: "break-all" }}
        >
          {display}
        </div>
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg py-2 text-sm font-semibold"
          style={{ background: "rgba(233,84,32,0.18)", border: "1px solid rgba(233,84,32,0.35)" }}
        >
          AC
        </button>
        <button
          type="button"
          onClick={backspace}
          className="rounded-lg py-2 text-sm font-semibold"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          ⌫
        </button>
        <button
          type="button"
          onClick={() => append("(")}
          className="rounded-lg py-2 text-sm font-semibold"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          (
        </button>
        <button
          type="button"
          onClick={() => append(")")}
          className="rounded-lg py-2 text-sm font-semibold"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          )
        </button>

        {buttons.map((val) => {
          const isOp = ["/", "*", "-", "+", "="]; // highlight ops
          const highlight = isOp.includes(val);
          return (
            <button
              key={val}
              type="button"
              onClick={() => handlePress(val)}
              className="rounded-lg py-3 font-semibold"
              style={{
                background: highlight
                  ? "rgba(233,84,32,0.15)"
                  : "rgba(255,255,255,0.08)",
                border: highlight
                  ? "1px solid rgba(233,84,32,0.45)"
                  : "1px solid rgba(255,255,255,0.1)",
                color: highlight ? "#ffd7c2" : "white",
              }}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );
}
