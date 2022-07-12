import React from "react";
import template from "./templates/thanks.png";

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve) => {
    const image = new Image();
    image.addEventListener("load", (e) => resolve(image));
    image.src = url;
  });

const createImageFromTemplate = async (
  ctx: CanvasRenderingContext2D,
  wallpaper: string,
  text: string
) => {
  const wallpaperImage = await loadImage(wallpaper);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const image = { width: 1600, height: 2264 };

  ctx.canvas.width = image.width;
  ctx.canvas.height = image.height;

  ctx.drawImage(wallpaperImage, 0, 0, image.width, image.height);

  ctx.font = "128px Zapf Chance";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(135, 15, 15, 0.9)";
  ctx.fillText(text, image.width / 2, 1010, 1100);

  const url = await fetch(ctx.canvas.toDataURL())
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob));

  return url;
};

function App() {
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D>();
  const [text, setText] = React.useState("Андрію Стирті");
  const [result, setResult] = React.useState<string>();
  const _text = React.useDeferredValue(text);

  React.useEffect(() => {
    if (!ctx) return;

    (async () => {
      const url = await createImageFromTemplate(ctx, template, _text);
      setResult(url);
    })();
  }, [ctx, template, _text]);

  return (
    <main>
      <input
        className="name-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        placeholder="Ім'я Прізвище"
      />
      <canvas
        ref={(canvas) => setCtx(canvas?.getContext("2d") || undefined)}
        width="1600"
        height="2264"
        style={{
          width: "400px",
          maxWidth: "100%",
        }}
      ></canvas>
      <div style={{ width: "100%", boxSizing: "border-box" }}>
        <a
          href={result}
          target="_blank"
          download={`Подяка_${_text.replace(/\s/, "_")}.png`}
        >
          <img src={result} width="100%" />
        </a>
      </div>
    </main>
  );
}

export default App;
