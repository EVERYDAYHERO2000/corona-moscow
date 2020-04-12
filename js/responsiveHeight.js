export default function () {
    let vh;

    const setVh = () => {
      vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty(`--vh`, `${vh}px`);
    };

    setVh();

    window.addEventListener(`resize`, () => {
      setVh();
    });
}
