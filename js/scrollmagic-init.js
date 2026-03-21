// Inicializar o controller do ScrollMagic
const controller = new ScrollMagic.Controller();

// Cena para a seção de Projetos
if (document.getElementById("projetos")) {
  new ScrollMagic.Scene({
    triggerElement: "#projetos",
    triggerHook: 0.8,
    reverse: false
  })
  .setClassToggle("#projetos .card-css", "fade-in-up")
  .addTo(controller);
}

// Seção de atuação/sobre
if (document.getElementById("atuacao")) {
  new ScrollMagic.Scene({
    triggerElement: "#atuacao",
    triggerHook: 0.8,
    reverse: false
  })
  .setClassToggle("#atuacao .card-css", "fade-in-up")
  .addTo(controller);
}
