document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const links = sidebar.querySelectorAll(".nav-link-sidebar");

    let sidebarOpen = false;

    // Função de animação para abrir/fechar o menu
    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
        if (sidebarOpen) {
            sidebar.classList.remove("-translate-x-full");
            sidebar.classList.add("translate-x-0");

            gsap.fromTo(sidebar, { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" });

            // animação nos links individualmente
            gsap.fromTo(links, { opacity: 0, x: -20 }, {
                opacity: 1,
                x: 0,
                stagger: 0.1,
                delay: 0.1,
                duration: 0.4,
                ease: "power2.out"
            });
        } else {
            gsap.to(sidebar, {
                x: -200,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    sidebar.classList.remove("translate-x-0");
                    sidebar.classList.add("-translate-x-full");
                }
            });
        }
    }

    toggle.addEventListener("click", toggleSidebar);

    // Fecha a sidebar ao clicar em qualquer link
    links.forEach(link => {
        link.addEventListener("click", () => {
            if (sidebarOpen) toggleSidebar();
        });

            // Hover elegante para cada item
            link.addEventListener("mouseenter", () => {
                gsap.to(link, {
                    scale: 1.05,
                    color: "#34d399",
                    duration: 0.2
                });
            });
            link.addEventListener("mouseleave", () => {
                gsap.to(link, {
                    scale: 1,
                    color: "#e5e7eb",
                    duration: 0.2
                });
            });
    });
});
