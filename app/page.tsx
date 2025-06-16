import { Accordion } from "./components/accordion";

export default function Home() {
  const list = ["Item 1", "Item 2", "Item 3"];
  return (
    <>
      <Accordion list={list} />
    </>
  );
}
