import React, { ChangeEvent } from "react";
import template from "./templates/template_empty.png";
// import template from "./templates/thanks.png";

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  lineHeight: number
) {
  const lines = text.split("\n");
  let line = "";

  const textHeight = lines.length * lineHeight;
  y -= textHeight / 2;

  for (let n = 0; n < lines.length; n++) {
    ctx.fillText(line, x, y);
    line = lines[n] + " ";
    y += lineHeight;
  }
  ctx.fillText(line, x, y);
}

const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve) => {
    const image = new Image();
    image.addEventListener("load", (e) => resolve(image));
    image.src = url;
  });

const createImageFromTemplate = async (
  ctx: CanvasRenderingContext2D,
  wallpaper: string,
  text: string,
  details: string,
  grade: string,
  name: string,
  date: string
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

  ctx.font = "56px Zapf Chance";
  ctx.textAlign = "center";
  ctx.fillStyle = "#000";
  wrapText(ctx, details, 810, 1420, 86);

  ctx.font = "48px Zapf Chance";
  ctx.fillText("Генерал", 534, 1920);

  ctx.font = "48px Zapf Chance";
  ctx.fillText("Прізвище Ім'я", 1050, 1920);

  ctx.font = "48px Zapf Chance";
  ctx.fillText("01.01.2021", 770, 2030);

  const url = await fetch(ctx.canvas.toDataURL())
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob));

  return url;
};

const useObjectForm = <T extends Record<string, string>>(initialValues: T) => {
  const [values, setValues] = React.useState(initialValues);
  return {
    values,
    handleChange: ({
      target: { name, value },
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues({
        ...values,
        [name]: value,
      });
    },
  };
};

function App() {
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D>();
  const { values, handleChange } = useObjectForm({
    title: "Андрію Стирті",
    details:
      "Від імені особового складу військової частини #__\nта себе особисто висловлюємо Вам слова подяки\nза активну громадську позицію, вагомий внесок\nу справу зміцнення бойової готовності\nЗбройних сил України\nЗдоров’я Вам, сил, невичерпної енергії!",
    grade: "asdasd",
    name: "asdasd",
    date: "01.01.2022",
  });
  const { title, details, grade, name, date } = React.useDeferredValue(values);
  const [result, setResult] = React.useState<string>();

  React.useEffect(() => {
    if (!ctx) return;

    (async () => {
      const url = await createImageFromTemplate(
        ctx,
        template,
        title,
        details,
        grade,
        name,
        date
      );
      setResult(url);
    })();
  }, [ctx, template, title, details, grade, name, date]);

  return (
    <main>
      <input
        className="input name-input"
        type="text"
        value={title}
        name="title"
        onChange={handleChange}
        autoFocus
        placeholder="Ім'я Прізвище"
      />
      <textarea
        placeholder="Опис"
        className="input details-input"
        value={details}
        name="details"
        onChange={handleChange}
        rows={10}
      ></textarea>
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
          download={`Подяка_${title?.replace(/\s/, "_")}.png`}
        >
          <img src={result} width="100%" />
        </a>
      </div>
    </main>
  );
}

export default App;
