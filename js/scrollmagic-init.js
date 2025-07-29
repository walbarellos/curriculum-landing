new ScrollMagic.Scene({
  triggerElement: "#projetos",
  triggerHook: 0.8,
  reverse: false
})
.setClassToggle("#projetos .card-css", "fade-in-up")
.addTo(controller);

new ScrollMagic.Scene({
  triggerElement: "#habilidades",
  triggerHook: 0.8,
  reverse: false
})
.setClassToggle("#habilidades .card-css", "fade-in-up")
.addTo(controller);
