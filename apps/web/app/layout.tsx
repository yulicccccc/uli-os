import type { ReactNode } from "react";

export const metadata = {
  title: "Uli OS｜生活认知操作系统",
  description: "通过持续、高质量的对话，把经历转化为证据、模型、身份与人生叙事。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
