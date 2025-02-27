// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="intro.html"><strong aria-hidden="true">1.</strong> Intro</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">2.</strong> System Overview</div></li><li class="chapter-item expanded "><a href="memory.html"><strong aria-hidden="true">3.</strong> Memory Layout</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.</strong> Built-in Peripherals</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="registers.html"><strong aria-hidden="true">4.1.</strong> IO Register Summary</a></li><li class="chapter-item expanded "><a href="graphics.html"><strong aria-hidden="true">4.2.</strong> Graphics</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="backgrounds.html"><strong aria-hidden="true">4.2.1.</strong> Backgrounds</a></li><li class="chapter-item expanded "><a href="sprites.html"><strong aria-hidden="true">4.2.2.</strong> OAM (Sprites)</a></li><li class="chapter-item expanded "><a href="windowing.html"><strong aria-hidden="true">4.2.3.</strong> Windowing</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.2.4.</strong> Mosaic</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.2.5.</strong> Blending</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.2.6.</strong> Stereoscopy</div></li></ol></li><li class="chapter-item expanded "><a href="audio/introduction.html"><strong aria-hidden="true">4.3.</strong> Audio</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="audio/directsound.html"><strong aria-hidden="true">4.3.1.</strong> Direct Sound</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.3.2.</strong> DMG Sound</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="audio/sound1.html"><strong aria-hidden="true">4.3.2.1.</strong> Sound Channel 1</a></li><li class="chapter-item expanded "><a href="audio/sound2.html"><strong aria-hidden="true">4.3.2.2.</strong> Sound Channel 2</a></li><li class="chapter-item expanded "><a href="audio/sound3.html"><strong aria-hidden="true">4.3.2.3.</strong> Sound Channel 3</a></li><li class="chapter-item expanded "><a href="audio/sound4.html"><strong aria-hidden="true">4.3.2.4.</strong> Sound Channel 4</a></li></ol></li><li class="chapter-item expanded "><a href="audio/registers.html"><strong aria-hidden="true">4.3.3.</strong> Sound Registers</a></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.4.</strong> DMA</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.5.</strong> Timers</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.6.</strong> External IO</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">4.6.1.</strong> Keypad Buttons</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.6.2.</strong> Serial Port</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">4.6.2.1.</strong> Normal / SPI</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.6.2.2.</strong> Multiplay</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.6.2.3.</strong> JOYBUS</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.6.2.4.</strong> UART</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.6.2.5.</strong> GPIO</div></li></ol></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.7.</strong> Interrupt Controller</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.8.</strong> System Control</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">4.8.1.</strong> Cartridge Slot</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.8.2.</strong> Power-Saving Features</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.8.3.</strong> Test Mode</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">4.8.4.</strong> Game Boy Color mode</div></li></ol></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.</strong> Programmers&#39; Reference</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="cpu.html"><strong aria-hidden="true">5.1.</strong> CPU</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.</strong> BIOS</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="bios.html"><strong aria-hidden="true">5.2.1.</strong> Built-in Functions (SWIs)</a></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.1.1.</strong> System Functions</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.1.2.</strong> Math Functions</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.1.3.</strong> Memory Functions</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.1.4.</strong> Decompression Functions</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.1.5.</strong> Sound Functions</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.1.6.</strong> MusicPlayer Functions</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.1.7.</strong> Multiboot Function</div></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.2.</strong> BIOS Memory</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.3.</strong> Startup Sequence</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.4.</strong> Multiboot</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.2.5.</strong> MusicPlayer</div></li></ol></li><li class="chapter-item expanded "><a href="interrupts.html"><strong aria-hidden="true">5.3.</strong> Interrupt Handling</a></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.</strong> Cartridges</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.1.</strong> Cartridge Header</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.2.</strong> Save Types</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.2.1.</strong> SRAM</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.2.2.</strong> EEPROM</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.2.3.</strong> Flash</div></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.3.</strong> Cartridge Hardware</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.3.1.</strong> GPIO Cartridge</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.3.1.1.</strong> Cartridge RTC</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.3.1.2.</strong> Cartridge Light Sensor</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.3.1.3.</strong> Cartridge Rumble</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.3.1.4.</strong> Cartridge Gyroscope</div></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.3.2.</strong> Cartridge Accelerometer</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.4.3.3.</strong> e-Reader</div></li></ol></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.5.</strong> Accessories</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">5.5.1.</strong> Game Boy Player</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">5.5.2.</strong> Wireless Adapter</div></li></ol></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.</strong> Hardware Specifications</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">6.1.</strong> Pinouts</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">6.1.1.</strong> Cartridge</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.1.2.</strong> LCD</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.1.3.</strong> EXT Ports</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.1.4.</strong> SoC</div></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.2.</strong> Signals and Buses</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">6.2.1.</strong> Cartridge Protocol</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.2.2.</strong> LCD Driving Waveforms</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.2.3.</strong> EXRT Port Signals</div></li><li><ol class="section"><li class="chapter-item expanded "><div><strong aria-hidden="true">6.2.3.1.</strong> SIO SPI</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.2.3.2.</strong> SIO Multiplay</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.2.3.3.</strong> SIO JOYBUS</div></li><li class="chapter-item expanded "><div><strong aria-hidden="true">6.2.3.4.</strong> SIO UART</div></li></ol></li></ol></li></ol></li><li class="chapter-item expanded "><div><strong aria-hidden="true">7.</strong> Guides</div></li><li><ol class="section"><li class="chapter-item expanded "><a href="fixed-point-math.html"><strong aria-hidden="true">7.1.</strong> Fixed-Point Math for Newbies</a></li><li class="chapter-item expanded "><a href="bootleg-carts/introduction.html"><strong aria-hidden="true">7.2.</strong> Bootleg Carts</a></li></ol></li><li class="chapter-item expanded "><a href="ack.html"><strong aria-hidden="true">8.</strong> Acknowledgements</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
