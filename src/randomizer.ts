export default function randomizer(): string {
  let id: string = '', index: number;
  for (index = 0; index < 5; index++) id += random10();
  id += '-';
  for (index = 0; index < 8; index++) id += random10();
  id += '-';
  for (index = 0; index < 4; index++) id += random10();

  return id;
}

function random10(): string {
  return Math.round(Math.random() * 10).toString();
}
