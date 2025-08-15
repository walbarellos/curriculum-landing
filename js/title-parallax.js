document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".title-name");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!title || reduceMotion.matches) return;

    title.classList.add("parallax");

    document.addEventListener("mousemove", (e) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 10;
        const y = (e.clientY / innerHeight - 0.5) * 10;
        title.style.transform = `rotateX(${y * -1}deg) rotateY(${x}deg)`;
    });

    // Reset ao sair da janela
    document.addEventListener("mouseleave", () => {
        title.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
});
