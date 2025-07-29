document.addEventListener("DOMContentLoaded", () => {
  const footerIcons = document.querySelectorAll("#contato img");

  // Animação de entrada (com leve elevação e fade)
  gsap.from(footerIcons, {
    y: 20,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power2.out"
  });

  // Efeito hover animado individual com brilho
  footerIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", () => {
      gsap.to(icon, {
        scale: 1.25,
        filter: "drop-shadow(0 0 6px #10b981)",
              rotate: 3,
              duration: 0.3,
              ease: "power2.out"
      });
    });

    icon.addEventListener("mouseleave", () => {
      gsap.to(icon, {
        scale: 1,
        filter: "drop-shadow(0 0 0 transparent)",
              rotate: 0,
              duration: 0.3,
              ease: "power2.out"
      });
    });
  });
});
