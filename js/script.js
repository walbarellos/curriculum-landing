 const controller = new ScrollMagic.Controller();
 ["#atuacao", "#projetos", "#habilidades", "#certificados", "#contato"].forEach((section) => {
   new ScrollMagic.Scene({
     triggerElement: section,
     triggerHook: 0.8,
     reverse: false
   })
   .on("enter", function () {
     gsap.to(section, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
   })
   .addTo(controller);
 });
