"use client";

import { MenuBar } from "./MenuBar";
import { Desktop } from "./Desktop";
import { Dock } from "./Dock";
import { WindowFrame } from "./Window";
import { useOs } from "./WindowManager";
import { FinderApp } from "./apps/FinderApp";
import { TextEditApp } from "./apps/TextEditApp";

export function OsChrome() {
  const { windows, getBody } = useOs();

  return (
    <>
      <Desktop />
      <MenuBar />
      {windows.map((win) => (
        <WindowFrame key={win.id} win={win}>
          {win.payload.kind === "finder" ? (
            <FinderApp place={win.payload.place} />
          ) : win.payload.kind === "textedit" ? (
            getBody(win.id) ?? (
              <TextEditApp
                collection={win.payload.collection}
                slug={win.payload.slug}
              />
            )
          ) : (
            getBody(win.id)
          )}
        </WindowFrame>
      ))}
      <Dock />
    </>
  );
}
