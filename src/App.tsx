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
  wrapText(ctx, text, image.width / 2, 940, 128);

  ctx.font = "56px Zapf Chance";
  ctx.textAlign = "center";
  ctx.fillStyle = "#000";
  wrapText(ctx, details, 810, 1420, 86);

  ctx.font = "48px Zapf Chance";
  ctx.fillText(grade, 534, 1920);

  ctx.font = "48px Zapf Chance";
  ctx.fillText(name, 1050, 1920);

  ctx.font = "48px Zapf Chance";
  ctx.fillText(date, 770, 2030);

  const url = await fetch(ctx.canvas.toDataURL())
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob));

  return url;
};

const useField = (initialValue: string | (() => string)) => {
  const [value, setValue] = React.useState(initialValue);
  const _value = React.useDeferredValue(value);

  return [
    _value,
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(e.target.value),
  ] as const;
};

function App() {
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D>();
  const [title, handleTitleChange] = useField("Андрію Стирті");
  // const [details, handleDetailsChange] = useField(
  //   "Від імені особового складу військової частини #__\nта себе особисто висловлюємо Вам слова подяки\nза активну громадську позицію, вагомий внесок\nу справу зміцнення бойової готовності\nЗбройних сил України\nЗдоров’я Вам, сил, невичерпної енергії!"
  // );
  const [details, handleDetailsChange] = useField(
    `Командування Військової частини А4790 та
особовий склад щиро вдячні Вам за
підтримку та благодійну допомогу.
Ми високо цінуємо Вашу ініціативу та допомогу і,
в свою чергу, зробимо все, щоб виправдати вашу довіру
та гідно виконати обов'язок із захисту України,
її територіальної цілісності та недоторканості`
  );
  const [grade, handleGradeChange] = useField("");
  const [name, handleNameChange] = useField("");
  const [date, handleDateChange] = useField(() =>
    new Date().toLocaleDateString("ru-RU")
  );
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
      <textarea
        className="input name-input"
        defaultValue={title}
        onChange={handleTitleChange}
        autoFocus
        placeholder="Ім'я Прізвище"
        rows={2}
      ></textarea>
      <textarea
        placeholder="Опис"
        className="input details-input"
        defaultValue={details}
        name="details"
        onChange={handleDetailsChange}
        rows={10}
      ></textarea>
      <input
        defaultValue={grade}
        onChange={handleGradeChange}
        placeholder="Військова Посада"
      />
      <input
        defaultValue={name}
        onChange={handleNameChange}
        placeholder="Прізвище Ім'я"
      />
      <input
        defaultValue={date}
        onChange={handleDateChange}
        placeholder="Дата"
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
          download={`Подяка_${title?.replace(/\s/, "_")}.png`}
        >
          <img src={result} width="100%" />
        </a>
      </div>
    </main>
  );
}

export default App;
