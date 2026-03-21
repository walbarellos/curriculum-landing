// Registrar o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Script para animações de entrada das seções
document.addEventListener("DOMContentLoaded", () => {
  const sections = ["#atuacao", "#projetos", "#certificados", "#contato"];
  
  sections.forEach((id) => {
    const el = document.querySelector(id);
    if (el) {
      gsap.to(id, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: id,
          start: "top 85%",
        }
      });
    }
  });
});
